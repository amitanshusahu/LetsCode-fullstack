
const express = require('express');
const app = express();
const port = 3010;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const docker = new require("dockerode")();
const amqp = require("amqplib");
const { v4: uuidv4 } = require('uuid');
const cluster = require("cluster");
const os = require("os");




/// ------------- MIDDLEWARES ------------------

app.use(express.json());
app.use(cors());

// jwt
let secretKey = "youitssecret";
const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "no token provided" });

  // verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: "failed to authenticate token" });

    req.user = decoded;
    next(); // call the next middleware(if any)
  })
}




/// ---- temp vars------
let users = [
  {
    username: "amith",
    password: "12345",
    solved: [1, 3, 4] // problem ids
  },
  {
    username: "avaya",
    password: "12345",
    solved: [2, 1]
  }
];
const problems = require("./problems");
const { resolve } = require('path');
const { rejects } = require('assert');




/// ------------------ RCP SERVER(WORKER) -------------------

async function startRcpServerAsWorker() {

  //connect to rabbitmq
  const { connection, channel } = await connectRabbitMQ();
  // declare rcpTestExecutionqueue
  channel.prefetch(1);
  channel.assertQueue(testExecutionQueue);

  // cousumer for rcpTestExecutionQueue
  channel.consume(testExecutionQueue, async msg => {

    const { code, language, problem, isTest} = JSON.parse(msg.content.toString());

    try {
      // process the rcp request / execute code inside container
      const executionTestResult = await executeTestCodeInContainer(code, language, problem, isTest);

      // publish the result to the response queue
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(executionTestResult)), {
        correlationId: msg.properties.correlationId
      });

      // acknowledge the message (dqueue)
      channel.ack(msg);
    }
    catch (err) {
      console.log("Error processing RCP request for test execution: ", err);
      process.exit(1);    // terminate
    }
  });

  // declare rcpcodeexecutionqueue
  channel.prefetch(1);        // limit the no. of unack msg, fetch only one msg
  channel.assertQueue(codeExecutionQueue);

  // consumer for rcpCodeExecutionQueue
  channel.consume(codeExecutionQueue, async msg => {

    const { code, language } = JSON.parse(msg.content.toString());

    try {
      // process the rcp request / execute code inside container
      const executionResult = await executeUserCodeInContainer(code, language);

      // publish the result to the response queue
      channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(executionResult)), {
        correlationId: msg.properties.correlationId
      });

      // acknowledge the message (dqueue)
      channel.ack(msg);
    }
    catch (err) {
      console.log("Error processing RCP request for execution: ", err);
      process.exit(1);    // terminate
    }

  });

  

}




/// --------------- RPC CLIENT ----------------

const codeExecutionQueue = "rpcCodeExecutionQueue";
const testExecutionQueue = 'rpcTestExecutionQueue';

// Connect to rabbit mq
async function connectRabbitMQ() {

  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  return { connection, channel };

}

// Publish message to queue
async function publishMessageToCodeExecutionQueue(connection, channel, code, language, res, problem, isTest) {

  // set up responsequeue (temp)
  const responseQueue = await channel.assertQueue("", { exclusive: true });
  const responseQueueName = responseQueue.queue;

  const correlationId = uuidv4();

  // consumer for the response queue
  channel.consume(responseQueueName, msg => {
    if (msg.properties.correlationId == correlationId) {
      const result = JSON.parse(msg.content.toString());
      res.status(200).json(result);
      console.log("logging result form the responsequeue: ",result.result);
      channel.close();
      connection.close();
    }
  }, { noAck: true });

  // check which queue to send
  const queue = isTest ? testExecutionQueue : codeExecutionQueue;

  // publish msg(code) to rcpcodeExecutionQueue / send rcp request
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({ code, language, problem, isTest })), {
    correlationId,
    replyTo: responseQueueName
  });

}




/// ----------------- DOCKER LOGIC ----------------------

// Create container according to user selected language
async function createDockerContainer(language, code, isTest, solutionfunction, input) {

  const containerConfig = {
    Image: getDockerImage(language), //node
    Cmd: getExecutionCommand(language, code, isTest, solutionfunction, input), // ["node", "-e", code]
    Tty: true,
    // HostConfig: {
    //   StopTimeout: 2, // Stop the container after 2 seconds
    // },
  }
  // same as docker create --image imageName --tty --command cmdToRun
  const container = await docker.createContainer(containerConfig)

  return container;

}

// helper fun to get image according to user Selected language
function getDockerImage(language) {

  let image;

  switch (language) {
    case 'cpp':
      image = "gcc"
      break;
    case "js":
      image = "node";
      break;
    case "c":
      image = "gcc";
      break;
    default:
      throw new Error(`unsupprted language: ${language}`);
  }

  return image;

}

// helper fun to get Execution command acc... to user selected language
function getExecutionCommand(language, code, isTest, solutionfunction, input) {

  let cmd;

  if (isTest) {
    switch (language) {
      case "js":
        let testcode = code + `${solutionfunction}(${input})`;
        console.log("code: ", testcode);
        cmd = ["node", "-e", testcode];
        break;
    
      default:
        break;
    }
  }
  else{
    switch (language) {
      case 'cpp':
        cmd = ['bash', '-c', `echo "${code}" > myapp.cpp && g++ -o myapp myapp.cpp && ./myapp`];
        break;
      case "js":
        cmd = ["node", "-e", code];
        break;
      case "c":
        cmd = ['bash', '-c', `echo "${code}" > myapp.c && gcc -o myapp myapp.c && ./myapp`];
        break;
      default:
        throw new Error(`unsupprted language: ${language}`);
    }
  }

  return cmd;

}




/// ------------------- CODE EXECUTION LOGIC -----------------

// run
async function executeUserCodeInContainer(code, language, isTest, solutionfunction, input) {

  return new Promise(async (resolve, reject) => {

    const container = await createDockerContainer(language, code, isTest, solutionfunction, input);
    await container.start();

    // send a TLE after 2sec
    const tle = setTimeout(async () => {
      console.log("sending a tle")
      resolve({ result: "Time Limit Exceed!! 😔 \n \n - Optimize your code \n - Avoid infinite loops", sucess: false });
      await container.stop();
    }, 2000);

    const containerExitStatus = await container.wait(); // wait for container to exit

    // get logs
    const logs = await container.logs({ stdout: true, stderr: true });

    // return output/error
    if (containerExitStatus.StatusCode === 0) {
      resolve({ result: logs.toString(), sucess: true });
      clearTimeout(tle);
      await container.remove();
    } else {
      resolve({ result: logs.toString(), sucess: false });
      clearTimeout(tle);
      await container.remove();
    }
  });
}

// submit
async function executeTestCodeInContainer(code, language, problem, isTest) {

  const { testcases, solutionfunction } = problem;
  return new Promise(async (resolve, reject) =>{
    for (let testcase of testcases){

      if("input" in testcase){

        //get the input and output form the testcase
        const { input, output } = testcase;

        // Execute the user provided code
        const executionResult = await executeUserCodeInContainer(code, language, isTest, solutionfunction, input);

        // compare the execution resut
        const isPassed = await compareResult(executionResult.result, output);

        // return the 1st failed testcase
        if(!isPassed) resolve({result: testcase});

      }
      else{

        //get the output form the testcase
        const { output } = testcase;

        // Execute the user provided code
        const executionResult = await executeUserCodeInContainer(code, language);

        // compare the execution resut
        const isPassed = await compareResult(executionResult.result, output);

        // return the 1st failed testcase
        if(!isPassed) resolve({result: testcase});
      }

    }

    // if everything passed
    resolve({result: true})
  });

}

async function compareResult(executionResult, output){
  
  // parsing the the result to remove the asci escae scequences
  executionResult = executionResult.replace(/\x1B\[[0-9;]*[mG]/g, '').replace(/[\r\n]/g, '');

  console.log("comparing", executionResult , "and", output);

  if (executionResult != output){
    console.log("not same \n");
    return false;
  }else{
    console.log("same \n");
    return true;
  }
}



///----------------- ROUTES -----------------------

app.post('/login', (req, res) => {
  let { username, password } = req.body;

  // check if user exists
  let user = users.find(user => user.username == username);
  if (!user) return res.status(404).json({ message: "User Not Found" });

  let pass = users.find(user => user.password == password);
  if (!pass) return res.status(401).json({ message: "Invalid Password" });

  // generate the token 
  const token = jwt.sign({ name: username }, secretKey);

  res.json({ token });
});

app.post('/signup', (req, res) => {
  let { username, password } = req.body;
  let isUser = users.find(user => user.username == username);

  if (!isUser) {
    let user = { username, password };
    users.push(user);

    // generate the token
    const token = jwt.sign({ name: username }, secretKey);

    res.json({ token });
  }
  else {
    res.status(401).json({ message: "username already exists" });
  }
})

app.get('/problems', (req, res) => {
  res.json({ problems: problems })
})

app.get('/problem', protect, (req, res) => {
  let problemId = req.query.problemid.toString();

  let problem = problems.problems.find(problem => problem.problemId == problemId);
  console.log(problem);

  res.json({ problem: problem });
})

app.post("/run", protect, async (req, res) => {

  let { code, language } = req.body;

  try {

    const { connection, channel } = await connectRabbitMQ();
    await publishMessageToCodeExecutionQueue(connection, channel, code, language, res);

  }
  catch (er) {
    res.status(500).json({ err: "Somethig Went Wrong" });
  }

});

app.post('/submit', protect, async (req, res) => {
  let { code, language, problem } = req.body;
  let isTest = true;

  try {

    const { connection, channel } = await connectRabbitMQ();
    await publishMessageToCodeExecutionQueue(connection, channel, code, language, res, problem, isTest);

  }
  catch (er) {
    res.status(500).json({ err: "somethign went wrong" });
  }

})




/// ------------- SCALE USING CLUSTER ----------------

// get cpu threads
let cpuThreads = os.cpus().length;  // 12 (my i5 12400)
if ( cpuThreads >= 4 ) cpuNum = 4; // limit worker to 4

if (cluster.isMaster) {
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} exited`);
    cluster.fork();
  });
}
else {
startRcpServerAsWorker();

const server = app.listen(port, () => {
  console.log(`server ${process.pid} is listening on port ${port}`)
})

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use`);
    } else {
      console.error('An error occurred:', error);
    }
  });
}
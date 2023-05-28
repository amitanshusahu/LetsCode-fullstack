module.exports.problems = [{
    problemId: 1,
    title: "Hello World",
    difficulty: "Easy",
    desc: {
        info: "print Hello World",
        ex1: "output: Hello World",
        note: "it should complete in O(1), and some info... blala"
    },
    submissions: 12,
    accepted: 10,
    acceptance: "95%",
    template: null,
    solutionfunction: null,
    testcases: [
        {
            output: "Hello World"
        }
    ],

}, {
    problemId: 2,
    title: "Sum of 2 Numbers",
    difficulty: "Medium",
    desc: {
        info: "the function takes 1 parameter which takes an array 2 numbers as input and prints the sum to the console as output",
        ex1: "input: [1,2] \n output: 3",
        ex2: "input: [3, 2] \n output: 5",
        note: "it should complete in O(1), and some info... blala"
    },
    submissions: 12,
    accepted: 10,
    acceptance: "90%",
    template: `function add(num1, num2){
        /* code here */
    }`,
    solutionfunction: "add",
    testcases: [
        {
            input: [2, 3],
            output: 5
        },
        {
            input: [1, 2],
            output: 3
        }
    ]
}];
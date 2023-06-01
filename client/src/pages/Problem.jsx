import styled from "styled-components"
import Navbar from "./components/Navbar"
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import CodeEditor from "./components/CodeEditor";
import { Token } from "../secrets";


export default function Problem() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const pid = searchParams.get("pid");
    const [problem, setProblem] = useState(null);
    const [submission, setSubmission] = useState("");

    const select = useRef();

    const [defaultCode, setDefaultCode] = useState('');
    const [language, setLanguage] = useState('');
    const [code, setCode] = useState('');
    const [executionResult, setResult] = useState("");

    useEffect(() => {
        if(Token === null){
            navigate("../login");
        }
    },[])


    const init = async () => {
        const response = await fetch(`http://localhost:3010/problem?problemid=` + pid, {
            headers: {
                "Authorization": `${Token}`
            },
            method: "GET",
        });

        response.json().then(data => {

            setProblem(data.problem);
            setLanguage("js");
            setDefaultCode(data.problem.template.js);
            select.current.value = "js";
        });

    }

    useEffect(() => {
        init();
    }, [])

    const handleLangChange = (e) => {
        setLanguage(e.target.value);
        switch (e.target.value) {
            case "js":
                setDefaultCode(problem.template.js)
                break;
            case "c":
                setDefaultCode(problem.template.c)
                break;
            case "cpp":
                setDefaultCode(problem.template.cpp)
                break;

            default:
                break;
        }
    }

    const runCodeInServer = async () => {

        document.querySelector("body").style.cursor = "wait";
        let outputBox = document.getElementById("output-box-1");
        outputBox.style.backgroundColor = "#dee6ee";
        outputBox.style.color = "black";
        outputBox.innerText = "Executing...";

        /// hit the /run
        //payload
        let data = {
            "code": parseCode(code),
            "language": language
        };
        console.log(code)
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "Authorization": `${Token}`
            },
            body: JSON.stringify(data)
        }
        let res = await fetch("http://localhost:3010/run", options);

        // get the output as a responce from the server
        let output = await res.json();
        // document.getElementById("output-box-1").innerText = parseLogs(output.result);

        // show output in the output box
        outputBox.innerText = parseLogs(output.result);

        // chage color according to sucess status
        if (output.sucess) {
            outputBox.style.color = "green";
        } else {
            outputBox.style.color = "red";
        }

        document.querySelector("body").style.cursor = "default";
        outputBox.scrollTop = outputBox.scrollHeight; // scroll to bottom

        console.log("render times")

        // // hide terminal heading
        // document.querySelector(".output h4").style.display = "none";
    }

    const parseCode = (code) => {
        if (language == "c" || language == "cpp") {
            return code.replace(/"/g, '\\"');
        } else {
            return code;
        }
    }

    const parseLogs = (logs) => {
        if (language == "js") {
            return logs.replace(/\[90m/g, "... ")
                .replace(/\[39m/g, "")
                .replace(/\[33m/g, "")
                .replace(/\[eval]/g, "In Line");
        }
        else if (language == "c" || language == "cpp") {
            console.log("i am working")
            return logs.replace(/\x1B\[[0-9;]*[m]/g, "")
                .replace(/\[K/g, "");
        }
        else {
            return logs
        }
    }

    const submitCode = async () => {
        /// hit the /run
        //payload
        // show output in the output box
        document.querySelector("body").style.cursor = "wait";
        let outputBox = document.getElementById("output-box-1");
        outputBox.style.backgroundColor = "#dee6ee";
        outputBox.style.color = "black";
        outputBox.innerText = "Executing...";
        let data = {
            "problem": problem,
            "code": parseCode(code),
            "language": language
        };
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                "Authorization": `${Token}`
            },
            body: JSON.stringify(data)
        }
        let res = await fetch("http://localhost:3010/submit", options);

        // get the output as a responce from the server
        let output = await res.json();
        console.log(output)
        // document.getElementById("output-box-1").innerText = parseLogs(output.result);

        

        if (output.result == true) {
            console.log("passed")
            outputBox.innerText = "All Test Passed";
            outputBox.style.backgroundColor = "#c9ffe1";
            outputBox.style.color= "green";
        }
        else {
            let result = "Test Case Failed \n" + JSON.stringify(output.result);
            outputBox.innerText = result;
            outputBox.style.backgroundColor = "#ffc9cf";
            outputBox.style.color='red';
        }
        
        
        document.querySelector("body").style.cursor = "default";
        outputBox.scrollTop = outputBox.scrollHeight; // scroll to bottom


        console.log("render times")

        // // hide terminal heading
        // document.querySelector(".output h4").style.display = "none";
    }

    return (
        <>
            <Navbar />
            <StyledDiv>
                <div className="parentlayout">
                    <h2 id="title"> {problem ? `${problem.problemId} . ${problem.title}` : "Title Not Found"} </h2>
                    <p id="info"> {problem ? problem.desc.info : " description not found "} </p>
                    <p id="note"> {problem ? problem.desc.note : "notes not found "} </p>
                    <h3 className="ex">Example</h3>
                    <div className="block"> {problem ? problem.desc.ex1 : "examples not found"} </div>
                    <h3 className="ex">{problem?.desc?.ex2 ? "Example" : ""}</h3>
                    <div className="block" style={{ display: problem?.desc?.ex2 ? "block" : "none" }}> {problem?.desc?.ex2 ? problem.desc.ex2 : ""} </div>
                </div>

                <div className="parentlayout grid2">
                    <div className="codespace">
                        <select name="language" id="language" onChange={handleLangChange}>
                            <option value="js">JavaScript</option>
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                        </select>

                        <div id="code-editor">
                            {
                                defaultCode && language
                                    ? <CodeEditor defaultCode={defaultCode} language={language} setCode={setCode} />
                                    : "Template Not Provided"
                            }

                        </div>

                        <div className="action">
                            <button onClick={runCodeInServer}>Run</button>
                            <button className="submit" onClick={submitCode}>Submit</button>
                        </div>
                    </div>

                    <div id="output-box-1" className="output">
                        Terminal (Read Only)
                    </div>
                </div>
            </StyledDiv>
        </>
    )
}

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;

    .parentlayout{
        border: 2px solid #f0f0f0;
        padding: 20px;
        border-radius: 10px;
        overflow-x: hidden;
        overflow-y: scroll;
        height: calc(100vh - 140px);

        #info, #note{
            margin: 15px 0px;
        }
        .ex{
            margin: 10px 0px;
        }
        .block{
            padding: 10px;
            background-color: #dee6ee;
            border-radius: 10px;
            color: #525252;
        }

    }
    .grid2{
        display: flex;
        flex-direction: column;
        gap: 30px;

        .codespace{
            button{
                padding: 5px 10px;
                border: none;
                border-radius: 7px;
                background-color: #E9E9ED;
                color: black;
            }
            select{
                padding: 2px 10px;
                border: none;
                border-radius: 7px;
                background-color: #E9E9ED;
            }
            .submit{
                background-color: #0084ff;
                color: white;
            }

            .action{
                display: flex;
                justify-content: flex-end;
                gap: 15px;
            }
        }

        #code-editor{
            height: calc(100vh - 500px);
            width: calc(100% + 20px);
            animation: none;
            margin-left: -20px;
            font-family: 'Courier New', Courier, monospace;
            padding-top: 15px;
            padding-bottom: 15px;
        }

        #code-editor *{
            animation: none !important;
            font-family: 'Courier New', Courier, monospace;
        }

        #output-box-1{
            background-color: #dee6ee;
            height: 250px;
            overflow-y: scroll;
            padding: 15px;
            border-radius: 10px;
        }
    }
`
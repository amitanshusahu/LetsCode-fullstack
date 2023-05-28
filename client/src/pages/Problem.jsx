import styled from "styled-components"
import Navbar from "./components/Navbar"
import ReactMarkdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";

export default function Problem() {
    const [searchParams] = useSearchParams();
    const pid = searchParams.get("pid");
    const [problem, setProblem] = useState(null);
    const [submission, setSubmission] = useState("");

    const init = async () => {
        const response = await fetch(`http://localhost:3010/problem?problemid=` + pid, {
            headers: {
                "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW1pdGgiLCJpYXQiOjE2ODUyMTg4MzF9.W-sOZLi1xrZiW8QmL8BKFLlsApzt9Qe17J7kX0bJV9o"
            },
            method: "GET",
        });

        const json = await response.json();
        console.log(json)
        setProblem(json.problem);
    }

    useEffect(() => {
        init();
    }, [])
    return (
        <>
            <Navbar />
            <StyledDiv>
                <div className="parentlayout">
                    <h2 id="title"> {problem? `${problem.problemId} . ${problem.title}`: "Title Not Found"} </h2>
                    <p id="info"> {problem? problem.desc.info : " description not found "} </p>
                    <p id="note"> {problem? problem.desc.note : "notes not found "} </p>
                    <h3 className="ex">Example</h3>
                    <div className="block"> {problem? problem.desc.ex1 : "examples not found"} </div>
                    <h3 className="ex">{problem?.desc?.ex2 ? "Example" : ""}</h3>
                    <div className="block" style={{display: problem?.desc?.ex2 ? "block" : "none" }}> {problem?.desc?.ex2 ? problem.desc.ex2 : ""} </div>
                </div>
                <div className="parentlayout grid2">
                    <div className="codespace">
                        <select name="language" id="language">
                            <option value="js">JavaScript</option>
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                        </select>
                        <input type="text" />
                        <button>Run</button>
                        <button>Submit</button>
                    </div>
                    <div id="output" className="output">
                        result
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

        #info, #note{
            margin: 15px 0px;
        }
        .ex{
            margin: 10px 0px;
        }
        .block{
            padding: 10px;
            background-color: #e9e8e8;
            border-radius: 10px;
            color: #525252;
        }

    }
`
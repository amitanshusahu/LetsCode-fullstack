import styled from "styled-components";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Token } from "../secrets";

/*
 * Temporary problems array schema
 */


export default function Problemset() {

    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);

    const init = async () => {
        const response = await fetch(`http://localhost:3010/problems`, {
            method: "GET",
        });

        const json = await response.json();
        setProblems(json.problems.problems);
    }

    useEffect(() => {
        init()
    }, []);




    return (
        <>

            <Navbar />

            <StyledDiv>
                <div>
                    <table>
                        <tr>
                            <th>Problem Title</th>
                            <th>Difficulty Level</th>
                            <th>Acceptance Rate</th>
                        </tr>
                        {
                            problems.map(ele => {
                                return (
                                    <tr onClick={() => { navigate(`/problem?pid=${ele.problemId}`) }}>
                                        <td>{ele.problemId + " . " + ele.title}</td>
                                        {getdifficultyColor(ele.difficulty.toLocaleLowerCase(), "td")}
                                        <td>{ele.acceptance}</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            </StyledDiv>
        </>
    )
}

function getdifficultyColor(levelString, EleString) {
    switch (levelString) {
        case "easy":
            return (
                <EleString style={{ color: "green" }}>
                    {levelString.toLocaleUpperCase()}
                </EleString>
            )
            break;
        case "medium":
            return (
                <EleString style={{ color: "orange" }}>
                    {levelString.toLocaleUpperCase()}
                </EleString>
            )
            break;
        case "hard":
            return (
                <EleString style={{ color: "red" }}>
                    {levelString.toLocaleUpperCase()}
                </EleString>
            )
            break;

        default:
            break;
    }
}

const StyledDiv = styled.div`
    table{
        width: 100%;
        border-collapse: collapse;
        th{
            text-align:left;
            font-size: larger;
            padding: 15px;
        }
        
        tr:not(:first-child){
            font-size: medium;
            cursor: pointer;
            &:nth-child(2n){
                background-color: #f2f7f7;
            }
            td{
                padding: 10px;
            }
        }

        tr{
            &:hover{
                cursor: ${
                    (Token === null)
                    ? "not-allowed"
                : "pointer"} 
            }
        }
    }
`
import styled from "styled-components";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router-dom";

/*
 * Temporary problems array schema
 */
const problems = [{
    problemId: 1,
    title: "Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "42%"
}, {
    problemId: 2,
    title: "Bitwise AND of Numbers Range",
    difficulty: "Medium",
    acceptance: "412%"
},
{
    problemId: 3,
    title: "Happy Number",
    difficulty: "Easy",
    acceptance: "54.9%"
},
{
    problemId: 4,
    title: "Remove Linked List Elements",
    difficulty: "Hard",
    acceptance: "42%"
}];

export default function Problemset() {

    const navigate = useNavigate();

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
                                    <tr onClick={() => {navigate(`/problem?${ele.problemId}`)}}>
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
    }
`
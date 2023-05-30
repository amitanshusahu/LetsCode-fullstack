import styled from "styled-components"
import Navbar from "./components/Navbar"
import githubLogo from "../assets/github.png"

export default function Home(){
    return (
        <>
            <Navbar />
            <StyledSection>
                <div className="center">
                    <div className="githubLogo">
                        <img src={githubLogo}/>
                    </div>
                    <div className="action">
                        <button><span className="icon">⭐</span> Contribute</button>
                        <button><span className="icon">💛</span> Follow</button>
                    </div>
                </div>

                <div className="readme">

                </div>
            </StyledSection>
        </>
    )
}

const StyledSection = styled.section`
    .center{
        padding-top: 30px;
        display: flex;
        gap: 30px;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .githubLogo{
            height: 150px;
            img{
                height:inherit
            }
        }

        .action{
            display: flex;
            gap: 30px;

            button{
            all: unset;
            cursor: pointer;
            background-color: lightgrey;
            padding: 5px 20px 5px 0;
            border-radius: 10px;
            font-weight: 500;
            color: #2e2e2e;

            .icon{
                margin-right: 10px;
                background-color: #2e2e2e;
                padding: 5px 10px;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
            }
        }
        }
    }
`
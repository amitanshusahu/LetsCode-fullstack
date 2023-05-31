import styled from "styled-components"
import Navbar from "./components/Navbar"
import githubLogo from "../assets/github.png"
import ss from "../assets/ss-letscode.png"

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
                        <button onClick={() => {window.location.replace("https://github.com/amitanshusahu/LetsCode-fullstack")}}><span className="icon">⭐</span> Contribute</button>
                        <button onClick={() => {window.location.replace("https://github.com/amitanshusahu")}}><span className="icon">💛</span> Follow</button>
                    </div>
                </div>
                
                <div className="readme">
                    <img src={ss} />
                </div>
            </StyledSection>
        </>
    )
}

const StyledSection = styled.section`
    .center{
        padding: 30px 0 30px 0;
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

    .readme{
        padding: 30px;
        img{
            border-radius: 15px;
            width: 100%;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    }
`
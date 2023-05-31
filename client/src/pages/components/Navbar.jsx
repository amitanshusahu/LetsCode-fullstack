import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/loglo.webp";
import userAvtar from "../../assets/user.png"
import { Token } from "../../secrets";

export default function Navbar() {

    const navigate = useNavigate();

    return (
        <StyledDiv>
            <div className="links">
                <div id="logo" onClick={() => {navigate("../")}}><img src={logo} /> LetsCode</div>
                <Link to="../problemset">Problems</Link>
            </div>

            <div>
                {
                    (Token === null)
                        ? (<button onClick={() => {navigate("../login")}}>
                            Login
                        </button>)

                        : (<button
                            className="userAvatar"
                            >
                            <img src={userAvtar} />
                        </button>)
                }
            </div>
        </StyledDiv>
    )
}

const StyledDiv = styled.div`
    display: flex;
    margin-bottom: 30px;
    width: 100%;
    align-items: center;
    gap: 15px;
    justify-content: space-between;

    #logo{
        display: flex;
        align-items: center;
        font-weight: bold;
        cursor: pointer;
    }

    img{
        height: 50px;
    }

    .links{
        display: flex;
        align-items: center;
        gap: 30px;
    }
    
    a{
        color: grey;
    }

    .userAvatar{
        all: unset;
        cursor:pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 999px;

        img{
            height: 30px;
        }
    }
`
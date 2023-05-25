import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/loglo.webp"

export default function Navbar(){
    return (
        <StyledDiv>
            <div className="links">
                <div id="logo"><img src={logo}/> LetsCode</div>
                <Link to="../Problemset">Problems</Link>
            </div>

            <div>
                <button>Login</button>
            </div>
        </StyledDiv>
    )
}

const StyledDiv  = styled.div`
    display: flex;
    margin-bottom: 30px;
    width: 100%;
    align-items: center;
    gap: 15px;
    justify-content: space-between;

    #logo{
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: bold;
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
`
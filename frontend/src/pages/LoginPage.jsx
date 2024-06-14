import { Outlet } from "react-router-dom";
import logo from '../assets/logo.svg';
import '../css/loginPage.css'

export default function LoginPage() {
    

    return (<>
        <div className="login-main fcc">
            <div className="login-topic fcc">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="login-page-heading">Chat Application <br />With <br />Flask And React</h1>
            </div>
            <div className="login-page">
                <Outlet />
            </div>
        </div>
    </>)
}
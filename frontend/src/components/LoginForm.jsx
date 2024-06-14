import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from "react-router-dom";
import {AuthContext} from '../pages/Main'


export default function LoginForm() {

    const auth = useContext(AuthContext)

    const [showPassword, setShowPassword] = useState(false);
    
    const [loginFormData, setLoginFormData] = useState({
        username: '',
        password: ''
    })

    function handleLoginFormData(event) {
        const { name, value } = event.target;
        setLoginFormData(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    }

    async function handleLoginFormSubmit(e) {
        e.preventDefault()
        if (loginFormData.username.length && loginFormData.password.length) {
            
            try {
                auth.setLoading(true);
                let url = auth.url;
                const response = await fetch(`${url}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(loginFormData)
                });
                const responseData = await response.json();
                if (!response.ok) {
                    auth.setFlash([responseData.message,'error'])
                    throw new Error('failed to send data to backend')
                }
                auth.setFlash(['Login Successfull','success'])
                localStorage.setItem('token', responseData.access_token);
                const access_token = responseData.access_token;

                const userDet = responseData.user_data;
                console.log(userDet);
                auth.setUserDet({
                    _id: userDet['_id'],
                    username: userDet['username'],
                    email: userDet['email'],
                    dp:userDet['dp']
                })
            }
            catch (error) {
                console.log(error);
            } finally {
                auth.setLoading(false);
            }
        } else {
            auth.setFlash(['Fill All Fields','error'])
        }
    }

    return (
        <>
            <h1 className="login-title">LOGIN PAGE</h1>
            <div className="login-form-div">
                <form method="post" className="login-form fcc">
                    <div className="input-username fcc">
                        <label htmlFor="username">Username : </label>
                        <input
                            type="text"
                            value={loginFormData.username}
                            onChange={handleLoginFormData}
                            placeholder="Enter Username..."
                            name='username' />
                    </div>
                    <div className="input-password fcc">
                        <label htmlFor="password">Password : </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={loginFormData.password}
                            onChange={handleLoginFormData}
                            placeholder="Enter Password..."
                            name='password' />
                        <p
                            onClick={() => setShowPassword(prev => (!prev))}
                            className="showPasswordIcon"
                        ><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}></FontAwesomeIcon>
                        </p>
                    </div>
                    <div className="input-submit">
                        <button
                            type="button"
                            onClick={handleLoginFormSubmit}
                            >Login
                        </button>
                        <p className="signup-login signup-page-btn fcc">
                            Create New Account ? &nbsp;&nbsp;
                            <NavLink className="signup-login-btn" to="signup">Signup Here</NavLink>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}
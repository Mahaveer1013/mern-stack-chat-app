import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
// import logo from '../assets/logo.svg';
// import { Navigate } from "react-router-dom";
import { AuthContext } from '../pages/Main'

export default function SignupForm() {

    const navigate = useNavigate()

    const auth=useContext(AuthContext)

    const [showPassword, setShowPassword] = useState({
        signup: false,
        signupConfirm: false
    });

    const [signupFormData, setSignupFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    })

    function handleSignupFormData(event) {
        event.preventDefault()
        const { name, value } = event.target;
        setSignupFormData(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    }

    async function handleSignupFormSubmit(e) {
        e.preventDefault()
    
        if (signupFormData.username.length && signupFormData.password.length && signupFormData.email.length ) {
            // console.log('Submitted', signupFormData);
            if (signupFormData.password !== signupFormData.confirmPassword) {
                auth.setFlash(['Passwords Do Not Match', 'error'])
                return;
            }
            try {
                auth.setLoading(true);
                let url = auth.url;
                console.log(`${url}/api/signup`);
                const responseData = await fetch(`${url}/api/signup`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signupFormData)
                });
                if (!responseData.ok) {
                    auth.setFlash(['Username Already Exists','error'])
                    throw new Error('Username Exists');
                }
                console.log(responseData);
                auth.setFlash(['Account Registration Successfull','success'])
                navigate('/login-page')
            } catch (error) {
                console.log(error);
            }finally {
                auth.setLoading(false);
            }
        }
        else {
            auth.setFlash(['Fill all fields','error'])
        }
    }

    function handleShowPassword(type) {
        setShowPassword(prevShowPassword => ({
            ...prevShowPassword, [type]: !prevShowPassword[type]
        }))
    }

    return (
        <>                
            <h1 className="login-title">SIGNUP PAGE</h1>
            <div className="login-form-div signup-form-div">
                <form method="post" className="login-form fcc">
                    <div className="input-username fcc">
                        <label htmlFor="username">Username : </label>
                        <input
                            type="text"
                            value={signupFormData.username}
                            onChange={handleSignupFormData}
                            placeholder="Enter Username..."
                            name='username' />
                    </div>
                    <div className="input-password fcc">
                        <label htmlFor="password">Password : </label>
                        <input
                            type={showPassword.signup ? "text" : "password"}
                            value={signupFormData.password}
                            onChange={handleSignupFormData}
                            placeholder="Enter Password..."
                            name='password' />
                        <p
                            onClick={() => handleShowPassword('signup')}
                            className="showPasswordIcon"
                        ><FontAwesomeIcon icon={showPassword.signup ? faEyeSlash : faEye}></FontAwesomeIcon>
                        </p>
                    </div>
                    <div className="input-password fcc">
                        <label htmlFor="confirmPassword">Confirm Password : </label>
                        <input
                            type={showPassword.signupConfirm ? "text" : "password"}
                            value={signupFormData.confirmPassword}
                            onChange={handleSignupFormData}
                            placeholder="Enter Confirm Password..."
                            name='confirmPassword' />
                        <p
                            onClick={() => handleShowPassword('signupConfirm')}
                            className="showPasswordIcon"
                        ><FontAwesomeIcon icon={showPassword.signupConfirm ? faEyeSlash : faEye}></FontAwesomeIcon>
                        </p>
                    </div>
                    <div className="input-email fcc">
                        <label htmlFor="email">Email : </label>
                        <input
                            type="email"
                            value={signupFormData.email}
                            onChange={handleSignupFormData}
                            placeholder="Enter Email..."
                            name='email' />
                    </div>
                    <div className="input-submit">
                        <button
                            type="button"
                            onClick={handleSignupFormSubmit}
                        >Signup
                        </button>
                        <p className="signup-login login-page-btn fcc">
                            Already Have An Account ? &nbsp;&nbsp;
                            <Link className="signup-login-btn" to="/">Login Here</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}
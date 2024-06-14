import React, { createContext, useEffect, useState } from "react";
import ChatPage from "./ChatPage";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";
import Loading from "../assets/Loading";
import Flash from "../assets/Flash";
import RequireAuth from "../assets/RequireAuth";
import LoginPage from "./LoginPage";
import Chat from "../components/Chat";
import MyProfile from "../components/MyProfile";
import LoginCheck from "../assets/LoginCheck";

export const AuthContext = createContext();

export default function Main() {
    let url = 'http://localhost:5555';
    const [loading, setLoading] = useState(true); // Initially set loading to true
    const [flash, setFlash] = useState([null, null]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDet, setUserDet] = useState({
        _id:null,
        username: null,
        email: null,
        dp: null,
    });
    const [visitorDet, setVisitorDet] = useState({
        _id:null,
        username: null,
        email: null,
        dp: null,
        isFav: null
    });
    const [isProfile, setIsProfile] = useState(false)
    const [isChatList, setIsChatList] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const token = localStorage.getItem('token');
    let [FavUsers,setFavUsers] = useState([]);
    let [DmUsers,setDmUsers] = useState([]);
    let [ChannelUsers, setChannelUsers] = useState([]);
    
    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    useEffect(() => {
        if (flash[0] !== null || flash[1] !== null) {
            const timeout = setTimeout(() => {
                setFlash([null, null]);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [flash]); // <--- Issue here
    

    useEffect(() => {
        if (token && token !== '' && token !== undefined) {
            fetchUserDet(token);
        } else {
            setLoading(false); // If no token is found, stop loading
        }
    }, [token]);

    function Login() {
        setIsAuthenticated(true)
    }

    function Logout() {
        setIsAuthenticated(false)
    }

    async function fetchUserDet(token) {
        try {
                const response = await fetch(`${url}/api/getCurrentUser`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                setFlash(['Response not ok', 'error']);
                throw new Error('Failed to fetch user data');
            }
            const responseData = await response.json();
            console.log(responseData);
            setUserDet({
                _id:responseData.user._id,
                username: responseData.user.username,
                email: responseData.user.email,
                dp: responseData.user.dp
            });
            Login()
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false); 
        }
    }

    const auth = {
        userDet, isAuthenticated, Login, Logout, setLoading,
        setFlash, isProfile, setIsProfile, setIsChatList,setUserDet,
        isChatList, windowWidth, token, visitorDet, setVisitorDet, url,
        FavUsers, setFavUsers, DmUsers, setDmUsers, ChannelUsers, setChannelUsers
    };

    return (
        <AuthContext.Provider value={auth}>
            <BrowserRouter>
            <div className="main-div">
                    {loading && <Loading /> }
                    {flash[0] && (<Flash flash={flash} /> )}
                    <Routes>
                        <Route path='/' element={<RequireAuth > <ChatPage /> </RequireAuth > } >
                            <Route index element={<MyProfile />} />
                            <Route path="user-profile/:userID" element={<Chat />} />
                        </Route>
                        <Route path="/login-page" element={<LoginCheck > <LoginPage /> </LoginCheck > } >
                            <Route path="signup" element={<SignupForm />} />
                            <Route index element={<LoginForm />} />
                        </Route>
                        <Route path="*" element={<h1 className="fcc" style={{width:'100vw',height:'100vh'}}>Inga Onnu Illa Kelambu😎😒</h1>} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

import { Navigate } from "react-router-dom";
import { AuthContext } from "../pages/Main";
import { useContext } from "react";

export default function RequireAuth({ children }) {
    
    const auth = useContext(AuthContext)
    if (!auth.isAuthenticated) {
        return (<Navigate to='/login-page' />)
    }

    return children
}
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAuthStatus } from "../controllers/UsersController";

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const verify = async () => {
            const loggedIn = await checkAuthStatus();
            setIsLoggedIn(loggedIn);
        };
        verify();
    }, []);

    if (isLoggedIn === null) {
        return <p>Loading...</p>;
    } 
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
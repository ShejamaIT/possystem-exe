import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        setUsername(Cookies.get("user")); // Set username once when component mounts
    }, []); // Empty dependency array ensures this effect runs only once

    return username ? children : <Navigate to={'/SignIn'} />;
}

export default ProtectedRoute;

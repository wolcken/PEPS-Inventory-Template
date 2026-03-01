import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

function useAuth() {
    const auth = useContext(AuthContext);
    return auth;
}

function AuthRoute(props) {
    const auth = useAuth();
    if (!auth.user) {
        return <Navigate to='/' />
    }
    return props.children;
}

export { AuthRoute, useAuth }
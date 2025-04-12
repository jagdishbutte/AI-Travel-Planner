import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({
    user,
    children,
}: {
    user: any;
    children: React.ReactNode;
}) => {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};


export default PrivateRoute;

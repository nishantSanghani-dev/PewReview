import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthLayouts() {
    const { token } = useAuth()

    if (token) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    else{
        // console.log("hhihih");
        
        return <Navigate to={'/'}/>
    }

    return (
        <>

            <Outlet />
        </>
    )
}

import React from 'react'
import LoginForm from '../components/LoginForm'


export default function Login() {
    
    return (
        <>
            {/* Main Wrapper Start */}
            <div id="wrapper" className="login-page">
                <div className="login-section">
                    <div className="login-inner-column">
                        <div className="row">
                            <div className="col-12 text-center">
                                <a href="javascript:void(0);" className="login-logo">
                                    <img src="/assets/images/logo.svg" alt="logo" title="Logo" />
                                </a>
                            </div>
                            <div className="col-12">
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

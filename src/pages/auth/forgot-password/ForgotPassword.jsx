import React from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
    return (
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
                            <form >
                                <fieldset className="row">
                                    <div className="col-12 form-group">
                                        <label htmlFor="email-address" className="fw-semibold">
                                            Email Address
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            className={`form-control`}
                                           
                                            placeholder="Enter Your Email Address"
                                        />
                                        {/* <p className='text-danger'>{touchedFields.email && errors.email?.message}</p> */}
                                    </div>
             
            
                                    <div className="col-12 form-group">
                                        <button type='submit' className="btn main-btn w-100">Forgot Password</button>
                                    </div>
                                    <div className="col-12 form-group">
                                        <p className="m-0 d-flex flex-wrap justify-content-center gap-1">
                                            <Link to={'/'} className="basic-links dark-links fw-bold">
                                                Back To Login ?
                                            </Link>
                                            <span className="fw-medium">
                                             
                                            </span>
                                        </p>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '../../../validation/zod.validation'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ForgotPassword() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const submitForgotPassword = async (data) => {
        console.log(data.email);

        try {
            const res = await apiRequest(
                'POST',
                API_ROUTES.user.forgotPassword,
                null,
                data,
                {
                    showToaster: true,
                    showLoader: true,
                }
            )

            if (res?.status) {
               
                navigate('/')
            }
        } catch (error) {
            console.error(error)
        }
    }

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
                            <form onSubmit={handleSubmit(submitForgotPassword)}>
                                <fieldset className="row">
                                    <div className="col-12 form-group">
                                        <label htmlFor="email-address" className="fw-semibold">
                                            Email Address
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            className={`form-control ${touchedFields.email && errors.email && 'border-danger'}`}
                                            {...register('email')}
                                            placeholder="Enter Your Email Address"
                                        />
                                        <p className='text-danger'>{touchedFields.email && errors.email?.message}</p>
                                    </div>

                                    <div className="col-12 form-group">
                                        <button type='submit' className="btn main-btn w-100" disabled={isSubmitting}>
                                            Forgot Password
                                        </button>
                                    </div>
                                    <div className="col-12 form-group">
                                        <p className="m-0 d-flex flex-wrap justify-content-center gap-1">
                                            <Link to={'/'} className="basic-links dark-links fw-bold">
                                                Back To Login ?
                                            </Link>

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

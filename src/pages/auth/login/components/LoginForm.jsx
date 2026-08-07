import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../../validation/zod.validation';
import { loginService } from '../../../../services/login.service';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../../services/Api';
import { API_ROUTES } from '../../../../routes/api.routes';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '../../../../slice/user.slice';
import { usePermission } from '../../../../hooks/UsePermission';
import { MENU } from '../../../../data/Menu';
export default function LoginForm() {
    const navigate = useNavigate()
    const { token } = useSelector((store) => store.user)
    const dispatch = useDispatch()
    // console.log(token);
    const permission = usePermission()
    const [shouldRedirect, setShouldRedirect] = useState(false)
    console.log(permission);

    useEffect(() => {
        if (!shouldRedirect || !permission?.length) return

        const firstPermission = permission[0]
        const routeMap = {
            [MENU.DASHBOARD]: '/admin/dashboard',
            [MENU.ACTIVITY]: '/admin/activity/view',
            [MENU.EVENT]: '/admin/events/view',
            [MENU.END_USER]: '/admin/manage-end-user',
            [MENU.MESSAGE]: '/admin/messages',
            [MENU.REPORT]: '/admin/reported-user',
            [MENU.ROLE]: '/admin/role-and-permission/view',
            [MENU.VENUE]: '/admin/venues/list',
            [MENU.SUPPORT]: '/admin/support-tickets',
            [MENU.GROUP]: '/admin/groups',
            [MENU.BADGE]: '/admin/manage-badges',
            [MENU.PROHIBITED_WORD]: '/admin/masters/prohibited-words',
            [MENU.MANUFACTURER]: '/admin/masters/manufacturer',
            [MENU.ACCESSORY]: '/admin/masters/accessories',
            [MENU.GUN_MASTER]: '/admin/masters/gun',
            [MENU.AMMUNITION]: '/admin/masters/ammunition',
            [MENU.GUN_CATEGORY_MASTER]: '/admin/masters/category',
            [MENU.LEADERBOARD]: '/admin/leaderboard',
            [MENU.USER]: '/admin/user/manage-user',
        }

        navigate(routeMap[firstPermission?.menuId] || '/admin/dashboard')
        setShouldRedirect(false)
    }, [permission, shouldRedirect, navigate])

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const loginUser = async (data) => {
        // alert()
        const res = await apiRequest("POST", API_ROUTES.login.login, data, null, {
            showToaster: true,
            showLoader: true,
        })
        console.log(res);
        if (res.status) {
            dispatch(logIn({
                token: res.data.token,
                permission: res.data.userDetails.menuPermissions
            }))
            setShouldRedirect(true)
        }

    }
    return (
        <form onSubmit={handleSubmit(loginUser)}>
            <fieldset className="row">
                <div className="col-12 form-group">
                    <label htmlFor="email-address" className="fw-semibold">
                        Email Address
                    </label>
                    <input
                        type="text"
                        name="email"
                        className={`form-control ${touchedFields.email && errors.email && 'border-danger'}`}
                        {...register("email")}
                        placeholder="Enter Your Email Address"
                    />
                    <p className='text-danger'>{touchedFields.email && errors.email?.message}</p>
                </div>
                <div className="col-12 form-group">
                    <label htmlFor="password" className="fw-semibold">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        {...register("password")}
                        className={`form-control ${touchedFields.password && errors.password && 'border-danger'}`}
                        placeholder="Enter Your Password"
                    />
                    <p className='text-danger'>{touchedFields.password && errors.password?.message}</p>
                </div>
                <div className="col-12 round-checkbox">
                    <label className="custom-checkbox fw-medium mb-0">
                        Remember me
                        <input type="checkbox" className="child-checkbox" />
                        <span className="checkmark" />
                    </label>
                </div>
                <div className="col-12 form-group">
                    <button type='submit' className="btn main-btn w-100">Login</button>
                </div>
                <div className="col-12 form-group">
                    <p className="m-0 d-flex flex-wrap justify-content-center gap-1">
                        <Link to={'/forgot-password'} className="basic-links dark-links fw-bold">
                            Forgot Password?
                        </Link>
                        <span className="fw-medium">
                            Click here to recover password
                        </span>
                    </p>
                </div>
            </fieldset>
        </form>
    )
}

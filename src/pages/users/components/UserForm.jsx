import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '../../../validation/zod.validation'
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';
import { useNavigate } from 'react-router-dom';

export default function UserForm({ userRoleData, genderData, communicationData, countryData, userSingleData, id }) {
    const [communicationUserData, setcommunicationUserData] = useState([])
    const [singleRoleData, setsingleRoleData] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, touchedFields }
    } = useForm({
        resolver: zodResolver(userSchema),
        mode: 'onBlur'
    })

    const handleCommunication = (event) => {
        console.log(event.target.value);
        if (event.target.checked) {
            setcommunicationUserData([...communicationUserData, event.target.value])
        }
        else {
            setcommunicationUserData(communicationUserData.filter((value, index) => value != event.target.value))
        }
    }

    const userAddForm = async (data) => {
        data.profileImage = data.profileImage?.[0]?.name || ''
        data.commincateWith = communicationUserData
        const selectedCountry = countryData.find((value, index) => value.countryId == data.countryCode)
        data.countryCode = selectedCountry.phoneInternationalCode
        data.countryCodeName = selectedCountry.countryCode
        let res
        if (id) {

            res = await apiRequest("PUT", API_ROUTES.user.userEdit, {
                ...data,
                userId: id
            }, null, {
                showLoader: true,
                showToaster: true
            })
        }
        else {
            res = await apiRequest("POST", API_ROUTES.user.userAdd, data, null, {
                showLoader: true,
                showToaster: true
            })
        }
        if (res.status) {

            navigate("/admin/user/manage-user")
        }


    }

    const handleRoleData = async (id) => {
        const res = await apiRequest("GET", API_ROUTES.role.roleView, null, {
            Id: id
        }, {
            showLoader: true
        })

        setsingleRoleData(res.data.permissions)

    }

    useEffect(() => {
        if (userSingleData) {
            reset({
                firstName: userSingleData.firstName,
                lastName: userSingleData.lastName,
                birthDay: userSingleData.birthDay,
                gender: userSingleData.gender,
                userName: userSingleData.userName,
                address: userSingleData.address,
                contactNumber: userSingleData.contactNumber,
                countryCode: userSingleData.countryCode,
                email: userSingleData.email,
                role: userSingleData.roleId,
                commincateWith: userSingleData.commincateWith,
                profileImage: userSingleData.profileImageFullPath
            })
            handleRoleData(userSingleData.roleId);
        }
    }, [userSingleData])

    return (
        <form onSubmit={handleSubmit(userAddForm)} className="mt-3 mt-xxl-4">
            <fieldset className="row">
                <div className="col-12">
                    <div className="field d-flex align-items-center gap-3">
                        <div className="user-image-edit">
                            <img

                                src={userSingleData?.profileImageFullPath}
                                className="img-fluid"
                                alt="Profile"
                            />

                            <label htmlFor="profileImage" style={{ cursor: "pointer" }} className="edit-btn-small">
                                <i className="demo-icon icon-edit-1"></i>
                            </label>

                            <input

                                type="file"
                                id="profileImage"
                                accept="image/*"
                                {...register('profileImage')}
                                style={{ display: "none" }}
                            />
                        </div>

                        <h3 className="mb-0">
                            <label
                                htmlFor="profileImage"
                                className="text-btn fw-semibold text-start"
                                style={{ cursor: "pointer" }}
                            >
                                Upload a Profile Photo
                            </label>
                        </h3>
                    </div>
                </div>
                <div className="col-12 mt-2">
                    <h3 className="fw-bold mt-4">Personal Information</h3>
                    <hr className="mb-2" />
                </div>
                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="firstName" className="fw-semibold">
                            First Name <span className="danger-color">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={userSingleData?.firstName}
                            {...register('firstName')}
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        />
                        {errors.firstName && (
                            <div className="invalid-feedback d-block">
                                {errors.firstName.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="lastName" className="fw-semibold">
                            Last Name <span className="danger-color">*</span>
                        </label>
                        <input
                            defaultValue={userSingleData?.lastName}
                            type="text"
                            {...register('lastName')}
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        />
                        {errors.lastName && (
                            <div className="invalid-feedback d-block">
                                {errors.lastName.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="birthDay" className="fw-semibold">
                            Birthday
                        </label>
                        <input
                            type="date"
                            defaultValue={userSingleData?.birthDay}
                            id="date"
                            {...register('birthDay')}
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="gender" className="fw-semibold">
                            Gender
                        </label>
                        <select {...register('gender')} defaultValue={userSingleData?.gender} className="form-select">
                            <option value="">Select Gender</option>
                            {
                                genderData.map((value, index) => <option key={value.id} value={value.id}>{value.name}</option>)
                            }


                        </select>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="userName" className="fw-semibold">
                            Username <span className="danger-color">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('userName')}
                            className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
                        />
                        {errors.userName && (
                            <div className="invalid-feedback d-block">
                                {errors.userName.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12 mt-2">
                    <h3 className="fw-bold mt-4">Address Details</h3>
                    <hr className="mb-2" />
                </div>
                <div className="col-sm-6 col-xl-8 mt-3">
                    <div className="form-group">
                        <label htmlFor="address" className="fw-semibold">
                            Address
                        </label>
                        <textarea type="text" {...register('address')} className="form-control" />
                    </div>
                </div>

                <div className="col-12 mt-2">
                    <h3 className="fw-bold mt-4">Contact and Additional Details</h3>
                    <hr className="mb-2" />
                </div>
                <div className="col-sm-6 col-xl-4 mt-3" >
                    <div className="form-group">
                        <label htmlFor="contactNumber" className="fw-semibold">
                            Contact Number <span className="danger-color">*</span>
                        </label>

                        <div className="input-group" >
                            <select
                                {...register('countryCode')}
                                id="countryCode"
                                className={`form-select ${errors.countryCode ? 'is-invalid' : ''}`}
                                style={{ maxWidth: "100px", cursor: "pointer" }}
                            >
                                <option value="">+1</option>
                                {
                                    countryData.map((value, index) => <option value={value.countryId} >({value.phoneInternationalCode})  {value.countryName}</option>)
                                }

                                <div className='w-full'></div>

                            </select>

                            <input
                                type="text"
                                {...register('contactNumber')}
                                id="contactNumber"
                                className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                                placeholder="Enter Contact Number"
                                maxLength={15}
                            />
                        </div>
                        {errors.countryCode && (
                            <div className="invalid-feedback d-block">
                                {errors.countryCode.message}
                            </div>
                        )}
                        {errors.contactNumber && (
                            <div className="invalid-feedback d-block">
                                {errors.contactNumber.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="email" className="fw-semibold">
                            Email <span className="danger-color">*</span>
                        </label>
                        <div className="field-icon">
                            <input
                                type="email"
                                {...register('email')}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                            />
                            {/* <i className="demo-icon icon-eye-line" /> */}
                        </div>
                        {errors.email && (
                            <div className="invalid-feedback d-block">
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="role" className="fw-semibold">
                            Role
                        </label>
                        <select {...register('role')} onChange={(e) => handleRoleData(e.target.value)} className="form-select">
                            <option value="">Select Role</option>
                            {
                                userRoleData.map((value, index) => <option key={value.id} value={value.id}>{value.role}</option>)
                            }

                        </select>
                    </div>
                </div>

                <div className="col-sm-6 col-xl-4 mt-3">
                    <div className="form-group">
                        <label htmlFor="role" className="fw-semibold">
                            Able to communicate with <span className="danger-color">*</span>

                        </label>

                    </div>
                    <div className='d-flex gap-3 mt-2'>
                        {
                            communicationData.map((value, index) => {
                                return (
                                    <label key={value.id} className="custom-checkbox ">
                                        <input
                                            type="checkbox"
                                            name='commincateWith'
                                            className="child-checkbox"
                                            onChange={handleCommunication}
                                            value={value.id}
                                            defaultChecked=""
                                        />
                                        <span className="checkmark" />
                                        {value.description}
                                    </label>
                                )
                            })
                        }



                    </div>
                    {errors.commincateWith && (
                        <div className="invalid-feedback d-block">
                            {errors.commincateWith.message}
                        </div>
                    )}
                </div>
                {
                    singleRoleData && singleRoleData.length > 0 && (
                        <div className="col-12 mt-3 mt-xxl-4">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Accesses Privileges</th>
                                            <th>Read</th>
                                            <th>Create</th>
                                            <th>Update</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            singleRoleData?.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.menuName}</td>
                                                        <td>

                                                            <label className="custom-checkbox">
                                                                <input
                                                                    disabled
                                                                    checked={value.isRead}
                                                                    type="checkbox"
                                                                    className="child-checkbox"
                                                                    defaultChecked=""
                                                                />
                                                                <span className="checkmark" />
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {
                                                                !value.isCreateHide
                                                                &&

                                                                <label className="custom-checkbox">
                                                                    <input
                                                                        checked={value.isCreate}
                                                                        disabled
                                                                        type="checkbox"
                                                                        className="child-checkbox"
                                                                        defaultChecked=""
                                                                    />
                                                                    <span className="checkmark" />
                                                                </label>
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                !value.isUpdateHide
                                                                &&

                                                                <label className="custom-checkbox">
                                                                    <input
                                                                        checked={value.isUpdate}
                                                                        disabled
                                                                        type="checkbox"
                                                                        className="child-checkbox"
                                                                        defaultChecked=""
                                                                    />
                                                                    <span className="checkmark" />
                                                                </label>
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                !value.isDeleteHide
                                                                &&

                                                                <label className="custom-checkbox">
                                                                    <input
                                                                        checked={value.isDelete}
                                                                        disabled
                                                                        type="checkbox"
                                                                        className="child-checkbox"
                                                                        defaultChecked=""
                                                                    />
                                                                    <span className="checkmark" />
                                                                </label>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }




                <div className="col-12 mt-3 mt-xxl-4">
                    <div className="d-flex flex-wrap justify-content-end gap-3">
                        <button type="button" className="btn main-btn border-btn">Cancel</button>
                        <button type='submit' className="btn main-btn w-auto">Save</button>
                    </div>
                </div>
            </fieldset>
        </form>
    )
}

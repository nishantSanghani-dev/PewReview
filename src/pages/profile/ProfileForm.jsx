import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '../../validation/zod.validation'
import { API_ROUTES } from '../../routes/api.routes'
import { apiRequest } from '../../services/Api'

export default function ProfileForm({ userProfile, genderData, countryData, communicationData, roleData, refreshProfile, isOpenChangePassword,setisOpenChangePassword }) {
    const [previewImage, setPreviewImage] = useState(userProfile?.profileImageFullPath || '')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            birthDay: '',
            gender: '',
            address: '',
            countryCode: '',
            contactNumber: '',
            profileImage: null
        }
    })

    useEffect(() => {
        if (!userProfile) {
            return
        }

        reset({
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            birthDay: userProfile.birthDay || '',
            gender: userProfile.gender?.toString() || '',
            address: userProfile.address || '',
            countryCode: userProfile.countryCode || '',
            contactNumber: userProfile.contactNumber || '',
            profileImage: null
        })
        setPreviewImage(userProfile.profileImageFullPath || '')
    }, [userProfile, reset])

    const selectedRole = useMemo(() => {
        if (roleData?.length && userProfile?.roleId) {
            return roleData.find(item => item.roleId === userProfile.roleId)?.roleName || ''
        }
        return userProfile?.roleDetails?.roleName || ''
    }, [roleData, userProfile])

    const handleImageChange = event => {
        const file = event.target.files?.[0]
        if (file) {
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const onSubmit = async data => {
        const payload = {
            userId: userProfile.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDay: data.birthDay,
            gender: parseInt(data.gender, 10),
            address: data.address,
            countryCode: data.countryCode,
            contactNumber: data.contactNumber,
            profileImage: data.profileImage?.[0]?.name || userProfile.profileImage || ''
        }

        const res = await apiRequest('PUT', API_ROUTES.user.userEdit, payload, null, {
            showLoader: true,
            showToaster: true,
            useToken: true
        })

        if (res?.status) {
            refreshProfile()
        }
    }

    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} className=" ">
                <fieldset className="row gx-4 gy-4">
                    <div className="col-12">
                        <div className="d-flex flex-column gap-3">
                            <div>

                                <h5 className="fw-bold mb-0">Profile</h5>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="user-image-edit">
                                    <img
                                        src={previewImage || '/assets/images/profile-img.png'}
                                        className="img-fluid"
                                        alt="Profile"
                                    />
                                    <label htmlFor="profileImage" style={{ cursor: 'pointer' }} className="edit-btn-small">
                                        <i className="demo-icon icon-edit-1"></i>
                                    </label>
                                </div>
                                <label htmlFor="profileImage" className="text-btn fw-semibold mb-0" style={{ cursor: 'pointer' }}>
                                    Upload a Profile Photo
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    {...register('profileImage')}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <h4 className="fw-bold">Personal Information</h4>
                        <hr className="mb-0" />
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">First Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                {...register('firstName')}
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                placeholder="Enter first name"
                            />
                            {errors.firstName && <div className="invalid-feedback d-block">{errors.firstName.message}</div>}
                        </div>
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">Last Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                {...register('lastName')}
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                placeholder="Enter last name"
                            />
                            {errors.lastName && <div className="invalid-feedback d-block">{errors.lastName.message}</div>}
                        </div>
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">Birthday</label>
                            <input
                                type="date"
                                {...register('birthDay')}
                                className={`form-control ${errors.birthDay ? 'is-invalid' : ''}`}
                            />
                            {errors.birthDay && <div className="invalid-feedback d-block">{errors.birthDay.message}</div>}
                        </div>
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">Gender</label>
                            <select
                                {...register('gender')}
                                className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                            >
                                <option value="">Select Gender</option>
                                {genderData?.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                            {errors.gender && <div className="invalid-feedback d-block">{errors.gender.message}</div>}
                        </div>
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">Username <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                value={userProfile?.userName || ''}
                                disabled
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        <h4 className="fw-bold">Address Details</h4>
                        <hr className="mb-0" />
                    </div>

                    <div className="col-12">
                        <div className="form-group">
                            <label className="fw-semibold">Address</label>
                            <textarea
                                rows={3}
                                {...register('address')}
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                placeholder="Enter your address"
                            />
                            {errors.address && <div className="invalid-feedback d-block">{errors.address.message}</div>}
                        </div>
                    </div>

                    <div className="col-12">
                        <h4 className="fw-bold">Contact and Additional Details</h4>
                        <hr className="mb-0" />
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">Contact Number <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <select
                                    {...register('countryCode')}
                                    className={`form-select ${errors.countryCode ? 'is-invalid' : ''}`}
                                    style={{ maxWidth: '120px', cursor: 'pointer' }}
                                >
                                    <option value="">Code</option>
                                    {countryData?.map(item => (
                                        <option key={item.countryId} value={item.phoneInternationalCode}>
                                            {item.phoneInternationalCode}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    {...register('contactNumber')}
                                    className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                                    placeholder="Enter number"
                                />
                            </div>
                            {errors.countryCode && <div className="invalid-feedback d-block">{errors.countryCode.message}</div>}
                            {errors.contactNumber && <div className="invalid-feedback d-block">{errors.contactNumber.message}</div>}
                        </div>
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">Email <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                value={userProfile?.email || ''}
                                disabled
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="col-sm-6 col-xl-4">
                        <div className="form-group">
                            <label className="fw-semibold">Role <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                value={userProfile?.roleDetails?.roleName || ''}
                                disabled
                                className="form-control"
                            />
                        </div>
                    </div>


                    <div className="col-12">
                        <div className="form-group">
                            <label className="fw-semibold">Able to communicate with <span className="text-danger">*</span></label>
                            <div className="d-flex flex-wrap gap-3 mt-2">

                                {
                                    communicationData.map((value, index) => {
                                        return (
                                            <label key={value.id} className="custom-checkbox ">
                                                <input
                                                    type="checkbox"
                                                    name='commincateWith'
                                                    className="child-checkbox"

                                                    value={value.id}
                                                    checked={userProfile?.commincateWith?.includes(value.id)}
                                                    defaultChecked=""
                                                />
                                                <span className="checkmark" />
                                                {value.description}
                                            </label>
                                        )
                                    })
                                }




                                {/* {communicationData?.map(item => (
                                <label key={item.id} className="custom-checkbox d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"


                                    />
                                    <span>{item.description}</span>
                                </label>
                            ))} */}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <h4 className="fw-bold">Security Details</h4>
                        <hr className="mb-0" />
                    </div>

                    <div className="col-12 col-lg-6">
                        <button onClick={() => setisOpenChangePassword(true)} type="button" className="btn main-btn border-btn danger-btn w-auto">Change Password</button>
                    </div>

                    <div className="col-12">
                        <div className="d-flex flex-wrap justify-content-end gap-3">
                            <button type="button" className="btn main-btn border-btn" onClick={() => reset()}>
                                Cancel
                            </button>
                            <button type="submit" className="btn main-btn w-auto" disabled={isSubmitting}>
                                Save
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
            {

            }
        </>
    )
}

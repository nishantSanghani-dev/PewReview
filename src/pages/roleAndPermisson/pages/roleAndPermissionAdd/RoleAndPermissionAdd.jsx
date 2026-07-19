/* eslint-disable react-hooks/set-state-in-effect */
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useFormAction, useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../../../services/Api';
import { API_ROUTES } from '../../../../routes/api.routes';
import { roleSchema } from '../../../../validation/zod.validation';

export default function RoleAndPermissionAdd() {

    const [permissions, setpermissions] = useState([])
    const [singlePermissionData, setsinglePermissionData] = useState(null)
    const { id } = useParams()
    // console.log(id);


    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting },
    } = useForm({
        resolver: zodResolver(roleSchema)
    })

    const getPermissionMenu = async () => {
        const res = await apiRequest("GET", API_ROUTES.role.roleView, null, null, {
            showLoader: true
        })
        console.log(res.data.permissions);
        setpermissions(res.data.permissions)

    }
    const handleChange = (menuId, key, checked) => {
        setpermissions((value) => value.map((val) => {
            if (val.menuId !== menuId) {
                return val;
            }
            const updated = {
                ...val,
                [key]: checked,
            };

            if (checked && ["isCreate", "isUpdate", "isDelete"].includes(key)) {
                updated.isRead = true;
            }
            if (key === "isRead" && !checked) {
                updated.isCreate = false;
                updated.isUpdate = false;
                updated.isDelete = false;
            }

            return updated;

        })
        );
    };
    const roleSubmit = async (data) => {
        console.log(data);

        const payload = {
            ...data,
            permissions
        }
        console.log(payload);

        const res = await apiRequest("POST", API_ROUTES.role.roleAdd, payload, null, {
            showLoader: true,
            showToaster: true
        })
        if (res.status) {
            navigate("/admin/role-and-permission/view")
        }

    }

    const getSingleRole = async () => {
        // console.log(id);

        const res = await apiRequest("GET", API_ROUTES.role.roleView, null, {
            id
        }, {
            showLoader: true
        })
        // console.log(res.data);
        setsinglePermissionData(res.data)

    }

    useEffect(() => {
        getPermissionMenu()
    }, [])
    useEffect(() => {
        if (id) {
            // console.log(id);

            getSingleRole()
        }
    }, [id])
    return (

        <>
            {
                console.log(singlePermissionData)

            }
            <div className="container-fluid">
                <div className="tabbar-section">
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb m-0">

                                    <li className="breadcrumb-item">
                                        <a href="javascript:void(0);">
                                            <h2>Role & Permission
                                                /
                                                Add Role & Permission</h2>
                                        </a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <form onSubmit={handleSubmit(roleSubmit)} className="mt-3 mt-xxl-4">
                                <fieldset className="row">

                                    <div className=" mt-3">
                                        <div className="form-group">
                                            <label htmlFor="roleName" className="fw-semibold">
                                                Role Name  <span className="danger-color">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="roleName"
                                                defaultValue={singlePermissionData?.roleName}
                                                className={`form-control ${touchedFields.roleName && errors.roleName && 'border-danger'}`}
                                                required=""
                                                {...register("roleName")}
                                            />
                                            <p className='text-danger my-2'>{touchedFields.roleName && errors.roleName?.message}</p>
                                        </div>
                                    </div>
                                    <div className=" mt-3">
                                        <div className="form-group">
                                            <label htmlFor="description" className="fw-semibold">
                                                Description
                                            </label>
                                            <textarea
                                                type="text"
                                                name="description"
                                                defaultValue={singlePermissionData?.description}
                                                className="form-control"
                                                className={`form-control ${touchedFields.description && errors.description && 'border-danger'}`}
                                                required=""
                                                {...register("description")}
                                            />
                                            <p className='text-danger my-2'>{touchedFields.description && errors.description?.message}</p>
                                        </div>
                                    </div>

                                    <div className="col-12 mt-2">
                                        <h3 className="fw-bold mt-4">Permissions</h3>

                                    </div>
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
                                                        permissions.map((value, index) => {
                                                            return (
                                                                <tr key={value?.menuId}>
                                                                    <td>{value?.menuDisplayName}</td>
                                                                    <td>
                                                                        <label className="custom-checkbox">
                                                                            <input
                                                                                            
                                                                                checked={value.isRead || singlePermissionData?.isRead}
                                                                                onChange={(e) => handleChange(value?.menuId, "isRead", e.target.checked)}
                                                                                type="checkbox"
                                                                                className="child-checkbox"

                                                                            />
                                                                            <span className="checkmark" />
                                                                        </label>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            !value?.isCreateHide
                                                                            &&

                                                                            <label className="custom-checkbox">
                                                                                <input
                                                                                    checked={value.isCreate || singlePermissionData?.isCreate}
                                                                                    onChange={(e) => handleChange(value?.menuId, "isCreate", e.target.checked)}
                                                                                    type="checkbox"
                                                                                    className="child-checkbox"

                                                                                />
                                                                                <span className="checkmark" />
                                                                            </label>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            !value?.isUpdateHide
                                                                            &&

                                                                            <label className="custom-checkbox">
                                                                                <input
                                                                                    checked={value.isUpdate}
                                                                                    onChange={(e) => handleChange(value?.menuId, "isUpdate", e.target.checked)}
                                                                                    type="checkbox"
                                                                                    className="child-checkbox"

                                                                                />
                                                                                <span className="checkmark" />
                                                                            </label>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            !value?.isDeleteHide
                                                                            &&

                                                                            <label className="custom-checkbox">
                                                                                <input
                                                                                    checked={value.isDelete}
                                                                                    onChange={(e) => handleChange(value?.menuId, "isDelete", e.target.checked)}
                                                                                    type="checkbox"
                                                                                    className="child-checkbox"

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
                                    <div className="col-12 mt-3 mt-xxl-4">
                                        <div className="d-flex flex-wrap justify-content-end gap-3">
                                            <button className="btn main-btn border-btn">Cancel</button>
                                            <button type='submit' className="btn main-btn w-auto">Save</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

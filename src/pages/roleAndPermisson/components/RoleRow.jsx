import React from 'react'
import { Link } from 'react-router-dom'

export default function RoleRow({ value, onDelete, onToggle }) {

    return (
        <tr>
            <td>
                <span className="d-flex gap-2 align-items-center">
                    <Link to={`/admin/role-and-permission/edit/${value.id}`}
                        className="small-square-btn edit-btn"
                        href="manage-user-edit.html"
                    >
                        <i className="demo-icon icon-edit-1" />
                    </Link>
                    <Link
                        onClick={() => onDelete(value.id)}
                        className="small-square-btn danger-btn"
                        href="javascript:void(0);"
                    >
                        <i className="demo-icon icon-delete-1" />
                    </Link>
                </span>
            </td>
            <td>{value.role}</td>
            <td>{value.description}</td>
            <td>{value.noOfUser}</td>

            <td>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`toggle-${value.id}`}
                        onChange={(e) => onToggle(value.id, e.target.checked)}
                        checked={value.isActive}
                    />
                    <label
                        className="form-check-label"
                        id={`toggle-${value.id}`}
                    />
                </div>
            </td>
        </tr>
    )
}

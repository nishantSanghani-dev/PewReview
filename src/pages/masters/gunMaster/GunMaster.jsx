import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { DateCell } from '../../activity/Activity';
import { handleStatusChange } from '../../../utils/ChangeStatus';
import { handleDelete } from '../../../utils/DeleteRecords';
const ActionCell = (props) => {
    const item = props.dataItem;
    return (
        <td {...props.tdProps}>
            <span className="d-flex gap-2 align-items-center">

                <button
                    // onClick={() => {
                    //     props.setismanufacturerOpen(true)
                    //     props.setid(item.id)
                    // }}

                    className="small-square-btn edit-btn"

                >
                    <i className="demo-icon icon-edit-1" />
                </button>

                <button
                    onClick={() => handleDelete(item.gunId, "gun", "gunDelete", props.getGun)}
                    type="button"
                    className="small-square-btn danger-btn"
                >
                    <i className="demo-icon icon-delete-1" />
                </button>


            </span>
        </td>
    );
};
const StatusCell = (props) => {
    return (
        <td {...props.tdProps}>
            <div className="form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={props.dataItem.isActive}
                    readOnly
                    onChange={(e) => handleStatusChange(props.dataItem.gunId, e.target.checked, "gun", "gunStatusUpdate", props.getGun)}
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td className="text-ellipsis" {...tdProps} >

        {dataItem[field] ?? "-"}
    </td>
);
const ImageCell = (props) => {
    return (
        <td {...props.tdProps}>
            {props.dataItem.attachmentFullPath ? (
                <img
                    src={props.dataItem.attachmentFullPath}
                    alt="Badge"
                    className="gun-img"
                />
            ) : null}
        </td>
    );
};
const DetailCell = ({ tdProps, dataItem, field }) => {
    return (
        <td  {...tdProps}>
            <div className="text-ellipsis">
                {dataItem.details || "-"}
            </div>
        </td>
    )
}
const ApprovalStatusCell = ({ tdProps, dataItem, statusOptions }) => {


    return (
        <td {...tdProps}>
            <div className="approval-status-wrapper">

                <select className="approval-status-select" defaultValue={dataItem.status}>
                    <option value="">{dataItem.approvalStatusName}</option>
                    {statusOptions && statusOptions.map((status, index) => (
                        <option disabled={dataItem.status === status.description} key={index} value={status}>
                            {status.description}
                        </option>
                    ))}
                </select>
            </div>
        </td>
    );
};
export default function GunMaster() {
    const [gunData, setgunData] = useState([])
    const [statusOptions, setstatusOptions] = useState([])
    const getGun = async () => {
        const res = await apiRequest("POST", API_ROUTES.gun.getGun, { page: 1, pageSize: 10 }, null, {
            showLoader: true
        })
        setgunData(res.data.data)
    }
    const gunCoulmn = [
        { field: "action", title: "Action", cell: ActionCell, width: "100px" },
        { field: "gunName", title: "Gun Name" },
        { field: "categoryNames", title: "Category Names" },
        { field: "manufacturerNames", title: "Manufacturer Names", width: "220px" },
        { field: "details", title: "Details", cell: DetailCell },
        { field: "attachmentFullPath", title: "Images", cell: ImageCell },
        { field: "createdByUserName", title: "Creadted By" },
        { field: "Created On", title: "updatedOn", cell: DateCell },
        { field: "updatedByUserName", title: "Modified By" },
        { field: "approvalStatusName", title: "Approval Status", cell: ApprovalStatusCell },
        { field: "isActive", title: "Status", cell: StatusCell }
    ]
    const getSuppportStatus = async () => {
        const res = await apiRequest("GET", API_ROUTES.common.getSupportStatus, null, null, {
            showLoader: true
        })
        if (res.status && res.data) {
            setstatusOptions(res.data)
        }
    }
    useEffect(() => {
        getGun()
        getSuppportStatus()
    }, [])
    return (
        <div className="container-fluid">
            <div className="mb-3 activity-breadcrumb">
                <span style={{ color: "#666766" }} className="fw-bold">Masters</span>
                <span className="mx-2 text-dark">/</span>
                <span className="fw-bold text-dark">Gun Master</span>
            </div>
            <div className="tabbar-section">
                <div className="row align-items-center gap-3">
                    <div className="col-12 col-lg-auto">
                        <form className="d-md-flex searchbar align-items-center" role="search">
                            <input
                                className="form-control search-input"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"

                            />
                            <button
                                className="btn btn-outline-primary search-toggle"
                                type="button"

                            >
                                <i className="demo-icon icon-search" />
                            </button>
                        </form>
                    </div>
                    <div className="col-12 col-lg">
                        <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">

                            <button
                                // onClick={() => setismanufacturerOpen(true)}
                                className="btn main-btn border-btn blue-btn"
                                style={{
                                    background: "linear-gradient(90deg, rgb(193, 39, 45) 0%, rgb(0 0 0 / 92%) 100%)",
                                    color: "white"
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-3 mt-xxl-4">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper"
                                data={gunData}
                                pageable={{
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    previousNext: true,
                                    info: true,
                                    type: "numeric"
                                }}
                            >
                                {
                                    gunCoulmn?.map((col, ind) => {
                                        return (
                                            <GridColumn
                                                key={col.field}
                                                field={col.field}
                                                title={col.title}
                                                width={col.width || "150px"}
                                                pageable={{
                                                    buttonCount: 4,
                                                    pageSizes: [20, 50, 200],
                                                    previousNext: true,
                                                    info: true,
                                                    type: "numeric"
                                                }}
                                                cells={
                                                    col.cell
                                                        ? {
                                                            data: (props) => (
                                                                <col.cell
                                                                    {...props}
                                                                    statusOptions={statusOptions}
                                                                    getGun={getGun}
                                                                />
                                                            )
                                                        }
                                                        : {
                                                            data: (props) => (
                                                                <TextCell {...props} field={col.field} />
                                                            )
                                                        }
                                                }
                                            />
                                        )
                                    })
                                }

                            </Grid>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { handleDelete } from '../../../utils/DeleteRecords'
import { DateCell } from '../../activity/Activity'
import { handleStatusChange } from '../../../utils/ChangeStatus'
import ProhibitedAdd from './ProhibitedAdd'
const ActionCell = (props) => {
    const item = props.dataItem;


    return (
        <td {...props.tdProps}>
            <span className="d-flex gap-2 align-items-center">

                <button
                    onClick={() => {
                        props.setisProhibitedOpen(true)
                        props.setid(item.id)
                    }}

                    className="small-square-btn edit-btn"

                >
                    <i className="demo-icon icon-edit-1" />
                </button>

                <button
                    onClick={() => handleDelete(item.id, "prohibited", "prohibitedDelete", props.getProhibited)}
                    type="button"
                    className="small-square-btn danger-btn"
                >
                    <i className="demo-icon icon-delete-1" />
                </button>


            </span>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
const StatusCell = (props) => {
    return (
        <td {...props.tdProps}>
            <div className="form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={props.dataItem.status}
                    readOnly
                    onChange={(e) => handleStatusChange(props.dataItem.id, e.target.checked, "prohibited", "prohibitedStatusChange", props.getProhibited)}
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
export default function Prohibited() {
    const [prohibitedData, setprohibitedData] = useState([])
    const [isProhibitedOpen, setisProhibitedOpen] = useState(false)
    const [id, setid] = useState(null)
    const getProhibited = async () => {
        const res = await apiRequest("POST", API_ROUTES.prohibited.getProhibited, { page: 1, pageSize: 10 }, null, {
            showLoader: true
        })
        setprohibitedData(res.data.data)
    }

    const prohibitedColumns = [
        { field: "action", title: "Action", cell: ActionCell, width: "100px" },
        { field: "words", title: "Prohibited Words" },
        { field: "description", title: "Description" },
        { field: "createdByUserName", title: "Created By" },
        { field: "createdOn", title: "Created On", cell: DateCell },
        { field: "updatedByUserName", title: "Modified By" },
        { field: "status", title: "Status", cell: StatusCell, width: "100px" }
    ]

    useEffect(() => {
        getProhibited()
    }, [])
    return (
        <>
            <div className="container-fluid">
                <div className="mb-3 activity-breadcrumb">
                    <span style={{ color: "#666766" }} className="fw-bold">Masters</span>
                    <span className="mx-2 text-dark">/</span>
                    <span className="fw-bold text-dark">Prohibited Words</span>
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
                                    onClick={() => setisProhibitedOpen(true)}
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
                                    data={prohibitedData}


                                    pageable={{
                                        buttonCount: 5,
                                        pageSizes: [10, 20, 50],
                                        previousNext: true,
                                        info: true,
                                        type: "numeric"
                                    }}
                                >
                                    {
                                        prohibitedColumns?.map((col, ind) => {
                                            return (
                                                <GridColumn
                                                    key={col.field}
                                                    field={col.field}
                                                    title={col.title}
                                                    width={col.width}
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
                                                                        getProhibited={getProhibited}
                                                                        setisProhibitedOpen={setisProhibitedOpen}

                                                                        setid={setid}
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
            {
                isProhibitedOpen
                &&
                <ProhibitedAdd
                    id={id}
                    setid={setid}
                    getProhibited={getProhibited}
                    isProhibitedOpen={isProhibitedOpen} setisProhibitedOpen={setisProhibitedOpen} />
            }
        </>
    )
}

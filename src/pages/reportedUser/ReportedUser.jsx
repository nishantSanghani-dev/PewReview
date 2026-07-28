import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
export default function ReportedUser() {
    const [reportUserData, setreportUserData] = useState([])
    const getReportedUser = async () => {
        const res = await apiRequest("POST", API_ROUTES.report.getReport, { page: 1, pageSize: 10 }, null, {
            showLoader: true
        })
        setreportUserData(res.data)
    }


    const reportedUserColumn = [
        { field: "userName", title: "UserName" },
        { field: "email", title: "Email/Phone Number" },
        { field: "reportedBy", title: "Reported By" },
        { field: "Status", title: "Status" }
    ]

    useEffect(() => {
        getReportedUser()
    }, [])

    return (

        <div className="container-fluid">
            <div className="mb-3 activity-breadcrumb">

                <span className="fw-bold text-dark">Reported User</span>
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

                </div>
                <div className="row">
                    <div className="col-12 mt-3 mt-xxl-4">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper"
                                data={reportUserData}
                                pageable={{
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    previousNext: true,
                                    info: true,
                                    type: "numeric"
                                }}
                            >
                                {
                                    reportedUserColumn?.map((col, ind) => {
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

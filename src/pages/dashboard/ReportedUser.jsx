import { Grid, GridColumn } from '@progress/kendo-react-grid';
import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';
import { DateCell } from '../activity/Activity';
import { Tooltip } from '@progress/kendo-react-tooltip';


const TextCell = ({ tdProps, dataItem, field }) => {
    const value = dataItem[field];

    return (
        <td {...tdProps}>
            <Tooltip anchorElement="target" position="top">
                <span
                    title={value}
                    style={{
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value ?? '-'}
                </span>
            </Tooltip>
        </td>
    );
};

export default function ReportedUser({ reportedId, setisOpenReportedPerson, filter }) {
    // console.log(reportedId);

    const [reportedUserData, setreportedUserData] = useState([])
    const fltr = Number(filter)


    const getReprtedPerson = async () => {
        const res = await apiRequest("POST", API_ROUTES.reportDashboard.getReportList, { pageNumber: 1, pageSize: 10, filter: fltr, reportedId, reportTypeId: 3 }, null, {
            showLoader: true
        })
        console.log(res.data);
        setreportedUserData(res.data)

    }

    useEffect(() => {
        getReprtedPerson()
    }, [])


    const reportedUserComlumn = [
        { field: "reportedByUserName", title: "Reported By" },
        { field: "reportDate", title: "Reported Date", cell: DateCell },
        { field: "comment", title: "Comments" }
    ]


    return (
        <div
            className="modal fade show d-block gun-modal-wrapper"
            style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        >
            <div className="modal-dialog gun-modal-dialog">
                <div className="modal-content gun-details-modal">

                    {/* Header */}
                    <div className="modal-header">
                        <h4 className="modal-title">
                            Reported Users
                        </h4>

                        <button
                            onClick={() => setisOpenReportedPerson(false)}
                            type="button"
                            className="btn-close"
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">

                        <div className="gun-table-container mt-4">

                            <Grid
                                className="table-wrapper fw-bold text-center"
                                data={reportedUserData}
                                sortable
                                pageable={{
                                            responsive: false,
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    info: true,
                                    previousNext: true,
                                    type: "numeric"
                                }}
                            >
                                {reportedUserComlumn.map((col) => (
                                    <GridColumn
                                        key={col.field}
                                        field={col.field}
                                        title={col.title}
                                        width={col.width || "150px"}
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
                                ))}
                                {/* <GridColumn
                                    field="gunName"
                                    title="Gun Name"
                                    width="180px"
                                />

                                <GridColumn
                                    field="gunImage"
                                    title="Gun Image"
                                    width="180px"
                                    cells={{
                                        data: ImageCell
                                    }}
                                />

                                <GridColumn
                                    field="ammunition"
                                    title="Ammunition"
                                    width="180px"
                                    cells={{
                                        data: BulletCell("ammunition")
                                    }}
                                />

                                <GridColumn
                                    field="manufacturer"
                                    title="Manufacturers"
                                    width="220px"
                                    cells={{
                                        data: BulletCell("manufacturer")
                                    }}
                                /> */}
                            </Grid>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

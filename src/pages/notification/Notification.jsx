import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'

export default function Notification() {
    const [notificationData, setnotificationData] = useState([])
    const [totalRecords, settotalRecords] = useState(null)
    const getNotification = async () => {
        const res = await apiRequest("POST", API_ROUTES.notification.getNotification, { page: 1, PageSize: 10 }, null, {
            showLoader: true
        })
        setnotificationData(res.data?.data)
        settotalRecords(res.data.totalRecord)
    }

    useEffect(() => {
        getNotification()
    }, [])
    return (
        <div className="container-fluid">
            <div className="page-heading">
                <div className="row align-items-center gap-2">
                    <div className="col">
                        <h2 className="page-title">Notification</h2>
                    </div>
                </div>
            </div>
            <div className="card-section">
                <div className="row">
                    <div className="col-xl-12 mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="">
                                    <Grid
                                        total={totalRecords}
                                        className="table-wrapper  text-center"
                                        data={notificationData}
                                        // skip={dataState.skip}
                                        // take={dataState.take}
                                        // filter={dataState.filter}
                                        // filterOperators={{
                                        //     text: [
                                        //         {
                                        //             text: 'grid.filterContainsOperator',
                                        //             operator: 'contains',
                                        //         },
                                        //     ],
                                        //     numeric: [
                                        //         { text: 'grid.filterEqOperator', operator: 'eq' },
                                        //     ],
                                        //     boolean: [
                                        //         { text: 'grid.filterEqOperator', operator: 'eq' },
                                        //     ],
                                        // }}
                                        // columnMenuIcon={filterIcon}
                                        // sortable={{ allowUnsort: true, mode: 'single' }}
                                        // sort={kendoSort}
                                        pageable={{
                                            responsive: false,
                                            buttonCount: 5,
                                            pageSizes: [20, 50, 150],
                                            info: true,
                                            previousNext: true,
                                            type: 'numeric',
                                        }}
                                    // onDataStateChange={handleGridDataStateChange}
                                    >

                                        <GridColumn
                                            field='notification'
                                            title='Notification'
                                        />
                                        <GridColumn
                                            field='date'
                                            title='Date'
                                        />
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

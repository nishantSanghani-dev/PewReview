import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../../services/Api'
import { API_ROUTES } from '../../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid'
import { handleStatusChange } from '../../../utils/ChangeStatus';
import { handleDelete } from '../../../utils/DeleteRecords';
import { DateCell } from '../../activity/Activity';
import ManufacturerAdd from './ManufacturerAdd';
import BreadCumb from '../../../components/common/breadCumb/BreadCumb';
import SerachFilter from '../../../components/common/SerachFilter';
import useGridPagination from '../../../hooks/useGridPagination'
const ActionCell = (props) => {
    const item = props.dataItem;


    return (
        <td {...props.tdProps}>
            <span className="d-flex gap-2 align-items-center">

                <button
                    onClick={() => {
                        props.setismanufacturerOpen(true)
                        props.setid(item.id)
                    }}

                    className="small-square-btn edit-btn"

                >
                    <i className="demo-icon icon-edit-1" />
                </button>

                <button
                    onClick={() => handleDelete(item.id, "manufacturer", "manufacturerDelete", props.getManufacturer)}
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
                    checked={props.dataItem.isActive}
                    readOnly
                    onChange={(e) => handleStatusChange(props.dataItem.id, e.target.checked, "manufacturer", "manufacturerStatusUpdate", props.getManufacturer)}
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
export default function Manufacturer() {
    const [manufacturerData, setmanufacturerData] = useState([])
    const [ismanufacturerOpen, setismanufacturerOpen] = useState(false)
    const [id, setid] = useState(null)
    const [searchText, setSearchText] = useState("")
    const [customSearch, setcustomSearch] = useState("")
    const { dataState, onDataStateChange, page, pageSize, resetPage } = useGridPagination(10)
    const getManufacturer = async () => {
        const res = await apiRequest("POST", API_ROUTES.manufacturer.getManufacturer, { page, PageSize: pageSize, customSearch }, null, {
            showLoader: true
        })
        setmanufacturerData(res.data.data)
    }
    const manufectureColumns = [
        { field: "action", title: "Action", cell: ActionCell, width: "80px" },
        { field: "name", title: "Manufacturer Name" },
        { field: "description", title: "Description", width: "250px" },
        { field: "createdByUserName", title: "Created By" },
        { field: "createdOn", title: "Created On", cell: DateCell },
        { field: "updatedByUserName", title: "Modified By" },
        { field: "status", title: "Status", cell: StatusCell, width: "80px" }
    ]

    useEffect(() => {
        getManufacturer()
    }, [page, pageSize, customSearch])
    return (
        <>
            <div className="container-fluid">
                <div className="mb-3 activity-breadcrumb">
                    <span style={{ color: "#666766" }} className="fw-bold">Masters</span>
                    <span className="mx-2 text-dark">/</span>
                    <span className="fw-bold text-dark">Manufacturer Master</span>
                </div>
                <div className="tabbar-section">
                    <div className="row align-items-center gap-3">
                        <div className="col-12 col-lg-auto">
                            <SerachFilter
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSubmit={(value) => {
                                    resetPage()
                                    setcustomSearch(value)
                                }}
                            />
                        </div>
                        <div className="col-12 col-lg">
                            <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">

                                <button
                                    onClick={() => setismanufacturerOpen(true)}
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
                                    data={manufacturerData}
                                    skip={dataState.skip}
                                    take={dataState.take}
                                    pageable={{
                                        buttonCount: 5,
                                        pageSizes: [10, 20, 50],
                                        previousNext: true,
                                        info: true,
                                        type: "numeric"
                                    }}
                                    onDataStateChange={onDataStateChange}
                                >
                                    {
                                        manufectureColumns?.map((col, ind) => {
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
                                                                        getManufacturer={getManufacturer}
                                                                        setismanufacturerOpen={setismanufacturerOpen}
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
                ismanufacturerOpen
                &&
                <ManufacturerAdd
                    id={id}
                    setid={setid}
                    getManufacturer={getManufacturer}
                    ismanufacturerOpen={ismanufacturerOpen} setismanufacturerOpen={setismanufacturerOpen} />
            }
        </>
    )
}

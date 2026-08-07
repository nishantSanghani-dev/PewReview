import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Link, useLocation } from 'react-router-dom';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { filterIcon } from '@progress/kendo-svg-icons'
import { ColumnMenu } from '../../components/grid/ColumnMenu'
import { getBackendFilters } from '../../components/grid/GridFilter'
import "../supportTicket/supportTicket.css"
import SupportTicketEdit from './SupportTicketEdit';
import SerachFilter from '../../components/common/SerachFilter';
import useGridPagination from '../../hooks/useGridPagination'
import { Tooltip } from "@progress/kendo-react-tooltip";
import { usePermission } from '../../hooks/UsePermission';
import { MENU } from '../../data/Menu';
import useUserPermission from '../../utils/UserPermission';
const ActionCell = (props) => {


    const deleteTicket = async () => {
        if (confirm("Are You Want To Delete Support Ticket ? ")) {

            const res = await apiRequest("DELETE", API_ROUTES.supportTicket.supportTicketDelete(props.dataItem.id), null, null, {
                showLoader: true,
                showToaster: true
            })
            if (res.status) {
                props.getTickets()
            }
        }

    }

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">
                {
                    props.supportTicketPermission.canUpdate
                    &&

                    <button
                        onClick={() => {
                            props.setShowModal(true)
                            props.setticketId(props.dataItem.id)
                        }}
                        href="javascript:void(0)"
                        className="small-square-btn edit-btn"

                    >
                        <i className="demo-icon icon-edit-1" />
                    </button>
                }
                {
                    props.supportTicketPermission.canDelete
                    &&
                    props.dataItem.status === "Resolved / Closed"
                    &&

                    <button
                        onClick={deleteTicket}

                        className="small-square-btn danger-btn"
                    >
                        <i className="demo-icon icon-delete-1"></i>
                    </button>
                }
            </div>
        </td>
    );
};


const TextCell = ({ tdProps, dataItem, field }) => {
    const value = dataItem[field]

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


const DetailCell = ({ tdProps, dataItem, field }) => {
    return (
        <td  {...tdProps}>
            <Tooltip anchorElement="target" position="top">
                <span
                    title={dataItem.emailePhone}
                    style={{
                        display: "inline-block",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {dataItem.emailePhone}
                </span>
            </Tooltip>
            {/* <div className="text-ellipsis">
                {dataItem.emailePhone || "-"}
            </div> */}
        </td>
    )
}
const ApprovalStatusCell = ({ tdProps, dataItem, statusOptions, getTickets, supportTicketPermission }) => {

    const supportTicketAsyncEdit = async (id) => {
        const payload = {
            statusId: id,
            ticketId: dataItem.id,
            adminDescription: null
        }
        if (confirm("Are You Want To Chnage Ticket Status ? ")) {

            const res = await apiRequest("POST", API_ROUTES.supportTicket.supportTicketsUpdateAsync, payload, null, {
                showLoader: true,
                showToaster: true
            })
            if (res.status) {
                getTickets()
            }
        }
    }
    return (
        <td {...tdProps}>
            <div className="approval-status-wrapper">

                <select disabled={!supportTicketPermission?.canUpdate} onChange={(e) => supportTicketAsyncEdit(e.target.value)} className="approval-status-select" defaultValue={dataItem.status}>
                    <option value="">{dataItem.status}</option>
                    {statusOptions && statusOptions.map((status, index) => (
                        <option disabled={dataItem.status === status.description} key={index} value={status.id}>
                            {status.description}
                        </option>
                    ))}
                </select>
            </div>
        </td>
    );
};
export default function SupportTicket() {

    const [supportTicketsData, setsupportTicketsData] = useState([])
    const [statusOptions, setStatusOptions] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [ticketId, setticketId] = useState(null)
    const [searchText, setSearchText] = useState("");
    const [customSearch, setcustomSearch] = useState("");
    const [filters, setFilters] = useState([])
    const {
        dataState,
        onDataStateChange,
        page,
        pageSize,
        resetPage,
        sort,
        kendoSort,
        setKendoSort,
    } = useGridPagination(10)
    // const permission = usePermission()
    // const supportTicketPermission = permission.find((value, index) => value.menuId === MENU.SUPPORT)
    // console.log(supportTicketPermission);

    const { supportPermission: supportTicketPermission } = useUserPermission()
    const getSuppportStatus = async () => {
        const res = await apiRequest("GET", API_ROUTES.common.getSupportStatus, null, null, {
            showLoader: true
        })
        if (res.status && res.data) {
            setStatusOptions(res.data)
        }
    }

    const getTickets = async () => {
        const res = await apiRequest("POST", API_ROUTES.supportTicket.SupportTicketViewList, { page, pageSize, customSearch, Sorts: sort, Filters: filters }, null, {
            showLoader: true
        })
        console.log(res.data);
        setsupportTicketsData(res.data)
    }

    const handleGridDataStateChange = (event) => {
        onDataStateChange(event)
        setKendoSort(event.dataState?.sort || [])
        const nextFilter = event.dataState?.filter
        if (nextFilter) {
            setFilters(getBackendFilters(nextFilter))
        } else {
            setFilters([])
        }
    }

    useEffect(() => {
        getSuppportStatus()
        getTickets()
    }, [page, pageSize, customSearch, sort, filters])


    const supportTicketsColumns = [


        ...(supportTicketPermission?.canUpdate || supportTicketPermission?.canDelete
            ? [
                { field: "action", title: "Action", cell: ActionCell, width: "80px" },
            ]
            : []),



        { field: "userName", title: "userName", width: "130px", filter: "text", columnMenu: ColumnMenu },
        { field: "emailePhone", title: "Email/Phone", width: "160px", cell: DetailCell, filter: "text", columnMenu: ColumnMenu },
        { field: "issueType", title: "Issue Type", filter: "text", columnMenu: ColumnMenu },
        { field: "description", title: "Description", filter: "text", columnMenu: ColumnMenu },
        { field: "adminDescription", title: "Admin Comments", filter: "text", columnMenu: ColumnMenu },
        { field: "status", title: "Ticket status", cell: (props) => <ApprovalStatusCell {...props} statusOptions={statusOptions} />, filter: "text", columnMenu: ColumnMenu },
    ];

    return (
        <>
            <div className='container-fluid'>

                <div className="col mb-3">
                    <h2 className="page-title">Support Tickets</h2>
                </div>
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
                </div>



                <div className="accordion-body mt-3 mt-xxl-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="table-responsive">
                                {
                                    supportTicketPermission.canRead
                                    &&

                                    <Grid
                                        className="table-wrapper  text-center"
                                        data={supportTicketsData}
                                        skip={dataState.skip}
                                        take={dataState.take}
                                        sortable={{ allowUnsort: true, mode: 'single' }}
                                        sort={kendoSort}

                                        filter={dataState.filter}
                                        filterOperators={{
                                            text: [{ text: 'grid.filterContainsOperator', operator: 'contains' }],
                                            numeric: [{ text: 'grid.filterEqOperator', operator: 'eq' }],
                                            boolean: [{ text: 'grid.filterEqOperator', operator: 'eq' }]
                                        }}
                                        columnMenuIcon={filterIcon}
                                        pageable={{
                                            buttonCount: 5,
                                            pageSizes: [10, 20, 50],
                                            info: true,
                                            previousNext: true,
                                            type: "numeric"
                                        }}
                                        onDataStateChange={handleGridDataStateChange}
                                    >
                                        {supportTicketsColumns.map((col) => (
                                            <GridColumn
                                                key={col.field}
                                                field={col.field}
                                                title={col.title}
                                                width={col.width || "150px"}
                                                sortable={col.field === 'action' ? false : true}
                                                cells={
                                                    col.cell
                                                        ? {
                                                            data: (props) => (
                                                                <col.cell
                                                                    {...props}
                                                                    supportTicketPermission={supportTicketPermission}
                                                                    setShowModal={setShowModal}
                                                                    setticketId={setticketId}
                                                                    getTickets={getTickets}
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
                                    </Grid>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    showModal
                    &&

                    <SupportTicketEdit
                        showModal={showModal}
                        setShowModal={setShowModal}
                        ticketId={ticketId}
                        statusOptions={statusOptions}
                        getTickets={getTickets}
                    />
                }
            </div>



        </>
    )
}

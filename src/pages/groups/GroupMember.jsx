import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid';
const MemberCell = (props) => {


    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <img
                    style={{
                        height: "45px",
                        width: "45px",
                        borderRadius: "50%",
                        objectFit: "cover"
                    }}
                    src={props?.dataItem?.profileImagePath} alt="" />
                <Link className='text-primary text-decoration-underline' to={`/admin/manage-end-user/view/${props.dataItem.userId}`}


                >
                    {props?.dataItem?.userName}
                </Link>
                <i className='demo-icon icon-verified ng-star-inserted'></i>

            </div>
        </td>
    );
};
export default function GroupMember() {
    const { id } = useParams()
    const [memberData, setmemberData] = useState([])
    const getMemeberList = async () => {
        const res = await apiRequest("POST", API_ROUTES.groups.getGroupMemberList, { pageNumber: 1, pageSize: 10, groupId: id }, null, {
            showLoader: true
        })
        setmemberData(res.data.data)
    }
    const memberCoulumn = [
        { field: "userName", title: "Profile", cell: MemberCell }
    ]
    useEffect(() => {
        getMemeberList()
    }, [])
    return (
        <div className="container-fluid  ">

            {/* Breadcrumb */}
            <div className="mb-4 activity-breadcrumb">
                < span className="text-danger fw-bold" > Groups</span >
                <span className="mx-2 text-dark">/</span>
                <span className="text-danger fw-bold">Group Details</span>
                <span className="mx-2 text-dark">/</span>
                <span className="fw-bold text-dark">Group Members</span>
            </div >

            <div className='mt-4' style={{ width: "230px" }}>
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

            <div className="accordion-body mt-3 mt-xxl-4">
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            <Grid
                                className="table-wrapper  text-center"
                                data={memberData}

                                pageable={{
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    info: true,
                                    previousNext: true,
                                    type: "numeric"
                                }}

                            >
                                {memberCoulumn.map((col) => (
                                    <GridColumn
                                        key={col.field}
                                        field={col.field}
                                        title={col.title}
                                        width={col.width || "150px"}
                                        cells={
                                            col.cell
                                            && {
                                                data: (props) => (
                                                    <col.cell
                                                        {...props}

                                                    />
                                                )
                                            }

                                        }
                                    />
                                ))}
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

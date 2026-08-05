import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import BreadCumb from '../../components/common/breadCumb/BreadCumb';
import { usePermission } from '../../hooks/UsePermission';
import { MENU } from '../../data/Menu';
const MemberCell = (props) => {

    const permission = usePermission()
    const endUserPermission = permission.find((value, index) => value.menuId === MENU.END_USER)
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
                {

                }
                {
                    endUserPermission?.canRead
                        ?

                        <Link className='text-primary text-decoration-underline' to={`/admin/manage-end-user/view/${props.dataItem.userId}`}


                        >
                            {props?.dataItem?.userName}
                        </Link>
                        :
                        <span className=''>
                            {props?.dataItem?.userName}
                        </span>
                }
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
            <BreadCumb items={[{ label: "Group Details", path: `/admin/groups/view/${id}` }, { label: "Group Members" }]} />

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

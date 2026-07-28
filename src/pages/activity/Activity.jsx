import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Link } from 'react-router-dom';
const ActionCell = (props) => {


    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">
                <Link to={`/admin/activity/view/${props.dataItem.postId}`}

                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
                </Link>
            </div>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
const ImagesVdeo = ({ tdProps, dataItem }) => {

    const isVideo = (url) => {
        return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
    };

    return (
        <td {...tdProps}>
            {dataItem.attachmentList?.length > 0 ? (
                <div className="d-flex align-items-center gap-2 overflow-auto">
                    {dataItem.attachmentList.map((value, index) =>
                        isVideo(value) ? (
                            <video
                                key={index}
                                width="50"
                                src={value}
                                height="50"
                                className="rounded flex-shrink-0"

                            // autoPlay={true}
                            >

                            </video>
                        ) : (
                            <img
                                key={index}
                                src={value}
                                alt=""
                                width="50"
                                height="50"
                                className="rounded flex-shrink-0"
                                style={{ objectFit: "cover" }}
                            />
                        )
                    )}
                </div>
            ) : (
                "-"
            )}
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
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
export const DateCell = ({ tdProps, dataItem, field }) => {
    // console.log(dataItem);

    return (
        <td {...tdProps}>
            {new Date(dataItem?.createdDate || dataItem?.createdOn || dataItem?.reportDate || dataItem?.createdAt).toLocaleDateString("en-US")}
        </td>
    )
}
const UserNameCell = ({ tdProps, dataItem, field }) => {
    return (
        <td {...tdProps}>
            <Link className='text-primary' to={`/admin/manage-end-user/view/${dataItem.userId}`}>
                {dataItem.userName}
            </Link>
        </td>
    )
}
export default function Activity() {
    const [activityData, setactivityData] = useState([])
    const [total, setTotal] = useState(0);
    const [dataState, setDataState] = useState({
        skip: 0,
        take: 10,
    });

    const getActivities = async () => {
        const page = Math.floor(dataState.skip / dataState.take) + 1;
        const payload = {
            page,
            pageSize: dataState.take
        };
        const res = await apiRequest("POST", API_ROUTES.activities.getActivities, payload, null, {
            showLoader: true
        })
        setactivityData(res.data.data)
    }
    const venueActivityTabColumn = [
        { field: "action", title: "Action", cell: ActionCell, width: "80px" },
        { field: "userName", title: "Created By", width: "150px", cell: UserNameCell },
        { field: "createdOn", title: "Created On", cell: DateCell, width: "150px" },
        { field: "postTypeName", title: "Post Type", width: "150px" },
        { field: "attachmentList", title: "Images/Video", cell: ImagesVdeo, width: "180px" },
        { field: "post", title: "Description", width: "150px" },
        { field: "rate", title: "Rating", width: "100px" },
        { field: "totalGun", title: "Gun", width: "100px" },
        { field: "totalLike", title: "Likes", width: "100px" },
        { field: "totalComment", title: "Comments", width: "120px" },
        { field: "totalShare", title: "Share", width: "100px" },
        { field: "totalHide", title: "Hide Count", width: "120px" },
        { field: "totalReport", title: "Reported", width: "120px" },
        { field: "isActive", title: "Status", width: "110px", cell: StatusCell }
    ];

    useEffect(() => {
        getActivities()
    }, [dataState])
    return (

        <div className="container-fluid">
            <div className="page-heading">
                <div className="row align-items-center gap-2">
                    <div className="col">
                        <h2 className="page-title">Activity</h2>
                    </div>


                </div>
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
            </div>
            <div className="card-section">
                <div className="row">
                    <div className="col-xl-12 mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <Grid
                                        className="table-wrapper  text-center"
                                        data={activityData}
                                        sortable
                                        pageable={{
                                            buttonCount: 5,
                                            pageSizes: [20, 50, 150],
                                            info: true,
                                            previousNext: true,
                                            type: "numeric"
                                        }}
                                        onDataStateChange={(e) => {
                                            setDataState({
                                                skip: e.dataState.skip,
                                                take: e.dataState.take
                                            });
                                        }}
                                    >
                                        {
                                            venueActivityTabColumn?.map((col, ind) => {
                                                console.log(col.width);

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
                                    {/* 
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Action</th>
                                                <th>Host Name</th>
                                                <th>Event Name</th>
                                                <th>Date &amp; Time</th>
                                                <th>Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Andrew Abbott</td>
                                                <td>Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Tom Curran</td>
                                                <td>GO Up meeting</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Christopher Nolan</td>
                                                <td>Gun Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Tom Curran</td>
                                                <td>GO Up meeting</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Christopher Nolan</td>
                                                <td>Gun Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Tom Curran</td>
                                                <td>GO Up meeting</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="small-square-btn edit-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <a
                                                            className="small-square-btn danger-btn"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-delete-1" />
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>Christopher Nolan</td>
                                                <td>Gun Meet Ups</td>
                                                <td>
                                                    <p className="mb-0">
                                                        Monday, 17 May 2024 3:30 am- 6:30 am
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="mb-0">
                                                        Gun Club Association Member Meeting, Buriel
                                                        club co. Ashville, NC
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

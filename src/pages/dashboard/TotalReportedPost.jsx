import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { DateCell } from '../activity/Activity';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import ReportedUser from './ReportedUser';
import { handleStatusChange } from '../../utils/ChangeStatus';
import { Tooltip } from '@progress/kendo-react-tooltip';
const ActionCell = (props) => {
  // console.log(props.dataItem.venueId);

  return (
    <td {...props.tdProps}>
      <div className="d-flex gap-2 align-items-center">

        <Link
          to={`/admin/activity/view/${props.dataItem.postId}`}
          className="small-square-btn edit-btn"
        >
          <i className="demo-icon icon-eye-line"></i>
        </Link>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={props.dataItem.isActive}
            readOnly
            onChange={(e) =>
              handleStatusChange(
                props.dataItem.postId,
                e.target.checked,
                "activities",
                "activitiesPostStatus"
              )
            }
          />
        </div>
      </div>
    </td>
  );
};
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

const ReportedCell = ({ tdProps, dataItem, isOpenReportedPerson, setisOpenReportedPerson, filter }) => {
  // console.log(dataItem.venueId);

  // console.log(dataItem, isOpenReportedPerson);

  return (
    <>
      <td {...tdProps}>
        <div>
          {
            dataItem.totalCount > 0
              ?

              <Link
                onClick={() => {
                  setisOpenReportedPerson(true)

                }}
                className="text-primary"
                style={{ cursor: "pointer" }}
              >
                {dataItem.totalCount}
              </Link>
              :
              0
          }
        </div>
      </td>

      {
        isOpenReportedPerson
        &&
        <ReportedUser
          filter={filter}
          reportedId={dataItem.postId}
          setisOpenReportedPerson={setisOpenReportedPerson} />
      }

    </>
  );
};


export default function TotalReportedPost({ topReportedPosts, filter, dashboardPermission }) {
  // console.log(topReportedPosts);
  const [isOpenReportedPerson, setisOpenReportedPerson] = useState(false)
  const reportedColumns = [
    { field: "action", title: "Action", cell: ActionCell, width: "60px" },
    { field: "userName", title: "Posted By", width: "100px" },
    { field: "totalCount", title: "Total Reports", width: "80px", cell: ReportedCell },
    { field: "createdOn", title: "Uploaded Date", cell: DateCell, width: "130px" },
    { field: "totalLike", title: "Likes", width: "50px" },
    { field: "totalComment", title: "Comments", width: "50px" },
    { field: "totalShare", title: "Shares", width: "50px" },
    // { field: "venueOwnerUserName", title: "Owner Name", cell: UserNameCell },
  ]

  return (
    <>

      <Grid
        className="table-wrapper  text-center"
        data={topReportedPosts}

        pageable={{
                                            responsive: false,
          buttonCount: 5,
          pageSizes: [10, 20, 50],
          info: true,
          previousNext: true,
          type: "numeric"
        }}

      >
        {reportedColumns.map((col) => (
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
                      dashboardPermission={dashboardPermission}
                      isOpenReportedPerson={isOpenReportedPerson}
                      setisOpenReportedPerson={setisOpenReportedPerson}
                      filter={filter}
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

    </>

  )
}

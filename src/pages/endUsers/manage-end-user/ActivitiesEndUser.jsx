import { Grid, GridColumn } from '@progress/kendo-react-grid';
import React from 'react';
import { Link } from 'react-router-dom';
import { useStatusChange } from '../../../hooks/useStatusChange';
import { Tooltip } from '@progress/kendo-react-tooltip';
const ActionCell = (props) => {
  return (
    <td {...props.tdProps}>
      <div className="d-flex gap-2 align-items-center">
        <Link
          to={`/admin/activity/view/${props.dataItem.postId}`}

          className="small-square-btn edit-btn"
        >
          <i className="demo-icon icon-eye-line"></i>
        </Link>
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
            display: 'inline-block',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value ?? '-'}
        </span>
      </Tooltip>
    </td>
  );
};
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
              ></video>
            ) : (
              <img
                key={index}
                src={value}
                alt=""
                width="50"
                height="50"
                className="rounded flex-shrink-0"
                style={{ objectFit: 'cover' }}
              />
            )
          )}
        </div>
      ) : (
        '-'
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
          onChange={(e) =>
            props.handleStatusChange(
              props.dataItem.postId,
              e.target.checked,
              'activities',
              'activitiesPostStatus'
            )
          }
        />
        <label className="form-check-label"></label>
      </div>
    </td>
  );
};
export const DateCell = ({ tdProps, dataItem, field }) => {
  console.log(dataItem);

  return (
    <td {...tdProps}>
      {new Date(
        dataItem?.createdDate || dataItem?.createdOn
      ).toLocaleDateString('en-US')}
    </td>
  );
};

const DetailCell = ({ tdProps, dataItem, field }) => {
  return (
    <td {...tdProps}>
      <div className="text-ellipsis">{dataItem.post || '-'}</div>
    </td>
  );
};

export default function ActivitiesEndUser({ data }) {
  const { handleStatusChange, statusConfirmDialog } = useStatusChange();
  const activityTabColumn = [
    { field: 'action', title: 'Action', cell: ActionCell, width: '80px' },
    { field: 'createdOn', title: 'Created On', cell: DateCell, width: '150px' },
    { field: 'postTypeName', title: 'Post Type', width: '150px' },
    {
      field: 'attachmentList',
      title: 'Images/Video',
      cell: ImagesVdeo,
      width: '180px',
    },
    { field: 'post', title: 'Description', width: '150px', cell: DetailCell },
    { field: 'rate', title: 'Rating', width: '100px' },
    { field: 'totalGun', title: 'Gun', width: '100px' },
    { field: 'totalLike', title: 'Likes', width: '100px' },
    { field: 'totalComment', title: 'Comments', width: '120px' },
    { field: 'totalShare', title: 'Share', width: '100px' },
    { field: 'totalHide', title: 'Hide Count', width: '120px' },
    { field: 'totalReport', title: 'Reported', width: '120px' },
    { field: 'isActive', title: 'Status', width: '110px', cell: StatusCell },
  ];
  return (
    <div
      id="collapseTwo"
      className="accordion-collapse collapse show d-lg-block"
      aria-labelledby="headingTwo"
      data-bs-parent="#myTabContent"
    >
      <div className="accordion-body mt-3 mt-xxl-4">
        <div className="row">
          <div className="col-12">
            <div className="">
              <Grid
                className="table-wrapper  text-center"
                data={data}
                sortable
                pageable={{
                  responsive: false,
                  buttonCount: 5,
                  pageSizes: [20, 50, 150],
                  info: true,
                  previousNext: true,
                  type: 'numeric',
                }}
              >
                {activityTabColumn?.map((col, ind) => {
                  console.log(col.width);

                  return (
                    <GridColumn
                      key={col.field}
                      field={col.field}
                      title={col.title}
                      width={col.width}
                      pageable={{
                        responsive: false,
                        buttonCount: 4,
                        pageSizes: [20, 50, 200],
                        previousNext: true,
                        info: true,
                        type: 'numeric',
                      }}
                      cells={
                        col.cell
                          ? {
                              data: (props) => <col.cell {...props} handleStatusChange={handleStatusChange} />,
                            }
                          : {
                              data: (props) => (
                                <TextCell {...props} field={col.field} />
                              ),
                            }
                      }
                    />
                  );
                })}
              </Grid>
            </div>
          </div>
        </div>
      </div>
      {statusConfirmDialog}
    </div>
  );
}

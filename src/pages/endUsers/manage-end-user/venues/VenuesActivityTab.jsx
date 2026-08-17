import { Grid, GridColumn } from '@progress/kendo-react-grid';
import React from 'react';
import { Link } from 'react-router-dom';
import { DateCell } from '../UploadGun';
import { UserNameCell } from './VenueList';
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
        />
        <label className="form-check-label"></label>
      </div>
    </td>
  );
};
export default function VenuesActivityTab({ activityTabData }) {
  const venueActivityTabColumn = [
    { field: 'action', title: 'Action', cell: ActionCell, width: '80px' },
    {
      field: 'userName',
      title: 'Uploaded By',
      width: '150px',
      cell: UserNameCell,
    },
    {
      field: 'createdOn',
      title: 'Uploaded Date',
      cell: DateCell,
      width: '150px',
    },
    {
      field: 'attachmentList',
      title: 'Images/Video',
      cell: ImagesVdeo,
      width: '180px',
    },
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
      className="tab-pane fade show active accordion-item d-block"
      id="nav-four-tab-pane"
      role="tabpanel"
      aria-labelledby="nav-four-tab"
      tabIndex={0}
    >
      <h2 className="accordion-header d-lg-none" id="headingFour">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseFour"
          aria-expanded="false"
          aria-controls="collapseThree"
        >
          Activities
        </button>
      </h2>
      <div
        id="collapseFour"
        className="accordion-collapse collapse d-lg-block"
        aria-labelledby="headingFour"
        data-bs-parent="#myTabContent"
      >
        <div className="accordion-body mt-3 mt-xxl-4">
          <div className="row">
            <div className="col-12">
              <div className="">
                <Grid
                  className="table-wrapper  text-center"
                  data={activityTabData}
                  sortable
                  pageable={{
                    responsive: false,
                    buttonCount: 5,
                    pageSizes: [10, 20, 50],
                    info: true,
                    previousNext: true,
                    type: 'numeric',
                  }}
                >
                  {venueActivityTabColumn?.map((col, ind) => {
                    console.log(col.width);

                    return (
                      <GridColumn
                        key={col.field}
                        field={col.field}
                        title={col.title}
                        width={col.width}
                        cells={
                          col.cell
                            ? {
                                data: (props) => <col.cell {...props} />,
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
      </div>
    </div>
  );
}

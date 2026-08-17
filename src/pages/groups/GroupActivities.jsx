import { Grid, GridColumn } from '@progress/kendo-react-grid';
import React, { useEffect, useState } from 'react';
import BreadCumb from '../../components/common/breadCumb/BreadCumb';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';
import { handleStatusChange } from '../../utils/ChangeStatus';
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
            handleStatusChange(
              props.dataItem.postId,
              e.target.checked,
              'activities',
              'activitiesPostStatus',
              props.getActivities
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
        dataItem?.createdDate || dataItem?.createdOn || dataItem?.reportDate
      ).toLocaleDateString('en-US')}
    </td>
  );
};
const UserNameCell = ({ tdProps, dataItem, field }) => {
  return (
    <td {...tdProps}>
      <Link
        className="text-primary"
        to={`/admin/manage-end-user/view/${dataItem.userId}`}
      >
        {dataItem.userName}
      </Link>
    </td>
  );
};
export default function GroupActivities() {
  const [activityData, setactivityData] = useState([]);
  const { id } = useParams();
  const [total, setTotal] = useState(0);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 10,
  });

  const getActivities = async () => {
    const page = Math.floor(dataState.skip / dataState.take) + 1;
    const payload = {
      page,
      pageSize: dataState.take,
      Filters: [{ Field: 'groupId', OperatorType: 2, Value: id }],
    };
    const res = await apiRequest(
      'POST',
      API_ROUTES.activities.getActivities,
      payload,
      null,
      {
        showLoader: true,
      }
    );
    setactivityData(res.data.data);
  };
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

    { field: 'totalLike', title: 'Likes', width: '100px' },
    { field: 'totalComment', title: 'Comments', width: '120px' },
    { field: 'totalShare', title: 'Share', width: '100px' },

    { field: 'totalReport', title: 'Reported', width: '120px' },
    { field: 'isActive', title: 'Status', width: '110px', cell: StatusCell },
  ];

  useEffect(() => {
    getActivities();
  }, [dataState]);
  return (
    <div className="container-fluid">
      <BreadCumb
        items={[
          { label: 'Groups', path: '/admin/groups' },
          { label: 'Group Activities' },
        ]}
      />
      <div className="card-section">
        <div className="row">
          <div className="col-xl-12 mt-3 mt-xxl-4">
            <div className="row">
              <div className="col-12">
                <div className="">
                  <Grid
                    className="table-wrapper  text-center"
                    data={activityData}
                    sortable
                    pageable={{
                      responsive: false,
                      buttonCount: 5,
                      pageSizes: [20, 50, 150],
                      info: true,
                      previousNext: true,
                      type: 'numeric',
                    }}
                    onDataStateChange={(e) => {
                      setDataState({
                        skip: e.dataState.skip,
                        take: e.dataState.take,
                      });
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
                                  data: (props) => (
                                    <col.cell
                                      getActivities={getActivities}
                                      {...props}
                                    />
                                  ),
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
    </div>
  );
}

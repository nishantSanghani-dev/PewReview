import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { filterIcon } from '@progress/kendo-svg-icons';
import { ColumnMenu } from '../../components/grid/ColumnMenu';
import { getBackendFilters } from '../../components/grid/GridFilter';
import { Link } from 'react-router-dom';
import SerachFilter from '../../components/common/SerachFilter';
import useGridPagination from '../../hooks/useGridPagination';
import { Tooltip } from '@progress/kendo-react-tooltip';
import { usePermission } from '../../hooks/UsePermission';
import { MENU } from '../../data/Menu';
import useUserPermission from '../../utils/UserPermission';
import MediaViewer from '../../components/common/mediaPlayer/MediaPlayer';
import MediaController from '../../components/common/mediaController/MediaController';
import { useStatusChange } from '../../hooks/useStatusChange';
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
const ImagesVdeo = ({ tdProps, dataItem, handleImageClick, setShowMediaModal }) => {
  const isVideo = (url) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
  };

  const attachments = dataItem.attachmentList || [];
  const visibleAttachments = attachments.slice(0, 2);
  const remainingCount = attachments.length - 2;

  return (
    <td {...tdProps}>
      {attachments.length > 0 ? (
        <div className="d-flex align-items-center gap-2">
          {visibleAttachments.map((value, index) =>
            isVideo(value) ? (
              <video
                key={index}
                width="50"
                height="50"
                onClick={() => handleImageClick(value, attachments)}
                src={value}
                className="rounded flex-shrink-0"
              />
            ) : (
              <img
                key={index}
                src={value}
                onClick={() => handleImageClick(value, attachments)}
                alt=""
                width="50"
                height="50"
                className="rounded flex-shrink-0"
                style={{ objectFit: 'cover' }}
              />
            )
          )}

          {remainingCount > 0 && (
            <div
              className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#f0f0f0',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              +{remainingCount}
            </div>
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
          disabled={!props.activityPersmission.canUpdate}
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


  return (
    <td {...tdProps}>
      {new Date(
        dataItem?.updatedOn ||
        dataItem?.createdDate ||
        dataItem?.createdOn ||
        dataItem?.reportDate ||
        dataItem?.createdAt
      ).toLocaleDateString('en-US')}
    </td>
  );
};
const UserNameCell = ({ tdProps, dataItem, field, endUserPermission }) => {
  // const endUserPermission = permission.find((value, index) => value.menuId === MENU.END_USER)

  return (
    <td {...tdProps}>
      {endUserPermission?.canRead ? (
        <Link
          className="text-primary"
          to={`/admin/manage-end-user/view/${dataItem.userId}`}
        >
          {dataItem.userName}
        </Link>
      ) : (
        <span className="">{dataItem.userName}</span>
      )}
    </td>
  );
};
export default function Activity() {
  const [activityData, setactivityData] = useState([]);
  const [totalRecords, settotalRecords] = useState(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState([]);

  const {
    dataState,
    onDataStateChange,
    page,
    pageSize,
    resetPage,
    sort,
    kendoSort,
    setKendoSort,
  } = useGridPagination(10);
  // const permission = usePermission()
  // const activityPersmission = permission.find((value, index) => value.menuId === MENU.ACTIVITY)
  // console.log(activityPersmission);
  const {
    activityPermission: activityPersmission,
    endUserPermission,
    venuePermission,
  } = useUserPermission();
  console.log(activityPersmission);

  const getActivities = async () => {
    const payload = {
      page,
      pageSize,
      customSearch,
      Sorts: sort,
      Filters: filters,
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
    settotalRecords(res.data.totalRecord);
  };
  const { handleStatusChange, statusConfirmDialog } = useStatusChange(getActivities);
  const venueActivityTabColumn = [
    ...(activityPersmission?.canRead && venuePermission?.canRead
      ? [
        {
          field: 'action',
          title: 'Action',
          cell: ActionCell,
          width: '80px',
        },
      ]
      : []),

    {
      field: 'userName',
      title: 'Created By',
      width: '150px',
      cell: UserNameCell,
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'createdOn',
      title: 'Created On',
      cell: DateCell,
      width: '150px',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'postTypeName',
      title: 'Post Type',
      width: '150px',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'attachmentList',
      title: 'Images/Video',
      cell: ImagesVdeo,
      width: '180px',
    },
    {
      field: 'post',
      title: 'Description',
      width: '150px',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'rate',
      title: 'Rating',
      width: '100px',
      filter: 'numeric',
      columnMenu: ColumnMenu,
    },
    {
      field: 'totalGun',
      title: 'Gun',
      width: '100px',
      filter: 'numeric',
      columnMenu: ColumnMenu,
    },
    {
      field: 'totalLike',
      title: 'Likes',
      width: '100px',
      filter: 'numeric',
      columnMenu: ColumnMenu,
    },
    {
      field: 'totalComment',
      title: 'Comments',
      width: '120px',
      filter: 'numeric',
      columnMenu: ColumnMenu,
    },
    {
      field: 'totalShare',
      title: 'Share',
      width: '100px',
      filter: 'numeric',
      columnMenu: ColumnMenu,
    },
    {
      field: 'totalHide',
      title: 'Hide Count',
      width: '120px',
      filter: 'numeric',
      columnMenu: ColumnMenu,
    },
    {
      field: 'totalReport',
      title: 'Reported',
      width: '120px',
      filter: 'numeric',
      columnMenu: ColumnMenu,
    },
    {
      field: 'isActive',
      title: 'Status',
      width: '110px',
      cell: StatusCell,
      filter: 'boolean',
      columnMenu: ColumnMenu,
    },
  ];

  const [searchText, setSearchText] = useState('');
  const [customSearch, setcustomSearch] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [totalThumbnailImages, settotalThumbnailImages] = useState([])
  const handleImageClick = (image, attachments) => {
    setSelectedImage(image);
    setShowMediaModal(true);
    settotalThumbnailImages(attachments)
  };

  const handleCloseModal = () => {
    setShowMediaModal(false);
    setSelectedImage("");
  };
  const handleGridDataStateChange = (event) => {
    onDataStateChange(event);
    setKendoSort(event.dataState?.sort || []);
    const nextFilter = event.dataState?.filter;
    if (nextFilter) {
      setFilters(getBackendFilters(nextFilter));
    } else {
      setFilters([]);
    }
  };

  useEffect(() => {
    getActivities();
  }, [page, pageSize, customSearch, sort]);
  return (
    <div className="container-fluid">
      <div className="page-heading">
        <div className="row align-items-center gap-2">
          <div className="col">
            <h2 className="page-title">Activity</h2>
          </div>
        </div>
        <div className="mt-4" style={{ width: '230px' }}>
          <SerachFilter
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSubmit={(value) => {
              resetPage();
              setcustomSearch(value);
            }}
          />
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
                    data={activityData}
                    skip={dataState.skip}
                    take={dataState.take}
                    filter={dataState.filter}
                    filterOperators={{
                      text: [
                        {
                          text: 'grid.filterContainsOperator',
                          operator: 'contains',
                        },
                      ],
                      numeric: [
                        { text: 'grid.filterEqOperator', operator: 'eq' },
                      ],
                      boolean: [
                        { text: 'grid.filterEqOperator', operator: 'eq' },
                      ],
                    }}
                    columnMenuIcon={filterIcon}
                    sortable={{ allowUnsort: true, mode: 'single' }}
                    sort={kendoSort}
                    pageable={{
                      responsive: false,
                      buttonCount: 5,
                      pageSizes: [20, 50, 150],
                      info: true,
                      previousNext: true,
                      type: 'numeric',
                    }}
                    onDataStateChange={handleGridDataStateChange}
                  >
                    {venueActivityTabColumn?.map((col, ind) => {
                      // console.log(col.width);

                      return (
                        <GridColumn
                          key={col.field}
                          field={col.field}
                          title={col.title}
                          width={col.width}
                          sortable={col.field === 'action' ? false : true}
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
                                    endUserPermission={endUserPermission}
                                    activityPersmission={activityPersmission}
                                    setShowMediaModal={setShowMediaModal}
                                    handleImageClick={handleImageClick}
                                    handleStatusChange={handleStatusChange}
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

      <MediaController
        show={showMediaModal}
        title='media'
        onClose={handleCloseModal}
        image={selectedImage}
        totalThumbnailImages={totalThumbnailImages ?? []}
      />
      {statusConfirmDialog}
    </div>
  );
}

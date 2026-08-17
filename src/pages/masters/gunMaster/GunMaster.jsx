import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { DateCell } from '../../activity/Activity';
import { useStatusChange } from '../../../hooks/useStatusChange';
import { handleDelete } from '../../../utils/DeleteRecords';
import AleartDialog from '../../../components/common/AleartDialog';
import BreadCumb from '../../../components/common/breadCumb/BreadCumb';
import SerachFilter from '../../../components/common/SerachFilter';
import useGridPagination from '../../../hooks/useGridPagination';
import { ColumnMenu } from '../../../components/grid/ColumnMenu';
import { filterIcon } from '@progress/kendo-svg-icons';
import { usePermission } from '../../../hooks/UsePermission';
import { MENU } from '../../../data/Menu';
import useUserPermission from '../../../utils/UserPermission';
import { Tooltip } from '@progress/kendo-react-tooltip';
import Gun from './Gun';
const ActionCell = (props) => {
  const item = props.dataItem;
  return (
    <td {...props.tdProps}>
      <span className="d-flex gap-2 align-items-center">
        {props.gunMasterPermission.canUpdate && (
          <button
            onClick={() => {
              props.setIsAddGunOpen(true);
              props.setId(item.gunId);
            }}
            className="small-square-btn edit-btn"
          >
            <i className="demo-icon icon-edit-1" />
          </button>
        )}
        {props.gunMasterPermission.canDelete && (
          <button
            onClick={() => {
              props.setSelectedGunId(item.gunId);
              props.setShowDeleteDialog(true);
            }}
            type="button"
            className="small-square-btn danger-btn"
          >
            <i className="demo-icon icon-delete-1" />
          </button>
        )}
      </span>
    </td>
  );
};
const StatusCell = (props) => {
  return (
    <td {...props.tdProps}>
      <div className="form-check form-switch mb-0">
        <input
          disabled={!props.gunMasterPermission.canUpdate}
          className="form-check-input"
          type="checkbox"
          checked={props.dataItem.isActive}
          readOnly
          onChange={(e) =>
            props.handleStatusChange(
              props.dataItem.gunId,
              e.target.checked,
              'gun',
              'gunStatusUpdate'
            )
          }
        />
        <label className="form-check-label"></label>
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
const ImageCell = (props) => {
  return (
    <td {...props.tdProps}>
      {props.dataItem.attachmentFullPath ? (
        <img
          src={props.dataItem.attachmentFullPath}
          alt="Badge"
          className="gun-img"
        />
      ) : null}
    </td>
  );
};
const DetailCell = ({ tdProps, dataItem, field }) => {
  return (
    <td {...tdProps}>
      <div className="text-ellipsis">{dataItem.details || '-'}</div>
    </td>
  );
};
const ApprovalStatusCell = ({
  tdProps,
  dataItem,
  statusOptions,
  gunMasterPermission,
}) => {
  return (
    <td {...tdProps}>
      <div className="approval-status-wrapper">
        <select
          disabled={!gunMasterPermission.canUpdate}
          className="approval-status-select"
          defaultValue={dataItem.status}
        >
          <option value="">{dataItem.approvalStatusName}</option>
          {statusOptions &&
            statusOptions.map((status, index) => (
              <option
                disabled={dataItem.status === status.description}
                key={index}
                value={status}
              >
                {status.description}
              </option>
            ))}
        </select>
      </div>
    </td>
  );
};
export default function GunMaster() {
  const [gunData, setgunData] = useState([]);
  const [statusOptions, setstatusOptions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [customSearch, setcustomSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [isAddGunOpen, setIsAddGunOpen] = useState(false);
  const [id, setId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedGunId, setSelectedGunId] = useState(null);
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

  const { gunMasterPermission } = useUserPermission();
  const getGun = async () => {
    const res = await apiRequest(
      'POST',
      API_ROUTES.gun.getGun,
      { page, pageSize, customSearch, Sorts: sort, Filters: filters },
      null,
      {
        showLoader: true,
      }
    );
    setgunData(res.data.data);
  };

  const { handleStatusChange, statusConfirmDialog } = useStatusChange(getGun);
  const gunCoulmn = [
    ...(gunMasterPermission?.canUpdate || gunMasterPermission?.canDelete
      ? [
        {
          field: 'action',
          title: 'Action',
          cell: ActionCell,
          width: '100px',
        },
      ]
      : []),

    {
      field: 'gunName',
      title: 'Gun Name',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'categoryNames',
      title: 'Category Names',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'manufacturerNames',
      title: 'Manufacturer Names',
      width: '220px',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'details',
      title: 'Details',
      cell: DetailCell,
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    { field: 'attachmentFullPath', title: 'Images', cell: ImageCell },
    {
      field: 'createdByUserName',
      title: 'Created By',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'Created On',
      title: 'Updated On',
      cell: DateCell,
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'updatedByUserName',
      title: 'Modified By',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'approvalStatusName',
      title: 'Approval Status',
      cell: ApprovalStatusCell,
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'isActive',
      title: 'Status',
      cell: StatusCell,
      filter: 'boolean',
      columnMenu: ColumnMenu,
    },
  ];
  const getSuppportStatus = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.common.getSupportStatus,
      null,
      null,
      {
        showLoader: true,
      }
    );
    if (res.status && res.data) {
      setstatusOptions(res.data);
    }
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
    getGun();
    getSuppportStatus();
  }, [page, pageSize, customSearch, sort, filters]);
  return (
    <div className="container-fluid">
      <div className="mb-3 activity-breadcrumb">
        <span style={{ color: '#666766' }} className="fw-bold">
          Masters
        </span>
        <span className="mx-2 text-dark">/</span>
        <span className="fw-bold text-dark">Gun Master</span>
      </div>
      <div className="tabbar-section">
        <div className="row align-items-center gap-3">
          <div className="col-12 col-lg-auto">
            <SerachFilter
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={(value) => {
                resetPage();
                setcustomSearch(value);
              }}
            />
          </div>
          {gunMasterPermission?.canCreate && (
            <div className="col-12 col-lg">
              <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">
                <button
                  onClick={() => {
                    setIsAddGunOpen(true);
                    setId(null);
                  }}
                  className="btn main-btn border-btn blue-btn"
                  style={{
                    background:
                      'linear-gradient(90deg, rgb(193, 39, 45) 0%, rgb(0 0 0 / 92%) 100%)',
                    color: 'white',
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-12 mt-3 mt-xxl-4">
            <div className="">
              <Grid
                className="table-wrapper"
                data={gunData}
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
                  numeric: [{ text: 'grid.filterEqOperator', operator: 'eq' }],
                  boolean: [{ text: 'grid.filterEqOperator', operator: 'eq' }],
                }}
                columnMenuIcon={filterIcon}
                sortable={{ allowUnsort: true, mode: 'single' }}
                sort={kendoSort}
                pageable={{
                  responsive: false,
                  buttonCount: 5,
                  pageSizes: [10, 20, 50],
                  previousNext: true,
                  info: true,
                  type: 'numeric',
                }}
                onDataStateChange={handleGridDataStateChange}
              >
                {gunCoulmn?.map((col, ind) => {
                  return (
                    <GridColumn
                      key={col.field}
                      field={col.field}
                      title={col.title}
                      width={col.width || '150px'}
                      sortable={
                        col.field === 'action' ||
                          col.field == 'attachmentFullPath'
                          ? false
                          : true
                      }
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
                                gunMasterPermission={gunMasterPermission}
                                {...props}
                                statusOptions={statusOptions}
                                getGun={getGun}
                                setIsAddGunOpen={setIsAddGunOpen}
                                setId={setId}
                                setShowDeleteDialog={setShowDeleteDialog}
                                setSelectedGunId={setSelectedGunId}
                                handleStatusChange={handleStatusChange}
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
        {isAddGunOpen && (
          <Gun
            isAddGunOpen={isAddGunOpen}
            setIsAddGunOpen={setIsAddGunOpen}
            getGun={getGun}
            id={id}
            setId={setId}
          />
        )}
        {showDeleteDialog && (
          <AleartDialog
            title="Confirm Delete"
            message="Are you sure you want to delete this Gun? This action cannot be undone."
            onCancel={() => {
              setShowDeleteDialog(false);
              setSelectedGunId(null);
            }}
            onConfirm={async () => {
              await handleDelete(selectedGunId, 'gun', 'gunDelete', getGun);
              setShowDeleteDialog(false);
              setSelectedGunId(null);
            }}
          />
        )}
        {statusConfirmDialog}
      </div>
    </div>
  );
}

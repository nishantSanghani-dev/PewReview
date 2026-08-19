import React, { useEffect, useState } from 'react';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { filterIcon } from '@progress/kendo-svg-icons';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';
import { Link } from 'react-router-dom';
import SerachFilter from '../../../components/common/SerachFilter';
import AleartDialog from '../../../components/common/AleartDialog';
import useGridPagination from '../../../hooks/useGridPagination';
import { usePermission } from '../../../hooks/UsePermission';
import { MENU } from '../../../data/Menu';

import { ExcelExport } from '@progress/kendo-react-excel-export';
import { ColumnMenu } from '../../../components/grid/ColumnMenu';
import { getBackendFilters } from '../../../components/grid/GridFilter';
import useUserPermission from '../../../utils/UserPermission';
import { Button } from 'bootstrap';
import { useStatusChange } from '../../../hooks/useStatusChange';

export default function EndUser() {
  const [manageUserData, setmanageUserData] = useState([]);
  const [total, setTotal] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [ids, setids] = useState([]);
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
  const [searchText, setSearchText] = useState('');
  const [customSearch, setcustomSearch] = useState('');
  const [filters, setFilters] = useState([]);
  const [verifyData, setVerifyData] = useState(null);
  const permission = usePermission();

  // const endUserPermission = permission.find((value, index) => value.menuId === MENU.END_USER)
  // console.log(endUserPermission);
  const { endUserPermission } = useUserPermission();

  const getManageEndUser = async () => {
    try {
      const payload = {
        page,
        pageSize,
        customSearch,
        Sorts: sort,
        Filters: filters,
      };

      const res = await apiRequest(
        'POST',
        API_ROUTES.endUser.endUserView,
        payload,
        null,
        {
          showLoader: true,
        }
      );

      setmanageUserData(res.data.data);
      setTotal(res.data.totalRecord);
    } catch (err) {
      console.log(err);
    }
  };


  const hadleVerifyStatus = async (id, checked) => {
    const res = await apiRequest(
      'PUT',
      API_ROUTES.endUser.endUserVerifyUpdate(id),
      null,
      { isVerify: checked },
      {
        showLoader: true,
        showToaster: true,
      }
    );

    if (res.status) {
      await getManageEndUser();
    }
  };

  const confirmVerifyStatus = async () => {
    if (!verifyData) return;

    await hadleVerifyStatus(verifyData.id, verifyData.checked);
    setVerifyData(null);
  };

  const handleChange = (id, checked) => {
    setids((currentIds) =>
      checked
        ? currentIds.includes(id)
          ? currentIds
          : [...currentIds, id]
        : currentIds.filter((value) => value !== id)
    );
  };

  const handleDelete = (id) => {
    if (id && (typeof id === 'string' || typeof id === 'number')) {
      setids((currentIds) =>
        currentIds.includes(id) ? currentIds : [...currentIds, id]
      );
      setShowDeleteDialog(true);
    } else {
      if (ids.length === 0) {
        alert('Please Select Records');
        return;
      }
      setShowDeleteDialog(true);
    }
  };

  const { handleStatusChange, statusConfirmDialog } = useStatusChange(getManageEndUser);

  const CheckboxCell = (props) => {
    const id = props.dataItem.id;

    return (
      <td {...props.tdProps} className="text-center">
        <label className="custom-checkbox mb-0">
          <input
            type="checkbox"
            value={id}
            checked={props.selectedUserIds.includes(id)}
            onChange={(event) => props.handleChange(id, event.target.checked)}
          />
          <span className="checkmark"></span>
        </label>
      </td>
    );
  };



  const ActionCell = (props) => {
    const item = props.dataItem;

    return (
      <td {...props.tdProps}>
        <span className="d-flex gap-2 align-items-center">
          {props.endUserPermission.canRead && (
            <Link
              to={`/admin/manage-end-user/view/${item.id}`}
              className="small-square-btn edit-btn"
            >
              <i className="demo-icon icon-eye-line" />
            </Link>
          )}

          {props.endUserPermission.canDelete && (
            <button
              onClick={() => {
                props.handleDelete(item.id);
              }}
              type="button"
              className="small-square-btn danger-btn"
            >
              <i className="demo-icon icon-delete-1" />
            </button>
          )}

          {props.endUserPermission.canUpdate && (
            <label className="verify-switch">
              <input

                onChange={(e) => {
                  setVerifyData({
                    id: props.dataItem.id,
                    checked: e.target.checked,
                  });
                }}
                type="checkbox"
                checked={item.isVerify}
                readOnly
              />

              <span className="verify-slider">
                <span className="verify-text">
                  {item.isVerify ? 'Enabled' : 'Verified'}
                </span>
              </span>
            </label>
          )}
        </span>
      </td>
    );
  };
  const StatusCell = (props) => {
    const item = props.dataItem;
    console.log(props);

    return (
      <td {...props.tdProps}>
        <div className="form-check form-switch">
          <input
            disabled={!endUserPermission?.canUpdate}
            className="form-check-input"
            type="checkbox"
            checked={item.isActive}


            onChange={(e) => {
              handleStatusChange(
                props.dataItem.id,
                e.target.checked,
                'endUser',
                'endUserStatusUpdate'
              )
            }
            }
          />
        </div>
      </td>
    );
  };
  const ContactCell = (props) => {
    return <td {...props.tdProps}>{props.dataItem.contactNumber || '-'}</td>;
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
  const _export = React.useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };
  // fetch on mount and whenever paging, sort, filter or search changes
  useEffect(() => {
    getManageEndUser();
  }, [page, pageSize, customSearch, sort, filters]);
  return (
    <div className="container-fluid">
      <div className="col mb-3">
        <h2 className="page-title">Manage End Users</h2>
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
          <div className="col-12 col-lg">
            <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">
              <GridToolbar>
                {endUserPermission.canDelete && ids.length >= 1 && (
                  <button
                    onClick={handleDelete}
                    className="btn main-btn border-btn danger-btn"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={excelExport}

                  className="btn main-btn border-btn sky-btn"
                >
                  Export
                </button>
              </GridToolbar>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-3 mt-xxl-4">
            <div className="table-responsive">
              <ExcelExport data={manageUserData} ref={_export}>
                <Grid
                  csv={true}
                  className="table-wrapper responsive-kendo-grid"
                  tableProps={{ className: 'table' }}
                  style={{ width: '100%', minWidth: '860px' }}

                  data={manageUserData}
                  total={total}

                  skip={dataState.skip}
                  take={dataState.take}

                  sortable={{
                    allowUnsort: true,
                    mode: 'single',
                  }}

                  sort={kendoSort}

                  pageable={{
                    responsive: false,
                    buttonCount: 4,
                    pageSizes: [10, 20, 50],
                    previousNext: true,
                    info: true,
                    type: 'numeric',
                  }}

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
                  onDataStateChange={handleGridDataStateChange}
                >
                  {endUserPermission.canDelete && (
                    <GridColumn
                      title=""
                      sortable={false}
                      filterable={false}
                      width="70px"
                      cells={{
                        data: (props) => (
                          <CheckboxCell
                            {...props}
                            selectedUserIds={ids}
                            handleChange={handleChange}
                          />
                        ),
                      }}
                    />
                  )}

                  <GridColumn
                    title="Action"
                    sortable={false}
                    filterable={false}
                    width="180px"
                    cells={{
                      data: (props) => (
                        <ActionCell
                          {...props}

                          endUserPermission={endUserPermission}
                          handleDelete={handleDelete}
                        />
                      ),
                    }}
                  />

                  <GridColumn
                    field="firstName"
                    title="First Name"
                    filter="text"
                    columnMenu={ColumnMenu}
                  />

                  <GridColumn
                    field="lastName"
                    title="Last Name"
                    filter="text"
                    columnMenu={ColumnMenu}
                  />

                  <GridColumn
                    field="userName"
                    title="Username"
                    filter="text"
                    columnMenu={ColumnMenu}
                  />

                  <GridColumn
                    field="contactNumber"
                    title="Phone"
                    filter="text"
                    columnMenu={ColumnMenu}
                    cells={{ data: ContactCell }}
                  />

                  <GridColumn
                    field="email"
                    title="Email"
                    filter="text"
                    columnMenu={ColumnMenu}
                  />

                  <GridColumn
                    field="isActive"
                    title="Status"
                    width="120px"
                    sortable={true}
                    filter="boolean"
                    columnMenu={ColumnMenu}
                    cells={{
                      data: (props) => (
                        <StatusCell
                          {...props}

                          endUserPermission={endUserPermission}
                        />
                      ),
                    }}
                  />
                </Grid>
              </ExcelExport>
            </div>
          </div>
        </div>
      </div>


      {showDeleteDialog && (
        <AleartDialog
          title="Confirm Delete"
          message="Are you sure you want to delete this User? This action cannot be undone."
          onCancel={() => {
            setShowDeleteDialog(false);
          }}
          onConfirm={async () => {
            const res = await apiRequest(
              'DELETE',
              API_ROUTES.endUser.endUserDelete,
              { userIds: ids },
              null,
              {
                showLoader: true,
                showToaster: true,
              }
            );
            if (res.status) {
              getManageEndUser();
              setids([]);
            }
            setShowDeleteDialog(false);
          }}
        />
      )}
      {statusConfirmDialog}

      {verifyData && (
        <AleartDialog
          title="Confirm Verification Change"
          message={`Are you sure you want to ${verifyData.checked ? 'verify' : 'unverify'} this End User?`}
          onCancel={() => setVerifyData(null)}
          onConfirm={confirmVerifyStatus}
        />
      )}

    </div>
  );
}

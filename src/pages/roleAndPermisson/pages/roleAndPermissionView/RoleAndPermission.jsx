/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../../../services/Api';
import { API_ROUTES } from '../../../../routes/api.routes';
import RoleRow from '../../components/RoleRow';
import AleartDialog from '../../../../components/common/AleartDialog';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { useStatusChange } from '../../../../hooks/useStatusChange';
import SerachFilter from '../../../../components/common/SerachFilter';
import { usePermission } from '../../../../hooks/UsePermission';
import { MENU } from '../../../../data/Menu';
import { filterIcon } from '@progress/kendo-svg-icons';
import {
  ColumnMenu,
  ColumnMenuCheckboxFilter,
} from '../../../../components/grid/ColumnMenu';
import { getBackendFilters } from '../../../../components/grid/GridFilter';
import useUserPermission from '../../../../utils/UserPermission';
const RoleActionCell = (props) => {
  const item = props.dataItem;

  return (
    <td {...props.tdProps}>
      <div className="d-flex gap-2 align-items-center">
        {props.rolePermission.canUpdate && (
          <Link
            to={`/admin/role-and-permission/edit/${item.id}`}
            className="small-square-btn edit-btn"
          >
            <i className="demo-icon icon-edit-1" />
          </Link>
        )}
        {props.rolePermission.canDelete && (
          <button
            type="button"
            className="small-square-btn danger-btn border-0"
            onClick={() => props.onDelete(item.id)}
          >
            <i className="demo-icon icon-delete-1" />
          </button>
        )}
      </div>
    </td>
  );
};
const RoleStatusCell = (props) => {
  const item = props.dataItem;

  return (
    <td {...props.tdProps}>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          disabled={!props.rolePermission.canUpdate}
          checked={item.isActive}
          onChange={(e) =>
            props.handleStatusChange(
              props.dataItem.id,
              e.target.checked,
              'role',
              'roleStatusEdit'
            )
          }
        />
        <label className="form-check-label"></label>
      </div>
    </td>
  );
};
export default function RoleAndPermission() {
  const [roleData, setroleData] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const [customSearch, setcustomSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 10,
    filter: null,
  });
  const [kendoSort, setKendoSort] = useState([]);
  const [sort, setsort] = useState([]);
  const [filters, setFilters] = useState(null);
  const sortPayload = useMemo(
    () =>
      (kendoSort || []).map((item) => ({
        field: item.field,
        direction: item.dir === 'asc' ? 0 : 1,
      })),
    [kendoSort]
  );
  // const permission = usePermission()
  // const rolePermission = permission.find((value, index) => value.menuId === MENU.ROLE)
  // console.log(rolePermission);

  const { rolePermission } = useUserPermission();

  const getRole = async () => {
    const page = Math.floor(dataState.skip / dataState.take) + 1;
    const payload = {
      Page: page,
      PageSize: dataState.take,
      customSearch,
      Sorts: sortPayload,
      Filters: filters,
    };
    const res = await apiRequest(
      'POST',
      API_ROUTES.role.roleList,
      payload,
      null,
      {
        showLoader: true,
      }
    );
    setroleData(res.data.data);
    setTotal(res.data.totalRecord || 0);
  };
  const { handleStatusChange: handleRoleStatusChange, statusConfirmDialog } = useStatusChange(getRole);
  const handleRoleDelete = (id) => {
    setSelectedRoleId(id);
    setShowDeleteDialog(true);
  };
  const handleToggle = async (id, checked) => {
    console.log(id, checked);
    const checkedValue = Boolean(checked);
    const payload = {
      isActive: checkedValue,
    };
    console.log(typeof checked);

    const confirmed = await window.customConfirm('Are You Want To Update Status ?');
    if (confirmed) {
      const res = await apiRequest(
        'PUT',
        API_ROUTES.role.roleStatusEdit(id),
        payload,
        null,
        {
          showToaster: true,
          showLoader: true,
        }
      );
      console.log(res);

      if (res.status) {
        getRole();
      }
    }
  };
  // fetch on mount and when paging, sorting or search changes
  useEffect(() => {
    getRole();
  }, [customSearch, dataState.skip, dataState.take, sortPayload, filters]);

  const [searchText, setSearchText] = useState('');

  return (
    <div className="container-fluid">
      <div className="col mb-3">
        <h2 className="page-title">Role & Permission</h2>
      </div>
      <div className="tabbar-section">
        <div className="row align-items-center gap-3">
          <div className="col-12 col-lg-auto">
            <SerachFilter
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSubmit={(value) => setcustomSearch(value)}
            />
          </div>
          {rolePermission.canCreate && (
            <div className="col-12 col-lg">
              <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">
                <Link
                  to="/admin/role-and-permission/add"
                  className="btn main-btn border-btn blue-btn"
                  style={{
                    background:
                      'linear-gradient(90deg, rgb(193, 39, 45) 0%, rgb(0 0 0 / 92%) 100%)',
                    color: 'white',
                  }}
                >
                  Add
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-12 mt-3 mt-xxl-4">
            <div className="">
              <Grid
                className="table-wrapper"
                data={roleData}
                total={total}

                skip={dataState.skip}
                take={dataState.take}

                sortable={{ allowUnsort: true, mode: 'single' }}

                sort={kendoSort}

                autoProcessData={true}
                filter={dataState.filter}
                filterOperators={{
                  text: [
                    {
                      text: 'grid.filterContainsOperator',
                      operator: 'contains',
                    },
                  ],
                  boolean: [{ text: 'grid.filterEqOperator', operator: 'eq' }],
                }}
                columnMenuIcon={filterIcon}
                pageable={{
                  responsive: false,
                  buttonCount: 5,
                  pageSizes: [10, 1, 20, 50],
                  previousNext: true,
                  info: true,
                  type: 'numeric',
                }}
                {...dataState}
                onDataStateChange={(e) => {
                  setDataState(e.dataState);
                  const nextSort = e.dataState.sort || [];
                  setKendoSort((prevSort) => {
                    if (
                      prevSort.length === nextSort.length &&
                      prevSort.every(
                        (item, index) =>
                          item.field === nextSort[index]?.field &&
                          item.dir === nextSort[index]?.dir
                      )
                    ) {
                      return prevSort;
                    }
                    return nextSort;
                  });
                  if (nextSort.length > 0) {
                    setsort((prevSort) => {
                      const nextPayload = [
                        {
                          field: nextSort[0].field,
                          direction: nextSort[0].dir === 'asc' ? 0 : 1,
                        },
                      ];
                      if (
                        prevSort.length === 1 &&
                        prevSort[0]?.field === nextPayload[0].field &&
                        prevSort[0]?.direction === nextPayload[0].direction
                      ) {
                        return prevSort;
                      }
                      return nextPayload;
                    });
                  } else {
                    setsort((prevSort) =>
                      prevSort.length === 0 ? prevSort : []
                    );
                  }

                  const nextFilter = e.dataState.filter;

                  if (nextFilter) {
                    setFilters(getBackendFilters(nextFilter));
                  } else {
                    setFilters(null);
                  }
                }}
              >
                {(rolePermission?.canDelete || rolePermission?.canUpdate) && (
                  <GridColumn
                    title="Action"
                    width="120px"
                    sortable={false}
                    filterable={false}
                    cells={{
                      data: (props) => (
                        <RoleActionCell
                          {...props}
                          onDelete={handleRoleDelete}
                          rolePermission={rolePermission}
                        />
                      ),
                    }}
                  />
                )}

                <GridColumn
                  columnMenu={ColumnMenu}
                  field="role"
                  title="Role Name"
                  width={'320px'}
                  filter="text"
                />

                <GridColumn
                  columnMenu={ColumnMenu}
                  field="description"
                  title="Description"
                  width="500px"
                />

                <GridColumn
                  field="noOfUser"
                  title="No. of Users"
                  width="190px"
                />

                <GridColumn
                  columnMenu={ColumnMenu}
                  field="isActive"
                  title="Status"
                  width="107px"
                  filter="boolean"
                  cells={{
                    data: (props) => (
                      <RoleStatusCell
                        {...props}
                        getRole={getRole}
                        rolePermission={rolePermission}
                        handleStatusChange={handleRoleStatusChange}
                      />
                    ),
                  }}
                />
              </Grid>
              {/* <table className="table">
                                <thead className="table-dark">
                                    <tr>

                                        <th style={{ width: "100px" }}>Action</th>
                                        <th>Role Name</th>
                                        <th style={{ width: "500px" }}>Description</th>
                                        <th>No. of Users</th>
                                        <th>Status</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        roleData.map((value, index) => <RoleRow key={value.id}
                                            value={value}
                                            onDelete={handleRoleDelete}
                                            onToggle={handleToggle}
                                        />)
                                    }


                                </tbody>
                            </table> */}
            </div>
          </div>
        </div>
      </div>
      {showDeleteDialog && (
        <AleartDialog
          title="Confirm Delete"
          message="Are you sure you want to delete this Role? This action cannot be undone."
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedRoleId(null);
          }}
          onConfirm={async () => {
            const res = await apiRequest(
              'DELETE',
              API_ROUTES.role.roleDelete(selectedRoleId),
              null,
              null,
              {
                showLoader: true,
                showToaster: true,
              }
            );
            if (res.status) {
              getRole();
            }
            setShowDeleteDialog(false);
            setSelectedRoleId(null);
          }}
        />
      )}
      {statusConfirmDialog}
    </div>
  );
}

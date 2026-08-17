import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { filterIcon } from '@progress/kendo-svg-icons';
import { ColumnMenu } from '../../../components/grid/ColumnMenu';
import { getBackendFilters } from '../../../components/grid/GridFilter';
import { DateCell } from '../../activity/Activity';
import { handleStatusChange } from '../../../utils/ChangeStatus';
import { handleDelete } from '../../../utils/DeleteRecords';
import BreadCumb from '../../../components/common/breadCumb/BreadCumb';
import SerachFilter from '../../../components/common/SerachFilter';
import useGridPagination from '../../../hooks/useGridPagination';
import CategoryModel from './CategoryModel';
import ManufacturerAdd from '../manufacturer/ManufacturerAdd';
import { usePermission } from '../../../hooks/UsePermission';
import { MENU } from '../../../data/Menu';
import useUserPermission from '../../../utils/UserPermission';
import { Tooltip } from '@progress/kendo-react-tooltip';
const ActionCell = (props) => {
  const item = props.dataItem;
  return (
    <td {...props.tdProps}>
      <span className="d-flex gap-2 align-items-center">
        {props.gunCategoryMasterPermission.canUpdate && (
          <button className="small-square-btn edit-btn">
            <i className="demo-icon icon-edit-1" />
          </button>
        )}
        {props.gunCategoryMasterPermission.canDelete && (
          <button
            onClick={() =>
              handleDelete(
                item.categoryId,
                'category',
                'categoryMasterDelete',
                props.getCategoryMaster
              )
            }
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
          disabled={!props.gunCategoryMasterPermission.canUpdate}
          className="form-check-input"
          type="checkbox"
          checked={props.dataItem.isActive}
          readOnly
          onChange={(e) =>
            handleStatusChange(
              props.dataItem.categoryId,
              e.target.checked,
              'category',
              'categoryMasterUpdate',
              props.getCategoryMaster
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

export default function CategoryMaster() {
  const [categoryMasterData, setcategoryMasterData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [customSearch, setcustomSearch] = useState('');
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
  const [isCategoryOpen, setisCategoryOpen] = useState(false);

  const { gunCategoryMasterPermission } = useUserPermission();
  const getCategoryMaster = async () => {
    const res = await apiRequest(
      'POST',
      API_ROUTES.category.getCategoryMaster,
      { page, pageSize, customSearch, Sorts: sort, Filters: filters },
      null,
      {
        showLoader: true,
      }
    );
    setcategoryMasterData(res.data.data);
  };
  const categoryMasterColumns = [
    ...(gunCategoryMasterPermission?.canUpdate ||
    gunCategoryMasterPermission?.canDelete
      ? [{ field: 'action', title: 'Action', cell: ActionCell, width: '100px' }]
      : []),
    {
      field: 'applicableForName',
      title: 'Applicable For',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'categoryName',
      title: 'Category Name',
      width: '180px',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'description',
      title: 'Description',
      width: '180px',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'parentCategoryName',
      title: 'Parent Category Name',
      width: '180px',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'createdByUserName',
      title: 'Created By',
      filter: 'text',
      columnMenu: ColumnMenu,
    },
    {
      field: 'createdOn',
      title: 'Creadted On',
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
      field: 'isActive',
      title: 'Status',
      cell: StatusCell,
      width: '70px',
      filter: 'boolean',
      columnMenu: ColumnMenu,
    },
  ];
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
    getCategoryMaster();
  }, [page, pageSize, customSearch, sort, filters]);
  return (
    <>
      <div className="container-fluid">
        <div className="mb-3 activity-breadcrumb">
          <span style={{ color: '#666766' }} className="fw-bold">
            Masters
          </span>
          <span className="mx-2 text-dark">/</span>
          <span className="fw-bold text-dark">Category Master</span>
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
            {gunCategoryMasterPermission?.canCreate && (
              <div className="col-12 col-lg">
                <div className="btn-list d-flex justify-content-lg-end flex-wrap gap-2 gap-md-3 text-end">
                  <button
                    onClick={() => setisCategoryOpen(true)}
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
                  data={categoryMasterData}
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
                    pageSizes: [10, 20, 50],
                    previousNext: true,
                    info: true,
                    type: 'numeric',
                  }}
                  onDataStateChange={handleGridDataStateChange}
                >
                  {categoryMasterColumns?.map((col, ind) => {
                    return (
                      <GridColumn
                        key={col.field}
                        field={col.field}
                        title={col.title}
                        width={col.width || '150px'}
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
                                    {...props}
                                    gunCategoryMasterPermission={
                                      gunCategoryMasterPermission
                                    }
                                    getCategoryMaster={getCategoryMaster}
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

      {isCategoryOpen && (
        <CategoryModel
          getCategoryMaster={getCategoryMaster}
          isCategoryOpen={isCategoryOpen}
          setisCategoryOpen={setisCategoryOpen}
        />
      )}
    </>
  );
}

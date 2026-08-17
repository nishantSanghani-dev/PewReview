import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { filterIcon } from '@progress/kendo-svg-icons';
import { ColumnMenu } from '../../components/grid/ColumnMenu';
import { getBackendFilters } from '../../components/grid/GridFilter';
import BreadCumb from '../../components/common/breadCumb/BreadCumb';
import SerachFilter from '../../components/common/SerachFilter';
import useGridPagination from '../../hooks/useGridPagination';
import { Tooltip } from '@progress/kendo-react-tooltip';
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
export default function ReportedUser() {
  const [reportUserData, setreportUserData] = useState([]);
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
  const getReportedUser = async () => {
    const res = await apiRequest(
      'POST',
      API_ROUTES.report.getReport,
      { page, pageSize, customSearch, Sorts: sort, Filters: filters },
      null,
      {
        showLoader: true,
      }
    );
    setreportUserData(res.data);
  };

  const reportedUserColumn = [
    { field: 'userName', title: 'UserName' },
    { field: 'email', title: 'Email/Phone Number' },
    { field: 'reportedBy', title: 'Reported By' },
    { field: 'Status', title: 'Status' },
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
    getReportedUser();
  }, [page, pageSize, customSearch, sort]);

  return (
    <div className="container-fluid">
      <BreadCumb items={[{ label: 'Reported User' }]} />
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
        </div>
        <div className="row">
          <div className="col-12 mt-3 mt-xxl-4">
            <div className="">
              <Grid
                className="table-wrapper"
                data={reportUserData}
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
                {reportedUserColumn?.map((col, ind) => {
                  return (
                    <GridColumn
                      key={col.field}
                      field={col.field}
                      title={col.title}
                      width={col.width || '150px'}
                      filter={col.filter}
                      columnMenu={col.columnMenu}
                      sortable={false}
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
  );
}

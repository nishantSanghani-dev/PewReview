import React, { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import {
  ActionCell,
  AddressCell,
  DateTimeCell,
  EventNameCell,
  HostNameCell,
} from '../endUsers/manage-end-user/Events';
import SerachFilter from '../../components/common/SerachFilter';
import useGridPagination from '../../hooks/useGridPagination';
import { usePermission } from '../../hooks/UsePermission';
import { MENU } from '../../data/Menu';
import { useSearchParams } from 'react-router-dom';
import useUserPermission from '../../utils/UserPermission';
import AleartDialog from '../../components/common/AleartDialog';
import { handleDelete } from '../../utils/DeleteRecords';

const getParamsForTab = (tab) => {
  switch (tab) {
    case 'upcomingEvents':
      return { isUpcomingEvents: true, isAdminRequest: null };
    case 'passedEvents':
      return { isUpcomingEvents: false, isAdminRequest: null };
    case 'adminEvents':
      return { isUpcomingEvents: null, isAdminRequest: true };
    default:
      return { isUpcomingEvents: true, isAdminRequest: null };
  }
};

export default function Event() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('tab'));

  const queryTab = searchParams.get('tab');
  const eventTabs = ['upcomingEvents', 'passedEvents', 'adminEvents'].includes(
    queryTab
  )
    ? queryTab
    : 'upcomingEvents';
  const params = useMemo(() => getParamsForTab(eventTabs), [eventTabs]);
  const [eventsData, seteventsData] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
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
  // const permission = usePermission()
  // const eventPermission = permission.find((value, index) => value.menuId === MENU.EVENT)
  // console.log(eventPermission);
  const { eventPermission } = useUserPermission();
  const getEevent = async () => {
    const res = await apiRequest(
      'POST',
      API_ROUTES.events.getAllEvent,
      { page, pageSize, customSearch, Sorts: sort, Filters: filters },
      params,
      {
        showLoader: true,
      }
    );
    seteventsData(res.data.data);
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
    getEevent();
  }, [eventTabs, params, page, pageSize, customSearch, sort]);
  return (
    <div className="container-fluid">
      <div className="col mb-3">
        <h2 className="page-title">Events</h2>
      </div>
      <div className="tabbar-section mb-3">
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
      </div>
      <div className="tabbar-section">
        <div className="row">
          <div className="col-12">
            {/* Tab Nav (desktop only) */}
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setSearchParams({ tab: 'upcomingEvents' })}
                  className={`nav-link   ${eventTabs === 'upcomingEvents' ? 'active' : ''}`}
                  id="nav-one-tab"
                  type="button"
                  role="tab"
                  aria-controls="nav-one-tab-pane"
                  aria-selected={eventTabs === 'upcomingEvents'}
                >
                  Upcoming Events
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  onClick={() => setSearchParams({ tab: 'passedEvents' })}
                  className={`nav-link  ${eventTabs === 'passedEvents' ? 'active' : ''}`}
                  id="nav-two-tab"
                  type="button"
                  role="tab"
                  aria-controls="nav-two-tab-pane"
                  aria-selected={eventTabs === 'passedEvents'}
                >
                  Passed Events
                </button>
              </li>
              <li className={`nav-item `} role="presentation">
                <button
                  onClick={() => setSearchParams({ tab: 'adminEvents' })}
                  className={`nav-link  ${eventTabs === 'adminEvents' ? 'active' : ''}`}
                  id="nav-three-tab"
                  type="button"
                  role="tab"
                  aria-controls="nav-three-tab-pane"
                  aria-selected={eventTabs === 'adminEvents'}
                >
                  Admin-added venues' Events requests
                </button>
              </li>
            </ul>
            {/* Shared Content: Tab + Accordion */}
            <div className="tab-content accordion" id="myTabContent">
              <div
                className="tab-pane fade show active accordion-item"
                id="nav-one-tab-pane"
                role="tabpanel"
                aria-labelledby="nav-one-tab"
                tabIndex={0}
              >
                <h2 className="accordion-header d-lg-none" id="headingOne">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Upcoming Events
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show d-lg-block"
                  aria-labelledby="headingOne"
                  data-bs-parent="#myTabContent"
                >
                  <div className="accordion-body mt-3 mt-xxl-4">
                    <div className="row">
                      <div className="col-12">
                        <div className="table-responsive">
                          <Grid
                            className="table-wrapper fw-bold text-center"
                            data={eventsData}
                            skip={dataState.skip}
                            take={dataState.take}
                            sortable={{ allowUnsort: true, mode: 'single' }}
                            sort={kendoSort}
                            pageable={{
                              responsive: false,
                              buttonCount: 5,
                              pageSizes: [10, 20, 50],
                              info: true,
                              previousNext: true,
                              type: 'numeric',
                            }}
                            onDataStateChange={handleGridDataStateChange}
                          >
                            <GridColumn
                              title="Action"
                              width="120px"
                              cells={{
                                data: (props) => (
                                  <ActionCell
                                    {...props}
                                    eventPermission={eventPermission}
                                    setShowDeleteDialog={setShowDeleteDialog}
                                    setSelectedEventId={setSelectedEventId}
                                  />
                                ),
                              }}
                            />

                            <GridColumn
                              title="Host Name"
                              width="200px"
                              cells={{ data: HostNameCell }}
                            />

                            <GridColumn
                              title="Event Name"
                              width="200px"
                              cells={{ data: EventNameCell }}
                            />

                            <GridColumn
                              title="Date & Time"
                              width="200px"
                              cells={{ data: DateTimeCell }}
                            />

                            <GridColumn
                              title="Address"
                              width="250px"
                              cells={{ data: AddressCell }}
                            />
                            <GridColumn
                              field="userName"
                              title="Created By"
                              width="150px"
                            />
                            <GridColumn
                              field="approvalStatusName"
                              title="status"
                              width="150px"
                            />
                          </Grid>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDeleteDialog && (
          <AleartDialog
            title="Confirm Delete"
            message="Are you sure you want to delete this Event? This action cannot be undone."
            onCancel={() => {
              setShowDeleteDialog(false);
              setSelectedEventId(null);
            }}
            onConfirm={async () => {
              await handleDelete(selectedEventId, 'events', 'eventDelete', getEevent);
              setShowDeleteDialog(false);
              setSelectedEventId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

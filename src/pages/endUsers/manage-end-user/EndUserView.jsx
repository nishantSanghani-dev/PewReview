import React, { useEffect, useState } from 'react';
import BreadCumb from '../../../components/common/breadCumb/BreadCumb';
import { apiRequest } from '../../../services/Api';
import { useParams, useSearchParams } from 'react-router-dom';
import { API_ROUTES } from '../../../routes/api.routes';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import UploadGun from './UploadGun';
import Venues from './venues/Venues';
import Event from '../../events/Event';
import Events from './Events';
import { toast } from 'react-toastify';
import ActivitiesEndUser from './ActivitiesEndUser';
import { usePermission } from '../../../hooks/UsePermission';
import { MENU } from '../../../data/Menu';
import useUserPermission from '../../../utils/UserPermission';

export default function EndUserView() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [manageUserSingleData, setmanageUserSingleData] = useState(null);
  const [activitiesFilter, setactivitiesFilter] = useState([
    {
      Field: 'userId',
      OperatorType: 2,
      value: id,
    },
  ]);

  const {
    activityPermission,
    eventPermission,
    venuePermission,
    gunMasterPermission,
    endUserPermission,
  } = useUserPermission();

  const defaultTab = React.useMemo(() => {
    if (gunMasterPermission?.canRead) return 'uploadGun';
    if (venuePermission?.canRead) return 'venues';
    if (eventPermission?.canRead) return 'events';
    if (activityPermission?.canRead) return 'activities';
    return '';
  }, [
    gunMasterPermission?.canRead,
    venuePermission?.canRead,
    eventPermission?.canRead,
    activityPermission?.canRead,
  ]);

  const allowedTabs = React.useMemo(() => {
    const tabs = [];
    if (gunMasterPermission?.canRead) tabs.push('uploadGun');
    if (venuePermission?.canRead) tabs.push('venues');
    if (eventPermission?.canRead) tabs.push('events');
    if (activityPermission?.canRead) tabs.push('activities');
    return tabs;
  }, [
    gunMasterPermission?.canRead,
    venuePermission?.canRead,
    eventPermission?.canRead,
    activityPermission?.canRead,
  ]);

  const queryTab = searchParams.get('tab');
  const queryUpcoming = searchParams.get('upcoming');

  const activeTab = React.useMemo(
    () => (allowedTabs.includes(queryTab) ? queryTab : defaultTab),
    [allowedTabs, defaultTab, queryTab]
  );

  const isUpcomingEvent =
    queryUpcoming === 'false' ? false : queryUpcoming === 'null' ? null : true;

  const setTab = (tab) => {
    const upcoming = String(isUpcomingEvent);
    if (queryTab === tab && queryUpcoming === upcoming) return;
    setSearchParams({ tab, upcoming });
  };

  const updateUpcomingEvent = (value) => {
    const upcoming = String(value);
    if (queryTab === activeTab && queryUpcoming === upcoming) return;
    setSearchParams({ tab: activeTab, upcoming });
  };

  useEffect(() => {
    if (!defaultTab) return;
    const upcoming = String(isUpcomingEvent);
    if (
      !queryTab ||
      !allowedTabs.includes(queryTab) ||
      queryUpcoming !== upcoming
    ) {
      setSearchParams({ tab: defaultTab, upcoming });
    }
  }, [
    defaultTab,
    queryTab,
    allowedTabs,
    queryUpcoming,
    isUpcomingEvent,
    setSearchParams,
  ]);

  const manageEndUserSingleView = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.endUser.endUserSingleView(id),
      null,
      null,
      {
        showLoader: true,
      }
    );
    console.log(res.data);
    setmanageUserSingleData(res.data);
  };

  const uploadGunView = async () => {
    const res = await apiRequest('POST', API_ROUTES.gun.gunListByUser, {
      page: 1,
      pageSize: 10,
      userId: id,
    });
    console.log(res);
    setData(res.data.data);
  };
  const getVenue = async () => {
    const res = await apiRequest(
      'POST',
      API_ROUTES.venue.getVenueListByUser,
      { page: 1, pageSize: 10, userId: id, isMyVenue: true },
      null,
      {
        showLoader: true,
      }
    );
    if (res && res.data) {
      setData(res.data.data || res.data || []);
    }
  };

  const getEvents = async () => {
    const res = await apiRequest(
      'POST',
      API_ROUTES.events.getEventList,
      { pageNumber: 1, pageSize: 10, userId: id, search: '', isUpcomingEvent },
      null,
      {
        showLoader: true,
      }
    );
    setData(res.data.data);
  };
  const getActivities = async () => {
    const res = await apiRequest(
      'POST',
      API_ROUTES.activities.getActivities,
      {
        page: 1,
        pageSize: 10,
        Filters: activitiesFilter,
      },
      null,
      {
        showLoader: true,
      }
    );
    setData(res.data.data);
  };
  useEffect(() => {
    manageEndUserSingleView();
    // uploadGunView()
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      switch (activeTab) {
        case 'uploadGun':
          await uploadGunView();
          break;

        case 'venues':
          await getVenue();
          break;

        case 'events':
          await getEvents();
          break;

        case 'activities':
          await getActivities();
          break;

        default:
          break;
      }
    };

    fetchData();
  }, [activeTab, id, isUpcomingEvent]);
  return (
    <>
      <div className="container-fluid">
        <div className="tabbar-section">
          <div className="row">
            <div className="col-12">
              <BreadCumb
                items={[
                  { label: 'End User', path: '/admin/manage-end-user' },
                  { label: 'View End Users' },
                ]}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 col-lg-4 mt-3 mt-xxl-4">
              <div className="border-contents">
                <div className="row align-items-end gap-1">
                  <div className="col">
                    <div className="user-image-edit small-profile">
                      <img
                        src={manageUserSingleData?.profileImageUrl}
                        className="img-fluid"
                      />
                    </div>
                    <p className="fw-semibold dark-color mt-2 mb-0 d-flex align-items-center gap-1 text-nowrap">
                      {manageUserSingleData?.fullName}{' '}
                      <i className="demo-icon icon-verified" />
                    </p>
                    <p className="fw-medium mb-0 text-nowrap">
                      {manageUserSingleData?.userName}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="fw-medium mb-0">Private Account</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <ul className="separater-list ps-0 d-flex flex-wrap mt-3">
                      <li>
                        <p className="dark-color fw-semibold large mb-0">
                          {manageUserSingleData?.postsCount}
                        </p>
                        <p className="mb-0">Post</p>
                      </li>
                      <li>
                        <p className="dark-color fw-semibold large mb-0">
                          {manageUserSingleData?.followersCount}
                        </p>
                        <p className="mb-0">Followers</p>
                      </li>
                      <li>
                        <p className="dark-color fw-semibold large mb-0">
                          {manageUserSingleData?.followingCount}
                        </p>
                        <p className="mb-0">Following</p>
                      </li>
                    </ul>
                    <p className="mt-3">
                      <span className="dark-color fw-semibold">
                        Home Ranges:
                      </span>{' '}
                      {manageUserSingleData?.userHomeRanges?.length == 0 && '-'}
                    </p>
                    <p className="mt-3">
                      <span className="dark-color fw-semibold">
                        Favorite Pew:
                      </span>{' '}
                      {manageUserSingleData?.favouritePew?.length == 0 && '-'}
                    </p>
                    <p className="mt-3">
                      <span className="dark-color fw-semibold">
                        About/Description:
                      </span>
                      <br /> I am very gun passionate person
                    </p>
                  </div>
                  <div className="col-12">
                    <ul className="d-flex justify-content-between align-items-center">
                      <li>
                        <p className="large dark-color fw-semibold">
                          Badges Earned
                        </p>
                      </li>
                      <li>
                        <p>
                          <a href="#" className="basic-links grey-links">
                            View All
                          </a>
                        </p>
                      </li>
                    </ul>
                    <ul className="d-flex flex-wrap gap-2 badge-small justify-content-between align-items-center">
                      <li>
                        <img
                          src="/assets/images/badge-1.svg"
                          className="img-fluid"
                          alt="badge-1"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-2.svg"
                          className="img-fluid"
                          alt="badge-2"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-1.svg"
                          className="img-fluid"
                          alt="badge-3"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-3.svg"
                          className="img-fluid"
                          alt="badge-4"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-1.svg"
                          className="img-fluid"
                          alt="badge-5"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-1.svg"
                          className="img-fluid"
                          alt="badge-6"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-4.svg"
                          className="img-fluid"
                          alt="badge-7"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-1.svg"
                          className="img-fluid"
                          alt="badge-8"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-2.svg"
                          className="img-fluid"
                          alt="badge-9"
                        />
                      </li>
                      <li>
                        <img
                          src="/assets/images/badge-1.svg"
                          className="img-fluid"
                          alt="badge-10"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8 mt-3 mt-xxl-4">
              <form action="#">
                <fieldset className="row">
                  <div className="col-12">
                    <h3 className="fw-bold">User Details</h3>
                    <hr className="mb-2" />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <div className="form-group">
                      <label htmlFor="first-name" className="fw-semibold">
                        First Name <span className="danger-color">*</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        name="first-name"
                        className="form-control text-capitalize"
                        defaultValue={manageUserSingleData?.firstName}
                        required=""
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <div className="form-group">
                      <label htmlFor="last-name" className="fw-semibold">
                        Last Name <span className="danger-color">*</span>
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        readOnly
                        className="form-control text-capitalize"
                        defaultValue={manageUserSingleData?.lastName}
                        required=""
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <div className="form-group">
                      <label htmlFor="birthday" className="fw-semibold">
                        Birthday
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="birthday"
                        readOnly
                        className="form-control text-capitalize"
                        defaultValue={manageUserSingleData?.birthDate}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <div className="form-group">
                      <label htmlFor="gender" className="fw-semibold">
                        Gender
                      </label>
                      <select
                        readOnly
                        defaultValue={manageUserSingleData?.gender}
                        className="form-select"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <div className="form-group">
                      <label htmlFor="email" className="fw-semibold">
                        Email <span className="danger-color">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        readOnly
                        className="form-control text-capitalize"
                        defaultValue={manageUserSingleData?.email}
                        id="email"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <div className="form-group">
                      <label htmlFor="contact-no" className="fw-semibold">
                        Contact Number <span className="danger-color">*</span>
                      </label>
                      <input
                        type="text"
                        name="contact-no"
                        readOnly
                        className="form-control text-capitalize"
                        defaultValue={
                          manageUserSingleData?.contectNumber
                            ? manageUserSingleData?.contectNumber
                            : '-'
                        }
                        id="contactNo"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <div className="form-group">
                      <label htmlFor="documents" className="fw-semibold">
                        Uploaded Documents
                      </label>
                    </div>
                    {manageUserSingleData?.userDocument?.length !== 0 &&
                      manageUserSingleData?.userDocument?.map(
                        (value, index) => {
                          return (
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={`Document ${index + 1}`}
                                readOnly
                              />
                            </div>
                          );
                        }
                      )}
                  </div>
                </fieldset>
                <div className="col-sm-6 mt-3">
                  <div className="form-group">
                    <label htmlFor="contact-no" className="fw-semibold">
                      Settings <span className="danger-color">*</span>
                    </label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        disabled
                      />
                      &nbsp;&nbsp;&nbsp;
                      <label htmlFor="">Follower request confirmation</label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="tabbar-section mt-4 mt-xxl-5">
            <div className="row">
              <div className="col-12">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  {gunMasterPermission?.canRead && (
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setTab('uploadGun')}
                        className={`nav-link ${activeTab === 'uploadGun' ? 'active' : ''}`}
                        id="nav-one-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-one-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="nav-one-tab-pane"
                        aria-selected={activeTab === 'uploadGun'}
                      >
                        Upload Gun
                      </button>
                    </li>
                  )}
                  {venuePermission?.canRead && (
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setTab('venues')}
                        className={`nav-link ${activeTab === 'venues' ? 'active' : ''}`}
                        id="nav-two-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-two-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="nav-two-tab-pane"
                        aria-selected={activeTab === 'venues'}
                      >
                        Venues
                      </button>
                    </li>
                  )}
                  {eventPermission?.canRead && (
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setTab('events')}
                        className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                        id="nav-three-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-three-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="nav-three-tab-pane"
                        aria-selected={activeTab === 'events'}
                      >
                        Events
                      </button>
                    </li>
                  )}
                  {activityPermission?.canRead && (
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setTab('activities')}
                        className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`}
                        id="nav-four-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-four-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="nav-four-tab-pane"
                        aria-selected={activeTab === 'activities'}
                      >
                        Activities
                      </button>
                    </li>
                  )}
                </ul>
                {/* Shared Content: Tab + Accordion */}
                <div className="tab-content accordion" id="myTabContent">
                  <div
                    className={`tab-pane fade accordion-item ${activeTab === 'uploadGun' ? 'show active' : ''}`}
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
                        Upload Gun
                      </button>
                    </h2>
                    {activeTab === 'uploadGun' &&
                      gunMasterPermission?.canRead && <UploadGun data={data} />}
                  </div>

                  <div
                    className={`tab-pane fade accordion-item ${activeTab === 'venues' ? 'show active' : ''}`}
                    id="nav-two-tab-pane"
                    role="tabpanel"
                    aria-labelledby="nav-two-tab"
                    tabIndex={0}
                  >
                    <h2 className="accordion-header d-lg-none" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Venues
                      </button>
                    </h2>
                    {activeTab === 'venues' && eventPermission?.canRead && (
                      <Venues data={data} />
                    )}
                  </div>

                  {activeTab === 'events' && eventPermission?.canRead && (
                    <Events
                      isUpcomingEvent={isUpcomingEvent}
                      setisUpcomingEvent={updateUpcomingEvent}
                      data={data}
                    />
                  )}
                  {activeTab === 'activities' && (
                    <ActivitiesEndUser data={data} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

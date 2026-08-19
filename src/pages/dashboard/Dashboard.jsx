import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';
import TopLikedPost from './TopLikedPost';
import TotalReportedPost from './TotalReportedPost';
import { Link } from 'react-router-dom';
import AleartDialog from '../../components/common/AleartDialog';
import { usePermission } from '../../hooks/UsePermission';
import { MENU } from '../../data/Menu';
import useUserPermission from '../../utils/UserPermission';

export default function Dashboard() {
  const [dashboardData, setdashboardData] = useState(null);
  const [dashboardFilterData, setdashboardFilterData] = useState([]);
  const [customDate, setcustomDate] = useState(false);
  const [filter, setfilter] = useState(0);
  const [dateFilter, setdateFilter] = useState(['', '']);
  const [topLikedPost, settopLikedPost] = useState([]);
  const [topReportingUsers, settopReportingUsers] = useState([]);
  const [topReportedPosts, settopReportedPosts] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  const { dashboardPermission, activityPermission, reportPermission } =
    useUserPermission();

  const formatDate = (value) => {
    if (!value) return '';

    const [year, month, day] = value.split('-');

    return `${month}/${day}/${year}`;
  };
  const getDashBoardData = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.dashboard,
      null,
      { filter, customFrom: dateFilter[0].toString(), customTo: dateFilter[1] },
      {
        showLoader: true,
      }
    );
    console.log(res.data);
    setdashboardData(res.data);
    settopLikedPost(res.data.topLikedPosts);
    settopReportingUsers(res.data.topReportingUsers);
    settopReportedPosts(res.data.topReportedPosts);
  };

  const getDashboardFilter = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.common.getDashboardFilter,
      null,
      null,
      {
        showLoader: true,
      }
    );
    setdashboardFilterData(res.data);
  };
  useEffect(() => {
    getDashBoardData();
  }, [filter, dateFilter]);

  useEffect(() => {
    getDashboardFilter();
  }, []);

  useEffect(() => {
    console.log(dateFilter[0].toString());
  }, [dateFilter]);

  return (
    <>
      <div className="container-fluid">
        <div className="col mb-3">
          <h3 className="">Dashboard</h3>
        </div>
        <div className="page-heading">
          <div className="row align-items-center gap-3 mb-3 mb-xxl-4">
            <div className="col-12 col-md">
              <h2 className="page-title">Welcome to Dashboard, John!</h2>
            </div>
            {/* <div className="col-12 col-sm-6 col-md-5 col-lg-3">
              <select
                onChange={(e) => {
                  setfilter(e.target.value);
                  setcustomDate(e.target.value === '9');
                }}
                style={{ cursor: 'pointer' }}
                className="form-select w-100"
              >
                {dashboardFilterData.map((value, index) => (
                  <option key={index} value={value?.id}>
                    {value?.description}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
        </div>

        {customDate && (
          <div className="row align-items-center mb-5">
            <div className="col-auto">
              <h5 className="mb-0">Select Date Range:</h5>
            </div>

            <div className="col-auto d-flex align-items-center">
              <label className="me-2 text-muted">From Date:</label>

              {/* <input
                            type="date"
                            className="form-control custom-date"
                            onChange={(e) => setdateFilter([e.target.value, dateFilter[1]])}
                        /> */}
              <input
                type="date"
                className="form-control custom-date"
                value={dateFilter[0]}
                defaultValue={today}
                onChange={(e) => {
                  setdateFilter([formatDate(e.target.value), dateFilter[1]]);
                }}
              />
            </div>

            <div className="col-auto d-flex align-items-center">
              <label className="me-2 text-muted">To Date:</label>

              <input
                type="date"
                className="form-control custom-date"

                onChange={(e) => {
                  setdateFilter([dateFilter[0], formatDate(e.target.value)]);
                }}
              />
            </div>
          </div>
        )}

        <div className="cards-section">
          <div className="row g-3 g-xxl-4">
            <div className="col-sm-6 col-xl-3">
              <div className="border-column card-icon position-relative">
                <div className="row align-items-center mb-1">
                  <div className="col position-relative z-1">
                    <h2 className="heading-large theme-color">
                      {dashboardData?.totals?.totalUsers}
                    </h2>
                  </div>
                  <div className="col-auto">
                    <div className="carf-info-icon">
                      <img src="/assets/images/icons/users.svg" alt="users" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h3 className="fw-medium">Total No of users</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="border-column card-icon position-relative">
                <div className="row align-items-center mb-1">
                  <div className="col position-relative z-1">
                    <h2 className="heading-large theme-color">
                      {dashboardData?.totals?.totalVenues}
                    </h2>
                  </div>
                  <div className="col-auto">
                    <div className="carf-info-icon">
                      <img
                        src="/assets/images/icons/location.svg"
                        alt="location"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h3 className="fw-medium">Total No. of Venues</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="border-column card-icon position-relative">
                <div className="row align-items-center mb-1">
                  <div className="col position-relative z-1">
                    <h2 className="heading-large theme-color">
                      {dashboardData?.totals.totalGuns}
                    </h2>
                  </div>
                  <div className="col-auto">
                    <div className="carf-info-icon">
                      <img src="/assets/images/icons/gun.svg" alt="gun" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h3 className="fw-medium">Total No. of Guns</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="border-column card-icon position-relative">
                <div className="row align-items-center mb-1">
                  <div className="col position-relative z-1">
                    <h2 className="heading-large theme-color">
                      {dashboardData?.totals?.totalAmmunitions}
                    </h2>
                  </div>
                  <div className="col-auto">
                    <div className="carf-info-icon">
                      <img
                        src="/assets/images/icons/bullets.svg"
                        alt="bullets"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h3 className="fw-medium">Total No of ammunitions</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-section">
          <div className="row">
            <div className="col-xl-6 mt-3 mt-xxl-4">
              <div className="row">
                <div className="col">
                  <h3 className="fw-bold theme-color">Most Liked Posts</h3>
                </div>
                <div className="col-auto">
                  {activityPermission?.canRead && (
                    <Link className="basic-links" to={'/admin/activity/view'}>
                      View All
                    </Link>
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="table-responsive">
                    <TopLikedPost
                      dashboardPermission={dashboardPermission}
                      topLikedPost={topLikedPost}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 mt-3 mt-xxl-4">
              <div className="row">
                <div className="col">
                  <h3 className="fw-bold theme-color">Most Reported Users</h3>
                </div>
                <div className="col-auto">
                  {reportPermission?.canRead && (
                    <Link className="basic-links" to={'/admin/reported-user'}>
                      View All
                    </Link>
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="table-dark">
                        <tr>
                          <th className="no-wrap-text">Action</th>
                          <th className="no-wrap-text">Name</th>
                          <th className="no-wrap-text">Total Reports</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.topReportingUsers?.length == 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No records available.
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td>
                              <select className="form-select">
                                <option>Active</option>
                                <option>inactive</option>
                              </select>
                            </td>
                            <td>Andrew Abbott</td>
                            <td>
                              <a
                                className="basic-links"
                                href="javascript:void(0);"
                                data-bs-toggle="modal"
                                data-bs-target="#total-reports"
                              >
                                05
                              </a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12 mt-3 mt-xxl-4">
              <div className="row">
                <div className="col">
                  <h3 className="fw-bold theme-color">Most Reported Posts</h3>
                </div>
                <div className="col-auto">
                  {activityPermission?.canRead && (
                    <Link className="basic-links" to={'/admin/activity/view'}>
                      View All
                    </Link>
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="">
                    <TotalReportedPost
                      dashboardPermission={dashboardPermission}
                      filter={filter}
                      topReportedPosts={topReportedPosts}
                    />
                    {/* <table className="table table-bordered mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="no-wrap-text">Action</th>
                                                <th className="no-wrap-text">Posted By</th>
                                                <th className="no-wrap-text">Total Reports</th>
                                                <th className="no-wrap-text">Uploaded Date</th>
                                                <th className="no-wrap-text">Likes</th>
                                                <th className="no-wrap-text">Comments</th>
                                                <th className="no-wrap-text">Shares</th>
                                            </tr>s
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan="7" className="text-center py-3">
                                                    No records available.
                                                </td>
                                            </tr>
                                      </tbody>
                                    </table> */}
                    {/* 
                                    <TotalReportedPost /> */}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-xl-6 mt-3 mt-xxl-4">
                        <div className="row">
                            <div className="col">
                                <h3 className="fw-bold theme-color">Most Liked Posts</h3>
                            </div>
                            <div className="col-auto">
                                <a className="basic-links" href="javascript:void(0);">
                                    View All
                                </a>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="table-dark">
                                            <tr>
                                                <th className="no-wrap-text">Action</th>
                                                <th className="no-wrap-text">Posted By</th>
                                                <th className="no-wrap-text">Total Reports</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>Andrew Abbott</td>
                                                <td>
                                                    <a href="#" className="basic-links">
                                                        1287
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>CJ Abrams</td>
                                                <td>
                                                    <a href="#" className="basic-links">
                                                        890
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-2 align-items-center">
                                                        <a
                                                            className="basic-links me-1"
                                                            href="javascript:void(0);"
                                                        >
                                                            <i className="demo-icon icon-eye-line" />
                                                        </a>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="toggle1"
                                                                defaultChecked=""
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="toggle1"
                                                            />
                                                        </div>
                                                    </span>
                                                </td>
                                                <td>Lionel Messi</td>
                                                <td>
                                                    <a href="#" className="basic-links">
                                                        11890
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div> */}
          </div>
        </div>
      </div>

      {/* <AleartDialog /> */}
    </>
  );
}

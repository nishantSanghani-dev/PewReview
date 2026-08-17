import React, { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { API_ROUTES } from '../../routes/api.routes';
import { apiRequest } from '../../services/Api';
import '../leaderboards/leaderboards.css';
import { Tooltip } from '@progress/kendo-react-tooltip';
export default function LeaderBoard() {
  const [duration, setDuration] = useState('Last 2 Weeks');
  const [isDurationOpen, setIsDurationOpen] = useState(false);

  const [leaderboardType, setLeaderboardType] = useState(
    'Top 20 Gun Reviewers/Check-Ins'
  );
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [durationData, setdurationData] = useState([]);
  const durationRef = useRef(null);
  const typeRef = useRef(null);
  const getDuration = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.common.getDashboardFilter,
      null,
      null,
      {
        showLoader: true,
      }
    );
    setdurationData(res.data);
  };
  const durationOptions = [
    'Last 24 Hours',
    'This Week',
    'Last 1 Week',
    'Last 2 Weeks',
    'This Month',
    'Last Month',
    'Last 24 Hours',
    'This Week',
    'Last 1 Week',
    'Last 2 Weeks',
    'This Month',
    'Last Month',
  ];

  const typeOptions = [
    'Top 5 Gun Reviewers/Check-Ins',
    'Top 20 Gun Reviewers/Check-Ins',
    'Top 50 Gun Reviewers/Check-Ins',
    'Top 100 Gun Reviewers/Check-Ins',
    'Top 5 Venue Reviewers/Check-Ins',
    'Top 20 Venue Reviewers/Check-Ins',
    'Top 50 Venue Reviewers/Check-Ins',
    'Top 100 Venue Reviewers/Check-Ins',
  ];

  // Dummy data for table
  const leaderboardData = [];
  useEffect(() => {
    getDuration();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (durationRef.current && !durationRef.current.contains(event.target)) {
        setIsDurationOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <div className="container-fluid">
      <div className="col">
        <h2 className="page-title">Leaderboard</h2>
      </div>

      <div className="row g-2 my-4">
        {/* Left Dropdown */}
        <div className="col-12 col-md-3">
          <div style={{ position: 'relative' }} ref={durationRef}>
            <div
              className="custom-dropdown"
              onClick={() => setIsDurationOpen(!isDurationOpen)}
              style={{
                cursor: 'pointer',
                background: '#ced4da',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                fontWeight: 'bold',
                color: '#495057',
              }}
            >
              <span>{duration}</span>
              <span className="dropdown-icon">&#9662;</span>
            </div>
            {isDurationOpen && (
              <div
                className="dropdown-menu-static"
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  width: '100%',
                  top: '100%',
                  background: '#fff',
                  border: '1px solid #ced4da',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  overflow: 'scroll',
                }}
              >
                {durationData.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`dropdown-item-static ${opt.description === duration ? 'active' : ''}`}
                    onClick={() => {
                      setDuration(opt.description);
                      setIsDurationOpen(false);
                    }}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 15px',
                      color: duration === opt.description ? '#fff' : '#212529',
                      background:
                        duration === opt.description
                          ? '#c62828'
                          : 'transparent',
                    }}
                  >
                    {opt.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Dropdown */}
        <div className="col-12 col-md-4">
          <div style={{ position: 'relative' }} ref={typeRef}>
            <div
              className="custom-dropdown"
              onClick={() => setIsTypeOpen(!isTypeOpen)}
              style={{
                cursor: 'pointer',
                background: '#e9ecef',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 15px',
                fontWeight: 'bold',
                color: '#495057',
              }}
            >
              <span>{leaderboardType}</span>
              <span className="dropdown-icon">&#9662;</span>
            </div>
            {isTypeOpen && (
              <div
                className="dropdown-menu-static"
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  width: '100%',
                  top: '100%',
                  background: '#fff',
                  border: '1px solid #ced4da',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  overflow: 'hidden',
                }}
              >
                {typeOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`dropdown-item-static ${leaderboardType === opt ? 'active' : ''}`}
                    onClick={() => {
                      setLeaderboardType(opt);
                      setIsTypeOpen(false);
                    }}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 15px',
                      color: leaderboardType === opt ? '#fff' : '#212529',
                      background:
                        leaderboardType === opt ? '#c62828' : 'transparent',
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <Grid className="table-wrapper" data={leaderboardData}>
              <GridColumn
                field="rank"
                title="Rank"
                width="100px"
                cell={(props) => <TextCell {...props} field="rank" />}
              />
              <GridColumn
                field="username"
                title="Username"
                cell={(props) => <TextCell {...props} field="username" />}
              />
              <GridColumn
                field="followers"
                title="Followers"
                width="200px"
                cell={(props) => <TextCell {...props} field="followers" />}
              />
              <GridColumn
                field="venueCheckIns"
                title="Venue Check-Ins"
                width="250px"
                cell={(props) => <TextCell {...props} field="venueCheckIns" />}
              />
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

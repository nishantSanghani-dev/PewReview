import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../services/Api';
import { API_ROUTES } from '../../routes/api.routes';

export default function BdagesAdd({ getBadges, setisBadgeOpen, id }) {
  const [applicableData, setapplicableData] = useState([]);

  const [badgeSingleData, setbadgeSingleData] = useState(null);
  const [badgesValue, setbadgesValue] = useState({
    applicableFor: '',
    imageName: '',
    name: '',
    noOfCheckIns: '',
  });

  const getApplicable = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.common.getBadgeApplicableFor,
      null,
      null,
      {
        showLoader: true,
      }
    );
    setapplicableData(res.data);
  };
  const badgesSave = async (event) => {
    event.preventDefault();
    console.log(badgesValue);
    let res;
    if (id) {
      badgesValue.id = id;
      res = await apiRequest(
        'PUT',
        API_ROUTES.badges.badgeUpdate,
        badgesValue,
        null,
        {
          showLoader: true,
          showToaster: true,
        }
      );
    } else {
      res = await apiRequest(
        'POST',
        API_ROUTES.badges.badgesAdd,
        badgesValue,
        null,
        {
          showLoader: true,
          showToaster: true,
        }
      );
    }

    if (res.status) {
      setisBadgeOpen(false);
      getBadges();
    }
  };

  const getByBadgeId = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.badges.badgeById(id),
      null,
      null,
      {
        showLoader: true,
      }
    );
    setbadgeSingleData(res.data);
    setbadgesValue({
      applicableFor: res?.data?.applicableFor,
      imageName: res?.data?.imageName,
      name: res?.data?.name,
      noOfCheckIns: res?.data?.noOfCheckIns,
    });
  };
  useEffect(() => {
    getApplicable();
    if (id) {
      getByBadgeId();
    }
  }, []);
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
    >
      <div className="modal-dialog-badges modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0"
          style={{
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3">
            <h3
              className="modal-title fw-bold mb-0"
              style={{ fontSize: '20px' }}
            >
              {id ? 'Edit' : 'Add'} Badge
            </h3>

            <button
              onClick={() => setisBadgeOpen(false)}
              type="button"
              className="btn-close fs-5"
            ></button>
          </div>

          {/* Body */}
          <form onSubmit={badgesSave} action="">
            <div className="modal-body px-4 py-3">
              {/* Badge Name */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Badge Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  value={badgesValue?.name}
                  className="form-control"
                  placeholder=""
                  onChange={(e) =>
                    setbadgesValue({
                      ...badgesValue,
                      name: e.target.value,
                    })
                  }
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                />
              </div>

              {/* Badge Applicable For */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Badge Applicable For <span className="text-danger">*</span>
                </label>

                <select
                  value={badgesValue?.applicableFor}
                  onChange={(e) =>
                    setbadgesValue({
                      ...badgesValue,
                      applicableFor: Number(e.target.value),
                    })
                  }
                  className="form-select"
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  {applicableData?.map((value, index) => (
                    <option key={value?.id} value={value?.id}>
                      {value?.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkins */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  No. Of Check-Ins <span className="text-danger">*</span>
                </label>

                <input
                  value={badgesValue?.noOfCheckIns}
                  onChange={(e) =>
                    setbadgesValue({
                      ...badgesValue,
                      noOfCheckIns: e.target.value,
                    })
                  }
                  type="number"
                  className="form-control"
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                />
              </div>

              {/* Image */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Badge Image <span className="text-danger">*</span>
                </label>

                <input
                  type="file"
                  onChange={(e) =>
                    setbadgesValue({
                      ...badgesValue,
                      imageName: e.target.files[0].name,
                    })
                  }
                  className="form-control"
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                />
              </div>
              {/* <div style={{
                                padding: '0 16px',
                                color: imageFile ? '#212529' : '#6c757d',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {imageFile ? imageFile.name : "No file chosen"}
                            </div> */}
            </div>

            {/* Footer */}
            <div className="modal-footer px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                style={{
                  borderRadius: '10px',
                  minWidth: '100px',
                  height: '40px',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn text-white px-4"
                style={{
                  background: 'linear-gradient(90deg,#c1272d 0%,#771818 100%)',
                  borderRadius: '10px',
                  minWidth: '90px',
                  height: '40px',
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

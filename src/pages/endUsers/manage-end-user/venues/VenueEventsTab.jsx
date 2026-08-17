import React from 'react';

export default function VenueEventsTab() {
  return (
    <div
      className="tab-pane fade show active accordion-item d-block"
      id="nav-five-tab-pane"
      role="tabpanel"
      aria-labelledby="nav-five-tab"
      tabIndex={0}
    >
      <h2 className="accordion-header d-lg-none" id="headingFive">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseFive"
          aria-expanded="false"
          aria-controls="collapseFive"
        >
          Events
        </button>
      </h2>
      <div
        id="collapseFive"
        className="accordion-collapse collapse d-lg-block"
        aria-labelledby="headingFive"
        data-bs-parent="#myTabContent"
      >
        <div className="accordion-body mt-3 mt-xxl-4">
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th>Action</th>
                      <th>Event Name</th>
                      <th>Date &amp; Time</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No events found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

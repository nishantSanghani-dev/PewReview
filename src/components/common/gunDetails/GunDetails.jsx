import React from 'react';
import '../gunDetails/gunDetails.css';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
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
const GunImages = ({ tdProps, dataItem }) => {
  return (
    <td {...tdProps}>
      <img
        src={dataItem.gunImage.imageFullPath}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fit',
        }}
      />
    </td>
  );
};
const AmmunitionCell = ({ tdProps, dataItem, field }) => {
  return (
    <td {...tdProps}>
      {dataItem.ammunitions?.length > 0
        ? dataItem.ammunitions.map((value, index) => (
          <div key={index}>
            <ul>
              <li style={{ listStyle: 'inside' }}>{value.name}</li>
            </ul>
          </div>
        ))
        : '-'}
    </td>
  );
};
const ManufacturersCell = ({ tdProps, dataItem }) => {
  return (
    <td {...tdProps}>
      {dataItem.manufacturers?.length > 0
        ? dataItem.manufacturers.map((value, index) => (
          <div key={index}>
            <ul>
              <li style={{ listStyle: 'inside' }}>{value.name}</li>
            </ul>
          </div>
        ))
        : '-'}
    </td>
  );
};
export default function GunDetails({ setShowGunDetails, gunDetailsData }) {
  const gunDetailsColumn = [
    { field: 'gunName', title: 'Gun Name' },
    { field: 'gunImage', title: 'Gun Image', cell: GunImages, width: 40 },
    { field: 'ammunitions', title: 'Ammunitions', cell: AmmunitionCell },
    { field: 'manufacturers', title: 'Manufacturers', cell: ManufacturersCell },
  ];
  return (
    <div
      className="modal fade show d-block gun-modal-wrapper"
      tabIndex="-1"
      
    >
      <div className="modal-dialog gun-modal-dialog">
        <div className="modal-content gun-details-modal">
          {/* Header */}
          <div className="modal-header">
            <h4 className="modal-title">Gun Details</h4>

            <button
              type="button"
              onClick={() => setShowGunDetails(false)}
              className="btn-close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="gun-table-container mt-4">
              <Grid
                className="table-wrapper fw-bold text-center"
                data={gunDetailsData}
                sortable
              >
                {gunDetailsColumn.map((col) => (
                  <GridColumn
                    key={col.field}
                    field={col.field}
                    title={col.title}
                    width={col.width || 100}
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
                ))}
              </Grid>
              {/* <table className="table table-bordered mb-0">

                                <thead>
                                    <tr>
                                        <th>Gun Name</th>
                                        <th>Gun Image</th>
                                        <th>Ammunition</th>
                                        <th>Manufacturers</th>
                                    </tr>
                                </thead>


                                <tbody>

                                    <tr>
                                        <td>AK 47</td>

                                        <td>
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/AK-47.jpg/320px-AK-47.jpg"
                                                className="gun-img"
                                                alt=""
                                            />
                                        </td>

                                        <td>
                                            <span className="bullet">•</span>
                                            7.7
                                        </td>

                                        <td>
                                            <span className="bullet">•</span>
                                            China
                                        </td>
                                    </tr>


                                    <tr>
                                        <td>Arisaka</td>

                                        <td>
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Type_38_rifle.jpg/320px-Type_38_rifle.jpg"
                                                className="gun-img"
                                                alt=""
                                            />
                                        </td>

                                        <td>
                                            <span className="bullet">•</span>
                                            7.7
                                        </td>

                                        <td>
                                            <span className="bullet">•</span>
                                            China
                                        </td>
                                    </tr>

                                </tbody>

                            </table> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

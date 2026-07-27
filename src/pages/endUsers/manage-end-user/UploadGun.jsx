import { Grid, GridColumn } from '@progress/kendo-react-grid'
import React from 'react'
import { handleStatusChange } from '../../../utils/ChangeStatus';

const ActionCell = (props) => {
    console.log(props);
    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <a
                    href="javascript:void(0)"
                    className="small-square-btn danger-btn"
                >
                    <i className="demo-icon icon-delete-1"></i>
                </a>

            </div>
        </td>
    );
};
const StatusCell = (props) => {
    return (
        <td {...props.tdProps}>
            <div className="form-check form-switch mb-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={props.dataItem.isActive}
                    readOnly
                    onChange={(e) =>
                        handleStatusChange(
                            props.dataItem.gunId,
                            e.target.checked,
                            "gun",
                            "gunStatusUpdate" // callback
                        )
                    }
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
const ImageCell = (props) => {
    return (
        <td {...props.tdProps}>
            {props.dataItem.attachmentFullPath ? (
                <img
                    src={props.dataItem.attachmentFullPath}
                    alt=""
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                />
            ) : (
                "-"
            )}
        </td>
    );
};
export const DateCell = ({ tdProps, dataItem, field }) => {
    console.log(dataItem);

    return (
        <td {...tdProps}>
            {new Date(dataItem?.createdDate || dataItem?.createdOn).toLocaleDateString("en-US")}
        </td>
    )
}
const DetailCell = ({ tdProps, dataItem, field }) => {
    return (
        <td  {...tdProps}>
            <div className="text-ellipsis">
                {dataItem.details || "-"}
            </div>
        </td>
    )
}

const columns = [
    { field: "gunName", title: "Gun Name" },
    { field: "categoryNames", title: "Category Name" },
    { field: "manufacturerNames", title: "Manufacturer Name" },
    { field: "details", title: "Details", cell: DetailCell },
    { field: "attachmentFullPath", title: "Image", cell: ImageCell },
    { field: "ammunitions", title: "Ammunition" },
    { field: "createdDate", title: "Created Date", cell: DateCell },
    { field: "approvalStatusName", title: "Approval Status" },
    { field: "isActive", title: "Status", cell: StatusCell },

];
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>
        {dataItem[field] ?? "-"}
    </td>
);
export default function UploadGun({ data }) {
    console.log(data);

    return (
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
                                className="table-wrapper  text-center"
                                data={data}
                                sortable

                                pageable={{
                                    buttonCount: 5,
                                    pageSizes: [10, 20, 50],
                                    info: true,
                                    previousNext: true,
                                    type: "numeric"
                                }}
                            >
                                <GridColumn
                                    field="action"
                                    title="Action"
                                    width="80px"
                                    cells={{ data: ActionCell }}
                                />

                                {
                                    columns.map((col, index) => {
                                        return (

                                            <GridColumn
                                                className=''
                                                key={col.field}
                                                field={col.field}
                                                title={col.title}

                                                width="150px"
                                                cells={
                                                    col.cell
                                                        ?
                                                        { data: col.cell }
                                                        :
                                                        {
                                                            data: (props) => (
                                                                <TextCell {...props} field={col.field} />
                                                            )
                                                        }
                                                }
                                            />
                                        )
                                    })
                                }

                                {/* 
                                <GridColumn
                                    field="gunName"
                                    title="Gun Name"
                                    width="160px"
                                />

                                <GridColumn
                                    field="categoryName"
                                    title="Category Name"
                                    width="160px"
                                />

                                <GridColumn
                                    field="manufacturerName"
                                    title="Manufacturer Name"
                                    width="180px"
                                />

                                <GridColumn
                                    title="Details"
                                    width="280px"
                                    cells={{ data: DetailsCell }}
                                />

                                <GridColumn
                                    field="attachmentFullPath"
                                    title="Images"
                                    width="120px"
                                    cells={{ data: ImageCell }}
                                />

                                <GridColumn
                                    field="ammunition"
                                    title="Ammunition"
                                    width="140px"
                                />

                                <GridColumn
                                    field="createdOn"
                                    title="Created On"
                                    width="150px"
                                />

                                <GridColumn
                                    field="approvalStatus"
                                    title="Approval Status"
                                    width="160px"
                                />

                                <GridColumn
                                    title="Status"
                                    width="110px"
                                    cells={{ data: StatusCell }}
                                /> */}

                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { Grid, GridColumn } from '@progress/kendo-react-grid'
import React from 'react'
const gunData = [
    {
        id: 1,
        gunName: "Andrew Abbott",
        categoryName: "Handgun",
        manufacturerName: "Glock",
        details: "Glock 19 Gen5, 9mm semi-automatic pistol.",
        images: "5 Images",
        ammunition: "9mm",
        createdOn: "17 May 2024",
        approvalStatus: "Approved",
        isActive: true
    }
];
const ActionCell = (props) => {
    console.log(props);

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <a
                    href="javascript:void(0)"
                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
                </a>

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
                />
                <label className="form-check-label"></label>
            </div>
        </td>
    );
};
const DetailsCell = (props) => {
    return (
        <td {...props.tdProps}>
            <p className="mb-0">
                {props.dataItem.details}
            </p>
        </td>
    );
};
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
                                className="table-wrapper fw-bold text-center"
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
                                    title="Action"
                                    width="120px"
                                    cells={{ data: ActionCell }}
                                />

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
                                    field="images"
                                    title="Images"
                                    width="120px"
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
                                />

                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

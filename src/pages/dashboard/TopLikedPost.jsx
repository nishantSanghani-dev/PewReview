import { Grid, GridColumn } from '@progress/kendo-react-grid'
import React from 'react'
import { Link } from 'react-router-dom';
import { DateCell } from '../activity/Activity';
import { handleStatusChange } from '../../utils/ChangeStatus';

const ActionCell = (props) => {
    // console.log(props.dataItem.venueId);

    return (
        <td {...props.tdProps}>
            <div className="d-flex gap-2 align-items-center">

                <Link
                    to={`/admin/activity/view/${props.dataItem.postId}`}
                    className="small-square-btn edit-btn"
                >
                    <i className="demo-icon icon-eye-line"></i>
                </Link>

                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={props.dataItem.isActive}
                        readOnly
                        onChange={(e) =>
                            handleStatusChange(
                                props.dataItem.postId,
                                e.target.checked,
                                "activities",
                                "activitiesPostStatus"
                            )
                        }
                    />
                </div>
            </div>
        </td>
    );
};
const TextCell = ({ tdProps, dataItem, field }) => (
    <td {...tdProps}>

        {dataItem[field] ?? "-"}
    </td>
);
export default function TopLikedPost({ topLikedPost }) {

    const venueColumns = [
        { field: "action", title: "Action", cell: ActionCell, width: "80px" },
        { field: "userName", title: "Username" },
        { field: "createdOn", title: "Uploaded Date", cell: DateCell, width: "130px" },
        { field: "totalCount", title: "Likes", width: "50px" },
        // { field: "venueOwnerUserName", title: "Owner Name", cell: UserNameCell },
    ]

    return (
        <Grid
            className="table-wrapper  text-center"
            data={topLikedPost}

            pageable={{
                buttonCount: 5,
                pageSizes: [10, 20, 50],
                info: true,
                previousNext: true,
                type: "numeric"
            }}

        >
            {venueColumns.map((col) => (
                <GridColumn
                    key={col.field}
                    field={col.field}
                    title={col.title}
                    width={col.width || "150px"}
                    cells={
                        col.cell
                            ? {
                                data: (props) => (
                                    <col.cell
                                        {...props}

                                    />
                                )
                            }
                            : {
                                data: (props) => (
                                    <TextCell {...props} field={col.field} />
                                )
                            }
                    }
                />
            ))}
        </Grid>
    )
}

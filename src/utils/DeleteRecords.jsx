import { API_ROUTES } from "../routes/api.routes";
import { apiRequest } from "../services/Api";

export const handleDelete = async (
    id,
    module,
    routes,
    refreshData
) => {
    if (confirm("Are You Sure To Delete Record ?")) {
        const res = await apiRequest(
            "DELETE",
            API_ROUTES[module][routes](id),
            null,
            null,
            {
                showLoader: true,
                showToaster: true
            }

        );
        if (res.status && refreshData) {
            refreshData();
        }
    }
}
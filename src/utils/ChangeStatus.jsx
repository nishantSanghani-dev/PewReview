import { API_ROUTES } from '../routes/api.routes';
import { apiRequest } from '../services/Api';

export const handleStatusChange = async (
  id,
  checked,
  module,
  routes,
  refreshData
) => {
  if (confirm('Are you want to change status?')) {
    const res = await apiRequest(
      'PUT',
      API_ROUTES[module][routes](id),
      null,
      {
        isActive: checked,
      },
      {
        showLoader: true,
        showToaster: true,
      }
    );

    if (res.status && refreshData) {
      refreshData();
    }

    // console.log(res);
  }
};

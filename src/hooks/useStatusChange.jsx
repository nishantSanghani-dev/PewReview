import React, { useState } from 'react';
import AleartDialog from '../components/common/AleartDialog';
import { apiRequest } from '../services/Api';
import { API_ROUTES } from '../routes/api.routes';

export const useStatusChange = (refreshData) => {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusData, setStatusData] = useState(null); // { id, checked, module, routes }

  const handleStatusChange = (id, checked, module, routes) => {
    setStatusData({ id, checked, module, routes });
    setShowStatusDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!statusData) return;
    const { id, checked, module, routes } = statusData;

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
    setShowStatusDialog(false);
    setStatusData(null);
  };

  const statusConfirmDialog = showStatusDialog && (
    <AleartDialog
      title="Confirm Status Change"
      message="Are you sure you want to change status?"
      onCancel={() => {
        setShowStatusDialog(false);
        setStatusData(null);
        if (refreshData) refreshData();
      }}
      onConfirm={confirmStatusChange}
    />
  );

  return {
    handleStatusChange,
    statusConfirmDialog,
  };
};

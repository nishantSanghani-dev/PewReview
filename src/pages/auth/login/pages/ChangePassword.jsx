import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changePasswordSchema } from '../../../../validation/zod.validation';
import '../pages/changePassword.css';
import { apiRequest } from '../../../../services/Api';
import { API_ROUTES } from '../../../../routes/api.routes';
export default function ChangePassword({
  setisOpenChangePassword,
  userProfile,
}) {
  console.log(userProfile.userId);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    console.log(data);
    const res = await apiRequest(
      'POST',
      API_ROUTES.user.resetPassword,
      {
        oldPassword: data.currentPassword,
        password: data.newPassword,
        userId: userProfile.userId,
      },
      null,
      {
        showLoader: true,
        showToaster: true,
      }
    );
    if (res.status) {
      setisOpenChangePassword(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content change-password-modal">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>

            <button
              onClick={() => setisOpenChangePassword(false)}
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Current Password */}
              <div className="form-group mb-3">
                <label htmlFor="currentPassword" className="form-label">
                  Current Password <span className="text-danger">*</span>
                </label>

                <div className="password-input-group">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    className={`form-control ${
                      touchedFields.currentPassword && errors.currentPassword
                        ? 'border-danger'
                        : ''
                    }`}
                    placeholder=""
                    {...register('currentPassword')}
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    <i
                      className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    ></i>
                  </button>
                </div>

                <p className="text-danger validation-message">
                  {touchedFields.currentPassword &&
                    errors.currentPassword?.message}
                </p>
              </div>

              {/* New Password */}
              <div className="form-group mb-3">
                <label htmlFor="newPassword" className="form-label">
                  New Password <span className="text-danger">*</span>
                </label>

                <div className="password-input-group">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    className={`form-control ${
                      touchedFields.newPassword && errors.newPassword
                        ? 'border-danger'
                        : ''
                    }`}
                    placeholder=""
                    {...register('newPassword')}
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    <i
                      className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    ></i>
                  </button>
                </div>

                <p className="text-danger validation-message">
                  {touchedFields.newPassword && errors.newPassword?.message}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="form-group mb-0">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm New Password <span className="text-danger">*</span>
                </label>

                <div className="password-input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`form-control ${
                      touchedFields.confirmPassword && errors.confirmPassword
                        ? 'border-danger'
                        : ''
                    }`}
                    placeholder=""
                    {...register('confirmPassword')}
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <i
                      className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    ></i>
                  </button>
                </div>

                <p className="text-danger validation-message">
                  {touchedFields.confirmPassword &&
                    errors.confirmPassword?.message}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" className="btn btn-cancel">
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-change-password"
                disabled={isSubmitting}
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import '../common/alertDialog.css';

export default function AleartDialog({
  title = 'Confirm Action',
  message = 'Are you sure you want to continue?',
  onCancel,
  onConfirm,
}) {
  console.log(onConfirm);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="modal fade show d-block alert-dialog-modal"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(0,0,0,0.55)',
      }}
    >
      <div className="modal-dialog modal-dialog-centered alert-dialog-dialog">
        <div
          className="modal-content border-0 alert-dialog-content"
          style={{
            borderRadius: '14px',
            overflow: 'hidden',
            margin: 'auto',
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3 alert-dialog-header">
            <h3
              className="modal-title fw-bold mb-0"
              style={{ fontSize: '20px' }}
            >
              {title}
            </h3>

            <button
              type="button"
              className="btn-close fs-5 shadow-none"
              onClick={onCancel}
            />
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-3 alert-dialog-body">
            <p
              className="mb-0 fw-semibold"
              style={{
                fontSize: '15px',
                lineHeight: '1.5',
              }}
            >
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="modal-footer px-4 py-3 alert-dialog-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              style={{
                width: '100px',
                height: '40px',
                borderRadius: '10px',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn text-white"
              onClick={onConfirm}
              style={{
                width: '110px',
                height: '40px',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none',
                background:
                  'linear-gradient(90deg,#c1272d 0%,#7d1b1f 100%)',
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
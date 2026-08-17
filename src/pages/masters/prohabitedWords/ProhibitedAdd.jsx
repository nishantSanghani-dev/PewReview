import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { prohibitedWordSchema } from '../../../validation/zod.validation';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';

export default function ProhibitedAdd({
  id,
  setid,
  isProhibitedOpen,
  setisProhibitedOpen,
  getProhibited,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(prohibitedWordSchema),
    defaultValues: {
      words: '',
      description: '',
    },
  });

  const getSingleRecord = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.prohibited.prohibitedSingleView,
      null,
      {
        id,
      },
      {
        showLoader: true,
      }
    );

    if (res.status) {
      reset({
        words: res.data.words,
        description: res.data.description,
      });
    }
  };
  const onSubmit = async (data) => {
    let res;
    if (id) {
      data.id = id;
      res = await apiRequest(
        'PUT',
        API_ROUTES.prohibited.prohibitedUpdate,
        data,
        null,
        {
          showLoader: true,
          showToaster: true,
        }
      );
    } else {
      res = await apiRequest(
        'POST',
        API_ROUTES.prohibited.prohibitedAdd,
        data,
        null,
        {
          showLoader: true,
          showToaster: true,
        }
      );
    }

    if (res.status) {
      setisProhibitedOpen(false);
      getProhibited();
    }

    console.log(data);
  };
  useEffect(() => {
    if (id) {
      getSingleRecord();
    }
  }, []);
  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
    >
      <div className="modal-dialog-badges modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0"
          style={{
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3">
            <h3
              className="modal-title fw-bold mb-0"
              style={{ fontSize: '20px' }}
            >
              Add Prohibited Word
            </h3>

            <button
              type="button"
              className="btn-close fs-5"
              onClick={() => {
                setisProhibitedOpen(false);
                setid(null);
              }}
            />
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body px-4 py-3">
              {/* Prohibited Word */}
              <div className="form-group mb-3">
                <label className="fw-semibold">
                  Prohibited Word <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  {...register('words')}
                  className={`form-control ${errors.words ? 'is-invalid' : ''}`}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                />

                {errors.words && (
                  <div className="invalid-feedback d-block">
                    {errors.words.message}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="form-group mb-3">
                <label className="fw-semibold">Description</label>

                <textarea
                  rows={4}
                  {...register('description')}
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  style={{
                    borderRadius: '10px',
                    resize: 'none',
                  }}
                />

                {errors.description && (
                  <div className="invalid-feedback d-block">
                    {errors.description.message}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                style={{
                  borderRadius: '10px',
                  minWidth: '100px',
                  height: '40px',
                }}
                onClick={() => {
                  reset();
                  setisProhibitedOpen(false);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn text-white px-4"
                style={{
                  background: 'linear-gradient(90deg,#c1272d 0%,#771818 100%)',
                  borderRadius: '10px',
                  minWidth: '90px',
                  height: '40px',
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

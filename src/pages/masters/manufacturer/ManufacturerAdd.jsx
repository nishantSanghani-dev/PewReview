import React, { useEffect } from 'react';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { manufecturerSchema } from '../../../validation/zod.validation';
import { onInvalidSubmit } from '../../../utils/InvalidSubmit';

export default function ManufacturerAdd({
  id,
  getManufacturer,
  ismanufacturerOpen,
  setismanufacturerOpen,
}) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(manufecturerSchema),
    defaultValues: {
      words: '',
      description: '',
    },
  });

  const getSingleRecord = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.manufacturer.manufacturerGetById(id),
      null,
      null,
      {
        showLoader: true,
      }
    );
    if (res.status) {
      reset({
        name: res.data.name,
        description: res.data.description,
      });
    }
  };
  const fieldsToTrim = [
    'name'
  ]
  const onSubmit = async (data) => {

    let res;
    if (id) {
      data.id = id;
      res = await apiRequest(
        'PUT',
        API_ROUTES.manufacturer.manufacturerUpdate(id),
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
        API_ROUTES.manufacturer.manufacturerAdd,
        data,
        null,
        {
          showLoader: true,
          showToaster: true,
        }
      );
    }

    if (res.status) {
      setismanufacturerOpen(false);
      getManufacturer();
    }
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
              Add Manufacturer
            </h3>

            <button
              type="button"
              className="btn-close fs-5"
              onClick={() => {
                setismanufacturerOpen(false);
                setid(null);
              }}
            />
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit, () => { onInvalidSubmit(fieldsToTrim, getValues, setValue) })}>
            <div className="modal-body px-4 py-3">
              {/* Prohibited Word */}
              <div className="form-group mb-3">
                <label className="fw-semibold">
                  Manufacturer Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  {...register('name')}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                />

                {errors.name && (
                  <div className="invalid-feedback d-block">
                    {errors.name.message}
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
                  setismanufacturerOpen(false);
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

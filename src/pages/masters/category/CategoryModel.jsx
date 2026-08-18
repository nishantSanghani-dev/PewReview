import React, { useEffect, useState } from 'react';
import './categoryModel.css';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '../../../validation/zod.validation';
import { useForm } from 'react-hook-form';
export default function CategoryModel({ isCategoryOpen, setisCategoryOpen }) {
  const [categoryData, setcategoryData] = useState([]);
  const [applicationForData, setapplicationForData] = useState([]);
  const getCategory = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.category.categoryDropdown,
      null,
      null,
      {
        showLoader: true,
      }
    );

    setcategoryData(res.data);
  };
  const getApplicationFor = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.common.getGunApplicationFor,
      null,
      null,
      {
        showLoader: true,
      }
    );
    setapplicationForData(res.data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      applicationFor: Number('1'),
      categoryName: '',
      description: '',
      parentCategoryIdId: '',
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      applicationFor: Number(data.applicationFor),
    };

    console.log(payload);

    const res = await apiRequest(
      'POST',
      API_ROUTES.category.categoryAdd,
      payload,
      null,
      {
        showLoader: true,
        showToaster: true,
      }
    );

    if (res.status) {
      setisCategoryOpen(false);
    }
  };
  useEffect(() => {
    getCategory();
    getApplicationFor();
  }, []);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(0,0,0,0.55)',
        overflow: 'hidden',
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '520px' }}
      >
        <div
          className="modal-content border-0"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3">
            <h3
              className="modal-title fw-semibold mb-0"
              style={{ fontSize: '18px' }}
            >
              Add Category
            </h3>

            <button
              onClick={() => setisCategoryOpen(false)}
              type="button"
              className="btn-close"
            ></button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body px-4 py-3">
              {/* Applicable For */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold mb-2"
                  style={{ fontSize: '15px' }}
                >
                  Applicable For <span className="text-danger">*</span>
                </label>

                <div className="d-flex align-items-center gap-4">
                  {applicationForData.map((value) => (
                    <div key={value.id}>
                      <input
                        type="radio"
                        id={`application-${value.id}`}
                        value={value.id}
                        {...register('applicationFor')}
                        style={{ position: 'absolute', left: '-9999px' }}
                      />

                      <label
                        className="mb-0"
                        htmlFor={`application-${value.id}`}
                        style={{ fontSize: '15px' }}
                      >
                        {value.description}
                      </label>
                    </div>
                  ))}
                </div>

                <p className="text-danger mt-1">
                  {touchedFields.applicationFor &&
                    errors.applicationFor?.message}
                </p>
              </div>

              {/* Category Name */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: '15px' }}
                >
                  Category Name
                  <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter Category Name"
                  {...register('categoryName')}
                  className={`form-control ${touchedFields.categoryName &&
                    errors.categoryName &&
                    'border-danger'
                    }`}
                  style={{
                    height: '42px',
                    borderRadius: '10px',
                  }}
                />

                <p className="text-danger">
                  {touchedFields.categoryName && errors.categoryName?.message}
                </p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: '15px' }}
                >
                  Description
                  <span className="text-danger">*</span>
                </label>

                <textarea
                  rows={4}
                  placeholder="Enter Description"
                  {...register('description')}
                  className={`form-control ${touchedFields.description &&
                    errors.description &&
                    'border-danger'
                    }`}
                  style={{
                    borderRadius: '10px',
                    resize: 'none',
                  }}
                />

                <p className="text-danger">
                  {touchedFields.description && errors.description?.message}
                </p>
              </div>

              {/* Parent Category */}
              <div className="mb-3">
                <label
                  className="form-label fw-semibold"
                  style={{ fontSize: '15px' }}
                >
                  Parent Category
                </label>

                <select
                  {...register('parentCategoryId')}
                  className="form-select"
                  style={{
                    height: '42px',
                    borderRadius: '10px',
                  }}
                >
                  <option value="">Select Parent Category</option>

                  {categoryData.map((value) => (
                    <option key={value.key} value={value.key}>
                      {value.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer px-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{
                  minWidth: '100px',
                  height: '40px',
                  borderRadius: '10px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn text-white"
                style={{
                  background: 'linear-gradient(90deg,#c1272d 0%,#771818 100%)',
                  minWidth: '90px',
                  height: '40px',
                  borderRadius: '10px',
                  fontWeight: '500',
                  border: 'none',
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

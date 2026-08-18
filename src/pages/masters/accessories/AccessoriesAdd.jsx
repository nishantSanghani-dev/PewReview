import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { accessorySchema } from '../../../validation/zod.validation';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';

export default function AccessoriesAdd({
  id,
  setid,
  isAccessoriesOpen,
  setisAccessoriesOpen,
  getAccessories,
}) {
  const [categories, setCategories] = useState([]);
  const [gunData, setgunData] = useState([]);
  const [rawAccessoryData, setRawAccessoryData] = useState(null);
  const [selectedGuns, setSelectedGuns] = useState([]);
  const [isGunOpen, setIsGunOpen] = useState(false);
  const gunDropdownRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(accessorySchema),
    defaultValues: {
      accessoryName: '',
      categoryId: '',
      gunIds: [],
      description: '',
    },
  });

  // Register custom field
  useEffect(() => {
    register('gunIds');
  }, [register]);

  const fetchCategories = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.category.categoryDropdown,
      null,
      {
        applicableFor: 2,
      },
      {
        showLoader: true,
      }
    );
    if (res.status && res.data) {
      setCategories(res.data);
    }
  };

  const getGun = async () => {
    const res = await apiRequest(
      'GET',
      API_ROUTES.gun.getGunDropDown,
      null,
      null,
      {
        showLoader: true,
      }
    );
    if (res.status && res.data) {
      setgunData(res.data);
    }
  };

  useEffect(() => {
    fetchCategories();
    getGun();

    if (id) {
      const getSingleRecord = async () => {
        const res = await apiRequest(
          'GET',
          API_ROUTES.accessories.accessoriesGetById,
          null,
          { id },
          { showLoader: true }
        );
        if (res.status && res.data) {
          setRawAccessoryData(res.data);
        }
      };
      getSingleRecord();
    }
  }, [id]);

  useEffect(() => {
    if (rawAccessoryData && gunData.length > 0 && categories.length > 0) {
      const data = rawAccessoryData;
      const apiGunIds = data.guids || data.gunIds || [];
      reset({
        accessoryName: data.accessoryName || '',
        categoryId: data.categoryId || '',
        gunIds: apiGunIds,
        description: data.description || '',
      });

      if (apiGunIds.length > 0) {
        const selected = gunData.filter((gun) => {
          const gunIdStr = String(gun.gunId || gun.id);
          return apiGunIds.includes(gunIdStr);
        });
        setSelectedGuns(selected);
      } else if (data.guns && Array.isArray(data.guns)) {
        setSelectedGuns(data.guns);
      }
      setRawAccessoryData(null);
    }
  }, [rawAccessoryData, gunData, categories, reset]);

  const onSubmit = async (data) => {
    let res;
    if (id) {
      res = await apiRequest(
        'PUT',
        API_ROUTES.accessories.accessoriesEdit(id),
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
        API_ROUTES.accessories.accessoriesAdd,
        data,
        null,
        {
          showLoader: true,
          showToaster: true,
        }
      );
    }

    if (res.status) {
      setisAccessoriesOpen(false);
      setid(null);
      getAccessories();
    }
  };

  const handleSelectGun = (item) => {
    const itemId = String(item.gunId || item.id);
    const isSelected = selectedGuns.some(
      (g) => String(g.gunId || g.id) === itemId
    );
    let updatedGuns = [];
    if (isSelected) {
      updatedGuns = selectedGuns.filter(
        (g) => String(g.gunId || g.id) !== itemId
      );
    } else {
      updatedGuns = [...selectedGuns, item];
    }
    setSelectedGuns(updatedGuns);
    const updatedIds = updatedGuns.map((g) => String(g.gunId || g.id));
    setValue('gunIds', updatedIds, { shouldValidate: true });
    trigger('gunIds');
  };

  const handleRemoveGun = (item) => {
    const itemId = String(item.gunId || item.id);
    const updatedGuns = selectedGuns.filter(
      (g) => String(g.gunId || g.id) !== itemId
    );
    setSelectedGuns(updatedGuns);
    const updatedIds = updatedGuns.map((g) => String(g.gunId || g.id));
    setValue('gunIds', updatedIds, { shouldValidate: true });
    trigger('gunIds');
  };

  const handleClearAllGuns = () => {
    setSelectedGuns([]);
    setValue('gunIds', [], { shouldValidate: true });
    trigger('gunIds');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        gunDropdownRef.current &&
        !gunDropdownRef.current.contains(event.target)
      ) {
        setIsGunOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dropdown APIs are now fetched in the id-dependency useEffect

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"

      style={{ backgroundColor: 'rgba(0,0,0,0.55)', overflowY: "hidden" }}
    >
      <div className="modal-dialog-badges modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0"
          style={{
            borderRadius: '14px',
            overflowY: 'hidden',
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3">
            <h3
              className="modal-title fw-bold mb-0"
              style={{ fontSize: '20px' }}
            >
              {id ? 'Edit Accessory' : 'Add Accessory'}
            </h3>

            <button
              type="button"
              className="btn-close fs-5"
              onClick={() => {
                setisAccessoriesOpen(false);
                setid(null);
              }}
            />
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body px-4 py-3">
              {/* Accessory Name */}
              <div className="form-group mb-3">
                <label className="fw-semibold">
                  Accessory Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  {...register('accessoryName')}
                  className={`form-control ${errors.accessoryName ? 'is-invalid' : ''}`}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                />

                {errors.accessoryName && (
                  <div className="invalid-feedback d-block">
                    {errors.accessoryName.message}
                  </div>
                )}
              </div>

              {/* Category Select */}
              <div className="form-group mb-3">
                <label className="fw-semibold">
                  Category <span className="text-danger">*</span>
                </label>

                <select
                  {...register('categoryId')}
                  className={`form-control form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                  style={{
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => {
                    const catId =
                      cat.key || cat.categoryId || cat.id || cat.value;
                    const catName =
                      cat.categoryName || cat.name || cat.text || cat.value;
                    return (
                      <option key={catId} value={catId}>
                        {catName}
                      </option>
                    );
                  })}
                </select>

                {errors.categoryId && (
                  <div className="invalid-feedback d-block">
                    {errors.categoryId.message}
                  </div>
                )}
              </div>

              {/* Gun Dropdown (Multi-Select) */}
              <div className="form-group mb-3">
                <label className="fw-semibold">
                  Gun <span className="text-danger">*</span>
                </label>

                <div
                  className={`custom-dropdown ${errors.gunIds ? 'is-invalid' : ''}`}
                  ref={gunDropdownRef}
                >
                  <div
                    className="custom-dropdown-toggle"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      minHeight: '40px',
                      height: 'auto',
                      padding: '6px 14px',
                      border: '1px solid #dee2e6',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                    }}
                    onClick={() => setIsGunOpen(!isGunOpen)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        width: '90%',
                      }}
                    >
                      {selectedGuns.length === 0 ? (
                        <span style={{ color: '#6c757d' }}>Select guns</span>
                      ) : (
                        <>
                          {/* First Selected Gun */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: '#b8252a',
                              color: '#fff',
                              padding: '2px 8px',
                              borderRadius: '5px',
                              fontSize: '13px',
                              fontWeight: 'bold',
                            }}
                          >
                            <span>
                              {selectedGuns[0].gunName ||
                                selectedGuns[0].name ||
                                selectedGuns[0].text}
                            </span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveGun(selectedGuns[0]);
                              }}
                              style={{
                                marginLeft: '8px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                border: '1px solid #fff',
                                fontSize: '8px',
                                lineHeight: '1',
                              }}
                            >
                              &#10006;
                            </span>
                          </div>

                          {/* Remaining Items Summary Tag */}
                          {selectedGuns.length > 1 && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: '#b8252a',
                                color: '#fff',
                                padding: '2px 8px',
                                borderRadius: '5px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                              }}
                            >
                              <span>
                                {selectedGuns.length - 1} items selected
                              </span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGuns([selectedGuns[0]]);
                                  const singleId = String(
                                    selectedGuns[0].gunId || selectedGuns[0].id
                                  );
                                  setValue('gunIds', [singleId], {
                                    shouldValidate: true,
                                  });
                                  trigger('gunIds');
                                }}
                                style={{
                                  marginLeft: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  border: '1px solid #fff',
                                  fontSize: '8px',
                                  lineHeight: '1',
                                }}
                              >
                                &#10006;
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {selectedGuns.length > 0 && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearAllGuns();
                          }}
                          style={{
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: '#999',
                            marginRight: '4px',
                          }}
                        >
                          &times;
                        </span>
                      )}
                      <i
                        className={`demo-icon ${isGunOpen ? 'icon-angle-up' : 'icon-angle-down'}`}
                      ></i>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isGunOpen && (
                    <div
                      className="custom-dropdown-menu"
                      style={{
                        position: 'absolute',
                        zIndex: 1000,
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        backgroundColor: '#fff',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        marginTop: '4px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      }}
                    >
                      {gunData.map((item, index) => {
                        const itemId = String(item.gunId || item.id);
                        const isSelected = selectedGuns.some(
                          (g) => String(g.gunId || g.id) === itemId
                        );
                        return (
                          <div
                            key={index}
                            className="custom-dropdown-item d-flex justify-content-between align-items-center"
                            onClick={() => handleSelectGun(item)}
                            style={{
                              padding: '8px 14px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? '#b8252a' : '',
                              color: isSelected ? '#fff' : '#000',
                              fontWeight: isSelected ? '500' : 'normal',
                            }}
                          >
                            {item.gunName || item.name || item.text}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {errors.gunIds && (
                  <div className="invalid-feedback d-block">
                    {errors.gunIds.message}
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
                  setisAccessoriesOpen(false);
                  setid(null);
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

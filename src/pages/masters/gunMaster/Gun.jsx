import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gunSchema } from '../../../validation/zod.validation';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';

export default function Gun({
    isAddGunOpen,
    setIsAddGunOpen,
    getGun,
    id,
    setId,
}) {
    const [categoryData, setCategoryData] = useState([]);
    const [manufacturerData, setManufacturerData] = useState([]);
    const [ammunitionData, setAmmunitionData] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [isManufacturerOpen, setIsManufacturerOpen] = useState(false);
    const [isAmmunitionOpen, setIsAmmunitionOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(gunSchema),
        defaultValues: {
            gunName: '',
            categoryId: '',
            manufacturerIds: [],
            barrelLength: '',
            details: '',
            ammunitionIds: [],
            imageNames: null,
            approvalStatus: 1,
        },
    });

    const manufacturerIds = watch('manufacturerIds');
    const ammunitionIds = watch('ammunitionIds');

    const getCategories = async () => {
        const res = await apiRequest(
            'GET',
            API_ROUTES.category.categoryDropdown,
            null,
            { applicableFor: 1 },
            { showLoader: true }
        );
        if (res?.data) setCategoryData(res.data);
    };

    const getManufacturers = async () => {
        const res = await apiRequest(
            'GET',
            API_ROUTES.manufacturer.manufacturerDropdown,
            null,
            null,
            { showLoader: true }
        );
        if (res?.data) setManufacturerData(res.data);
    };

    const getAmmunition = async () => {
        const res = await apiRequest(
            'GET',
            API_ROUTES.ammunition.ammunitionDropDown,
            null,
            null,
            { showLoader: true }
        );
        // The API returns {key, value} according to the prompt
        if (res?.data) setAmmunitionData(res.data);
    };

    const getSingleRecord = async () => {
        const res = await apiRequest(
            'GET',
            API_ROUTES.gun.gunGetById,
            null,
            { id },
            {
                showLoader: true,
            }
        );
        if (res?.data) {
            const data = res.data;
            reset({
                gunName: data.gunName || '',
                categoryId: data.categoryId || '',
                manufacturerIds: data.manufacturerIds || [],
                barrelLength: data.barrelLength ? data.barrelLength.toString() : '',
                details: data.details || '',
                ammunitionIds: data.ammunitionIds || [],
                approvalStatus: data.approvalStatus || 1,
                imageNames:
                    data.attachments && data.attachments.length > 0
                        ? data.attachments[0].attachmentName
                        : null,
            });
            if (data.attachments && data.attachments.length > 0) {
                setImagePreview(data.attachments[0].attachmentFullPath);
                setImageFile({ name: data.attachments[0].attachmentName });
            }
        }
    };

    useEffect(() => {
        getCategories();
        getManufacturers();
        getAmmunition();
    }, []);

    useEffect(() => {
        if (id) {
            console.log('SDssd');

            getSingleRecord();
        }
    }, [id]);

    const handleSave = async (data) => {
        const payload = {
            gunName: data.gunName,
            categoryId: data.categoryId,
            manufacturerIds: data.manufacturerIds,
            barrelLength: data.barrelLength,
            details: data.details,
            ammunitionIds: data.ammunitionIds,
            approvalStatus: data.approvalStatus,
            imageNames: [imageFile ? imageFile.name : ''],
        };

        let res;
        if (id) {
            payload.id = id;
            res = await apiRequest('PUT', API_ROUTES.gun.gunEdit(id), payload, null, {
                showLoader: true,
                showToaster: true,
            });
        } else {
            res = await apiRequest('POST', API_ROUTES.gun.gunAdd, payload, null, {
                showLoader: true,
                showToaster: true,
            });
        }

        if (res && res.status) {
            handleClose();
            getGun();
        }
    };

    const handleClose = () => {
        setIsAddGunOpen(false);
        if (setId) setId(null);
        reset();
    };

    const toggleManufacturer = (id) => {
        const newIds = manufacturerIds.includes(id)
            ? manufacturerIds.filter((v) => v !== id)
            : [...manufacturerIds, id];
        setValue('manufacturerIds', newIds, { shouldValidate: true });
    };

    const toggleAmmunition = (id) => {
        const newIds = ammunitionIds.includes(id)
            ? ammunitionIds.filter((v) => v !== id)
            : [...ammunitionIds, id];
        setValue('ammunitionIds', newIds, { shouldValidate: true });
    };

    if (!isAddGunOpen) return null;

    const renderMultiSelect = (
        itemsData,
        selectedIds,
        isOpen,
        setIsOpen,
        toggleFunc,
        setValueField,
        placeholder
    ) => {
        const selectedItems = itemsData.filter((item) =>
            selectedIds.includes(item.key)
        );

        return (
            <div
                className="custom-dropdown"
                tabIndex={-1}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsOpen(false);
                    }
                }}
                style={{ outline: 'none' }}
            >
                <div
                    className={`custom-dropdown-toggle ${errors[setValueField] ? 'is-invalid' : ''}`}
                    style={{
                        height: 'auto',
                        minHeight: '40px',
                        padding: '6px 14px',
                        borderRadius: '10px',
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            width: '90%',
                        }}
                    >
                        {selectedItems.length === 0 ? (
                            <span style={{ color: '#6c757d', paddingTop: '2px' }}>
                                {placeholder}
                            </span>
                        ) : (
                            <>
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
                                    <span>{selectedItems[0].value}</span>
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFunc(selectedItems[0].key);
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

                                {selectedItems.length > 1 && (
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
                                        <span>{selectedItems.length - 1} items selected</span>
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setValue(setValueField, [selectedItems[0].key], {
                                                    shouldValidate: true,
                                                });
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {selectedItems.length > 0 && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setValue(setValueField, [], { shouldValidate: true });
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
                    </div>
                </div>

                {isOpen && (
                    <div className="custom-dropdown-menu">
                        {itemsData.map((item) => {
                            const isSelected = selectedIds.includes(item.key);
                            return (
                                <div
                                    key={item.key}
                                    className="custom-dropdown-item d-flex justify-content-between align-items-center"
                                    onClick={() => toggleFunc(item.key)}
                                    style={{
                                        backgroundColor: isSelected ? '#b8252a' : '',
                                        color: isSelected ? '#fff' : '',
                                        fontWeight: isSelected ? '500' : 'normal',
                                        cursor: 'pointer',
                                        padding: '6px 14px',
                                    }}
                                >
                                    {item.value}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div
                    className="modal-content border-0"
                    style={{ borderRadius: '14px', overflow: 'hidden' }}
                >
                    {/* Header */}
                    <div className="modal-header border-bottom px-4 py-3">
                        <h3
                            className="modal-title fw-bold mb-0"
                            style={{ fontSize: '20px' }}
                        >
                            {id ? 'Edit Gun' : 'Add Gun'}
                        </h3>
                        <button
                            type="button"
                            className="btn-close fs-5"
                            onClick={handleClose}
                        ></button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit(handleSave)}>
                        <div className="modal-body px-4 py-3">
                            <div className="row">
                                {/* Gun Name */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">
                                        Gun Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('gunName')}
                                        className={`form-control ${errors.gunName ? 'is-invalid' : ''}`}
                                        style={{ height: '40px', borderRadius: '10px' }}
                                    />
                                    {errors.gunName && (
                                        <div className="invalid-feedback d-block">
                                            {errors.gunName.message}
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">
                                        Category <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        {...register('categoryId')}
                                        className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                                        style={{ height: '40px', borderRadius: '10px' }}
                                    >
                                        <option value="">Select Category</option>
                                        {categoryData.map((c) => (
                                            <option key={c.key} value={c.key}>
                                                {c.value}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && (
                                        <div className="invalid-feedback d-block">
                                            {errors.categoryId.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="row">
                                {/* Manufacturer */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">
                                        Manufacturer Name <span className="text-danger">*</span>
                                    </label>
                                    {renderMultiSelect(
                                        manufacturerData,
                                        manufacturerIds,
                                        isManufacturerOpen,
                                        setIsManufacturerOpen,
                                        toggleManufacturer,
                                        'manufacturerIds',
                                        'Select manufacturer'
                                    )}
                                    {errors.manufacturerIds && (
                                        <div className="invalid-feedback d-block">
                                            {errors.manufacturerIds.message}
                                        </div>
                                    )}
                                </div>

                                {/* Barrel Length */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">
                                        Barrel Length
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="In Inch, e.g. 7.5"
                                        {...register('barrelLength')}
                                        className={`form-control ${errors.barrelLength ? 'is-invalid' : ''}`}
                                        style={{ height: '40px', borderRadius: '10px' }}
                                    />
                                    {errors.barrelLength && (
                                        <div className="invalid-feedback d-block">
                                            {errors.barrelLength.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="row">
                                {/* Ammunition */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">Ammunition</label>
                                    {renderMultiSelect(
                                        ammunitionData,
                                        ammunitionIds,
                                        isAmmunitionOpen,
                                        setIsAmmunitionOpen,
                                        toggleAmmunition,
                                        'ammunitionIds',
                                        'Select ammunition'
                                    )}
                                    {errors.ammunitionIds && (
                                        <div className="invalid-feedback d-block">
                                            {errors.ammunitionIds.message}
                                        </div>
                                    )}
                                </div>

                                {/* Approval Status */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">
                                        Approval Status
                                    </label>
                                    <select
                                        {...register('approvalStatus', { valueAsNumber: true })}
                                        className="form-select"
                                        style={{
                                            height: '40px',
                                            borderRadius: '10px',
                                            backgroundColor: '#e9ecef',
                                        }}
                                        disabled
                                    >
                                        <option value={1}>Approved</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                {/* Details */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">Details</label>
                                    <textarea
                                        rows={4}
                                        {...register('details')}
                                        className={`form-control ${errors.details ? 'is-invalid' : ''}`}
                                        style={{ borderRadius: '10px', resize: 'none' }}
                                    />
                                    {errors.details && (
                                        <div className="invalid-feedback d-block">
                                            {errors.details.message}
                                        </div>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="col-12 col-lg-6 mb-3">
                                    <label className="fw-semibold form-label">
                                        Image <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="gunImageUpload"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                setImagePreview(URL.createObjectURL(file));
                                                setValue('imageNames', file, { shouldValidate: true });
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="gunImageUpload"
                                        className={`form-control d-flex align-items-center p-0 mb-0 ${errors.imageNames ? 'is-invalid' : ''}`}
                                        style={{
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            height: '40px',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: '#f1f3f5',
                                                borderRight: '1px solid #dee2e6',
                                                padding: '0 16px',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: '#495057',
                                                fontWeight: '500',
                                            }}
                                        >
                                            Choose File
                                        </div>
                                        <div
                                            style={{
                                                padding: '0 16px',
                                                color: imageFile ? '#212529' : '#6c757d',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {imageFile ? imageFile.name : 'No file chosen'}
                                        </div>
                                    </label>
                                    {errors.imageNames && (
                                        <div className="invalid-feedback d-block">
                                            {errors.imageNames.message}
                                        </div>
                                    )}

                                    {imagePreview && (
                                        <div
                                            style={{
                                                marginTop: '12px',
                                                position: 'relative',
                                                display: 'inline-block',
                                            }}
                                        >
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    border: '1px solid #dee2e6',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                    setValue('imageNames', null, {
                                                        shouldValidate: true,
                                                    });
                                                    document.getElementById('gunImageUpload').value = '';
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    backgroundColor: '#dc3545',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '18px',
                                                    height: '18px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    cursor: 'pointer',
                                                    padding: '0',
                                                    lineHeight: '1',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                }}
                                            >
                                                &#10006;
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                                onClick={handleClose}
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
                                {id ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { ammunitionSchema } from '../../../validation/zod.validation';
import { apiRequest } from '../../../services/Api';
import { API_ROUTES } from '../../../routes/api.routes';

export default function AmmunitionAdd({ id, setid, isAmmunitionOpen, setisAmmunitionOpen, getAmmunition }) {
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger,
    } = useForm({
        resolver: zodResolver(ammunitionSchema),
        defaultValues: {
            name: "",
            categoryIds: [],
            manufacturerId: "",
            description: "",
        },
    });

    // Register custom field
    useEffect(() => {
        register("categoryIds");
    }, [register]);

    const fetchCategories = async () => {
        const res = await apiRequest("GET", API_ROUTES.category.categoryDropdown, null, null, {
            showLoader: true
        });
        if (res.status && res.data) {
            setCategories(res.data);
        }
    };

    const fetchManufacturers = async () => {
        const res = await apiRequest("GET", API_ROUTES.manufacturer.manufacturerDropdown, null, null, {
            showLoader: true
        });
        if (res.status && res.data) {
            setManufacturers(res.data);
        }
    };

    const getSingleRecord = async () => {
        const res = await apiRequest("GET", API_ROUTES.ammunition.ammunitionGetById, null, { id }, {
            showLoader: true
        });

        if (res.status && res.data) {
            const fetchedCategoryIds = res.data.categoryIds || (res.data.categoryId ? [res.data.categoryId] : []);
            reset({
                name: res.data.name || "",
                categoryIds: fetchedCategoryIds,
                manufacturerId: res.data.manufacturerId || "",
                description: res.data.description || "",
            });

            // Map and set the selected category objects for pills
            if (categories.length > 0) {
                const selected = categories.filter(cat => {
                    const catId = cat.categoryId || cat.id || cat.value;
                    return fetchedCategoryIds.includes(String(catId));
                });
                setSelectedCategories(selected);
            }
        }
    };

    // Keep selectedCategories in sync if categories load after single record
    useEffect(() => {
        if (id && categories.length > 0) {
            getSingleRecord();
        }
    }, [categories]);

    const onSubmit = async (data) => {
        let res;
        if (id) {
            data.id = id;
            res = await apiRequest("PUT", API_ROUTES.ammunition.ammunitionUpdate, data, null, {
                showLoader: true,
                showToaster: true
            });
        } else {
            res = await apiRequest(
                "POST",
                API_ROUTES.ammunition.ammunitionAdd,
                data,
                null, {
                showLoader: true,
                showToaster: true
            }
            );
        }

        if (res.status) {
            setisAmmunitionOpen(false);
            setid(null);
            getAmmunition();
        }
    };

    const handleSelectCategory = (item) => {
        const itemId = String(item.categoryId || item.id || item.value);
        const isSelected = selectedCategories.some(c => String(c.categoryId || c.id || c.value) === itemId);
        let updated = [];
        if (isSelected) {
            updated = selectedCategories.filter(c => String(c.categoryId || c.id || c.value) !== itemId);
        } else {
            updated = [...selectedCategories, item];
        }
        setSelectedCategories(updated);
        const updatedIds = updated.map(c => String(c.key || c.id || c.value));
        setValue("categoryIds", updatedIds, { shouldValidate: true });
        trigger("categoryIds");
    };

    const handleRemoveCategory = (item) => {
        const itemId = String(item.categoryId || item.id || item.value);
        const updated = selectedCategories.filter(c => String(c.categoryId || c.id || c.value) !== itemId);
        setSelectedCategories(updated);
        const updatedIds = updated.map(c => String(c.categoryId || c.id || c.value));
        setValue("categoryIds", updatedIds, { shouldValidate: true });
        trigger("categoryIds");
    };

    const handleClearAllCategories = () => {
        setSelectedCategories([]);
        setValue("categoryIds", [], { shouldValidate: true });
        trigger("categoryIds");
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchManufacturers();
    }, []);

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
            <div className="modal-dialog-badges modal-dialog-centered modal-lg">
                <div
                    className="modal-content border-0"
                    style={{
                        borderRadius: "14px",
                        overflow: "hidden"
                    }}
                >
                    {/* Header */}
                    <div className="modal-header border-bottom px-4 py-3">
                        <h3
                            className="modal-title fw-bold mb-0"
                            style={{ fontSize: "20px" }}
                        >
                            {id ? "Edit Ammunition" : "Add Ammunition"}
                        </h3>

                        <button
                            type="button"
                            className="btn-close fs-5"
                            onClick={() => {
                                setisAmmunitionOpen(false);
                                setid(null);
                            }}
                        />
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body px-4 py-3">

                            {/* Ammunition Name */}
                            <div className="form-group mb-3">
                                <label className="fw-semibold">
                                    Ammunition Name <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    {...register("name")}
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    style={{
                                        height: "40px",
                                        borderRadius: "10px"
                                    }}
                                />

                                {errors.name && (
                                    <div className="invalid-feedback d-block">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>

                            {/* Categories Dropdown (Multi-Select) */}
                            <div className="form-group mb-3">
                                <label className="fw-semibold">
                                    Categories
                                </label>

                                <div className={`custom-dropdown ${errors.categoryIds ? "is-invalid" : ""}`} ref={categoryDropdownRef}>
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
                                            backgroundColor: '#fff'
                                        }}
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                    >
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', width: '90%' }}>
                                            {selectedCategories.length === 0 ? (
                                                <span style={{ color: '#6c757d' }}>Select Categories</span>
                                            ) : (
                                                <>
                                                    {/* First Selected Category */}
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        backgroundColor: '#b8252a',
                                                        color: '#fff',
                                                        padding: '2px 8px',
                                                        borderRadius: '5px',
                                                        fontSize: '13px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        <span>{selectedCategories[0].value || selectedCategories[0].name || selectedCategories[0].text}</span>
                                                        <span
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveCategory(selectedCategories[0]);
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
                                                                lineHeight: '1'
                                                            }}
                                                        >
                                                            &#10006;
                                                        </span>
                                                    </div>

                                                    {/* Remaining Items Summary Tag */}
                                                    {selectedCategories.length > 1 && (
                                                        <div style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            backgroundColor: '#b8252a',
                                                            color: '#fff',
                                                            padding: '2px 8px',
                                                            borderRadius: '5px',
                                                            fontSize: '13px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            <span>{selectedCategories.length - 1} item selected</span>
                                                            <span
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedCategories([selectedCategories[0]]);
                                                                    const singleId = String(selectedCategories[0].categoryId || selectedCategories[0].id || selectedCategories[0].value);
                                                                    setValue("categoryIds", [singleId], { shouldValidate: true });
                                                                    trigger("categoryIds");
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
                                                                    lineHeight: '1'
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
                                            {selectedCategories.length > 0 && (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleClearAllCategories();
                                                    }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        color: '#999',
                                                        marginRight: '4px'
                                                    }}
                                                >
                                                    &times;
                                                </span>
                                            )}
                                            <i className={`demo-icon ${isCategoryDropdownOpen ? "icon-angle-up" : "icon-angle-down"}`}></i>
                                        </div>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isCategoryDropdownOpen && (
                                        <div className="custom-dropdown-menu" style={{
                                            position: 'absolute',
                                            zIndex: 1000,
                                            width: '100%',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            backgroundColor: '#fff',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '8px',
                                            marginTop: '4px',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}>
                                            {categories.map((item, index) => {
                                                const itemId = String(item.categoryId || item.id || item.value);
                                                const isSelected = selectedCategories.some(c => String(c.categoryId || c.id || c.value) === itemId);
                                                return (
                                                    <div
                                                        key={index}
                                                        className="custom-dropdown-item d-flex justify-content-between align-items-center"
                                                        onClick={() => handleSelectCategory(item)}
                                                        style={{
                                                            padding: '8px 14px',
                                                            cursor: 'pointer',
                                                            backgroundColor: isSelected ? '#b8252a' : '',
                                                            color: isSelected ? '#fff' : '#000',
                                                            fontWeight: isSelected ? '500' : 'normal'
                                                        }}
                                                    >
                                                        {item.categoryName || item.name || item.text || item.value}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {errors.categoryIds && (
                                    <div className="invalid-feedback d-block">
                                        {errors.categoryIds.message}
                                    </div>
                                )}
                            </div>

                            {/* Manufacturer Select */}
                            <div className="form-group mb-3">
                                <label className="fw-semibold">
                                    Manufacturer <span className="text-danger">*</span>
                                </label>

                                <select
                                    {...register("manufacturerId")}
                                    className={`form-control form-select ${errors.manufacturerId ? "is-invalid" : ""}`}
                                    style={{
                                        height: "40px",
                                        borderRadius: "10px"
                                    }}
                                >
                                    <option value="">Select Manufacturer</option>
                                    {manufacturers.map((mfg) => {
                                        const mfgId = mfg.key || mfg.id || mfg.manufacturerId || mfg.value;
                                        const mfgName = mfg.name || mfg.manufacturerName || mfg.text || mfg.value;
                                        return (
                                            <option key={mfgId} value={mfgId}>
                                                {mfgName}
                                            </option>
                                        );
                                    })}
                                </select>

                                {errors.manufacturerId && (
                                    <div className="invalid-feedback d-block">
                                        {errors.manufacturerId.message}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="form-group mb-3">
                                <label className="fw-semibold">
                                    Description
                                </label>

                                <textarea
                                    rows={4}
                                    {...register("description")}
                                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                    style={{
                                        borderRadius: "10px",
                                        resize: "none"
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
                                    borderRadius: "10px",
                                    minWidth: "100px",
                                    height: "40px"
                                }}
                                onClick={() => {
                                    reset();
                                    setisAmmunitionOpen(false);
                                    setid(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn text-white px-4"
                                style={{
                                    background:
                                        "linear-gradient(90deg,#c1272d 0%,#771818 100%)",
                                    borderRadius: "10px",
                                    minWidth: "90px",
                                    height: "40px"
                                }}
                            >
                                Save
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

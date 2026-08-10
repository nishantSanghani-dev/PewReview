import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { venueSchema } from '../../../../validation/zod.validation'
import { apiRequest } from '../../../../services/Api'
import { API_ROUTES } from '../../../../routes/api.routes'
import { DropDownList } from '@progress/kendo-react-dropdowns'

export default function VenueAdd({ setvenueAddBtn, editVenueId, setEditVenueId }) {
    const [endUserData, setendUserData] = useState([])
    const [getVenueType, setgetVenueType] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [isVenuOpen, setisVenuOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedVenue, setselectedVenue] = useState(null);
    const [gunData, setgunData] = useState([]);
    const [selectedGuns, setSelectedGuns] = useState([]);
    const [isGunOpen, setIsGunOpen] = useState(false);
    const [countryData, setCountryData] = useState([]);
    const [latitude, setLatitude] = useState(37.0902);
    const [longitude, setLongitude] = useState(-95.7129);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageName, setExistingImageName] = useState("");
    const fileInputRef = useRef(null);
    const mapRef = useRef(null);
    const userDropdownRef = useRef(null);
    const venueDropdownRef = useRef(null);
    const gunDropdownRef = useRef(null);
    const [countryDetails, setcountryDetails] = useState({})
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(venueSchema),
        defaultValues: {
            userId: "",
            venueName: "",
            description: "",
            website: "",
            selectedCountryId: "",
            countryCode: "",
            countryCodeName: "",
            phone: "",
            address: "",
            venueType: "",
            gunIds: []
        }
    });

    useEffect(() => {
        register("userId");
        register("selectedCountryId");
        register("countryCode");
        register("countryCodeName");
        register("venueType");
        register("gunIds");
        register("imageName");
        register("address");
    }, [register]);

    const getEndUuser = async () => {
        const res = await apiRequest("GET", API_ROUTES.endUser.endUserDropDown, null, null, {
            showLoader: true
        })
        setendUserData(res.data)
    }

    const getVenue = async () => {
        const res = await apiRequest("GET", API_ROUTES.common.getVenueType, null, null, {
            showLoader: true
        })
        setgetVenueType(res.data)
    }
    const getGun = async () => {
        const res = await apiRequest("GET", API_ROUTES.gun.getGunDropDown, null, null, {
            showLoader: true
        })
        setgunData(res.data)
    }

    const getCountry = async () => {
        const res = await apiRequest("GET", API_ROUTES.common.getCountry, null, null, {
            showLoader: true
        })
        setCountryData(res.data)
    }

    const getImagePreviewUrl = (imageValue) => {
        if (!imageValue) return null;
        if (typeof imageValue === "string" && /^(https?:|data:image)/i.test(imageValue)) {
            return imageValue;
        }
        if (typeof imageValue === "string") {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
            return `${baseUrl}/${imageValue.replace(/^\/+/, "")}`;
        }
        return null;
    };

    const normalizeId = (value) => {
        return typeof value === "string" ? value.toLowerCase() : value;
    };

    const findMatchingUser = (data) => {
        const candidateIds = [data?.userId, data?.createdBy, data?.ownerUserId, data?.createdById, data?.key, data?.value]
            .filter(Boolean)
            .map(normalizeId);

        if (candidateIds.length === 0) return null;

        return endUserData.find((user) => {
            const userIds = [user?.key, user?.value, user?.userId, user?.id, user?.createdById, user?.ownerUserId]
                .filter(Boolean)
                .map(normalizeId);
            return userIds.some((id) => candidateIds.includes(id));
        }) || null;
    };

    const findMatchingCountry = (data) => {
        const addressText = `${data?.address || ""} ${data?.countryCodeName || ""} ${data?.countryCode || ""}`.toLowerCase();

        return countryData.find((country) => {
            const countryName = (country?.countryName || "").toLowerCase();
            const countryCode = (country?.countryCode || "").toLowerCase();
            const phoneCode = (country?.phoneInternationalCode || "").toLowerCase();

            return (
                country.countryCode === data?.countryCodeName ||
                country.countryCode === data?.countryCode ||
                country.phoneInternationalCode === data?.countryCode ||
                countryName === data?.countryCodeName?.toLowerCase() ||
                addressText.includes(countryName) ||
                addressText.includes(countryCode) ||
                addressText.includes(phoneCode.replace(/\+/g, ""))
            );
        }) || null;
    };

    const handleSelectGun = (item) => {
        const isSelected = selectedGuns.some(g => g.gunId === item.gunId);
        let updatedGuns = [];
        if (isSelected) {
            updatedGuns = selectedGuns.filter(g => g.gunId !== item.gunId);
        } else {
            updatedGuns = [...selectedGuns, item];
        }
        setSelectedGuns(updatedGuns);
        setValue("gunIds", updatedGuns.map(g => g.gunId), { shouldValidate: true });
    };

    const handleRemoveGun = (item) => {
        const updatedGuns = selectedGuns.filter(g => g.gunId !== item.gunId);
        setSelectedGuns(updatedGuns);
        setValue("gunIds", updatedGuns.map(g => g.gunId), { shouldValidate: true });
    };

    const initializeMap = () => {
        if (!window.L || mapRef.current) return;

        // Leaflet default icon configuration
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const defaultLat = 37.0902;
        const defaultLng = -95.7129;

        const map = window.L.map('map-container').setView([defaultLat, defaultLng], 4);
        mapRef.current = map;

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        let marker = window.L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

        const handleLocationSelect = async (lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                    {
                        headers: {
                            'Accept-Language': 'en'
                        }
                    }
                );
                const data = await response.json();
                if (data && data.display_name) {
                    setValue("address", data.display_name, { shouldValidate: true });
                }
            } catch (error) {
                console.error("Error fetching address: ", error);
            }
        };

        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            handleLocationSelect(lat, lng);
        });

        marker.on('dragend', () => {
            const { lat, lng } = marker.getLatLng();
            handleLocationSelect(lat, lng);
        });

        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    };

    const handleAddressBlur = async () => {
        const addressVal = getValues("address") || "";
        if (!addressVal.trim() || !window.L || !mapRef.current) return;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressVal)}&limit=1`,
                {
                    headers: {
                        'Accept-Language': 'en'
                    }
                }
            );
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);
                setLatitude(newLat);
                setLongitude(newLng);
                mapRef.current.setView([newLat, newLng], 14);

                // Find existing marker and move it
                mapRef.current.eachLayer((layer) => {
                    if (layer instanceof window.L.Marker) {
                        layer.setLatLng([newLat, newLng]);
                    }
                });
            }
        } catch (error) {
            console.error("Error searching address coordinates: ", error);
        }
    };


    const handleCountry = (event) => {
        console.log(event.target.value);
        console.log(countryData);

        const contryFind = countryData.find((value, index) => value.countryId == event.target.value)
        console.log(contryFind);
        setcountryDetails({
            countryCode: contryFind.phoneInternationalCode,
            countryCodeName: contryFind.countryCode

        })

    }
    const handleSave = async (data) => {
        console.log(data);

        const selectedCountry = countryData.find(c => String(c.countryId) === String(data.selectedCountryId));
        const countryCode = data.countryCode || (selectedCountry ? selectedCountry.phoneInternationalCode : "");
        const countryCodeName = data.countryCodeName || (selectedCountry ? selectedCountry.countryCode : "");
        console.log(countryCodeName);

        const imageNameValue = imageFile ? imageFile.name : existingImageName || "";
        console.log(data);

        const payload = {
            address: data.address,
            countryCode: countryDetails.countryCode,
            countryCodeName: countryDetails.countryCodeName,
            description: data.description || "",
            gunIds: data.gunIds && Array.isArray(data.gunIds) ? data.gunIds : [],
            imageName: imageNameValue,
            latitude: latitude,
            longitude: longitude,
            phone: data.phone,
            userId: selectedUser?.key || selectedUser?.userId || selectedUser?.id || "",
            venueName: data.venueName,
            venueType: Number(data.venueType),
            website: data.website || ""
        };
        console.log(payload);



        const url = editVenueId ? API_ROUTES.venue.venueEdit(editVenueId) : API_ROUTES.venue.VenueAdd;
        const method = editVenueId ? "PUT" : "POST";
        const res = await apiRequest(method, url, payload, null, {
            showLoader: true,
            showToaster: true
        });
        if (res) {

            setvenueAddBtn(false);
            if (setEditVenueId) setEditVenueId(null);
        }

    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (gunDropdownRef.current && !gunDropdownRef.current.contains(event.target)) {
                setIsGunOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (venueDropdownRef.current && !venueDropdownRef.current.contains(event.target)) {
                setisVenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const getSingleVenue = async () => {
            if (!editVenueId) return;

            const res = await apiRequest("GET", API_ROUTES.venue.getVenueById(editVenueId), null, null, {
                showLoader: true
            });

            if (res && res.data) {
                const data = res.data;
               

                console.log(data);
                setcountryDetails({
                    countryCode: data.countryCode,
                    countryCodeName: data.countryCodeName

                })
                setValue("userId", data.userId, { shouldValidate: true });
                setValue("venueName", data.venueName, { shouldValidate: true });
                setValue("description", data.description, { shouldValidate: true });
                setValue("website", data.website, { shouldValidate: true });
                setValue("phone", data.phone, { shouldValidate: true });
                setValue("address", data.address, { shouldValidate: true });
                setValue("venueType", data.venueType, { shouldValidate: true });

                setLatitude(parseFloat(data.latitude) || 37.0902);
                setLongitude(parseFloat(data.longitude) || -95.7129);

                const matchingUser = findMatchingUser(data);
                console.log(matchingUser);

                if (matchingUser) {
                    setSelectedUser(matchingUser);
                    setValue("userId", matchingUser.key || matchingUser.userId || matchingUser.id || data.userId, { shouldValidate: true });
                } else {
                    const fallbackUser = {
                        key: data.userId,
                        userId: data.userId,
                        userName: data.userName || data.name || data.userName || data.userId || "Unknown User",
                        name: data.name || data.userName || data.userId || "Unknown User"
                    };
                    setSelectedUser(fallbackUser);
                    setValue("userId", data.userId, { shouldValidate: true });
                }

                const matchingCountry = findMatchingCountry(data);
                console.log(matchingCountry);

                if (matchingCountry) {
                    setValue("selectedCountryId", matchingCountry.countryId, { shouldValidate: true });
                    setValue("countryCode", matchingCountry.phoneInternationalCode || "", { shouldValidate: true });
                    setValue("countryCodeName", matchingCountry.countryCode || "", { shouldValidate: true });
                } else {
                    // Fallback: try to use countryDetails returned from the venue API
                    const venueCountryCode = data?.countryCode || countryDetails?.countryCode || data?.phoneCountryCode || "";
                    const venueCountryCodeName = data?.countryCodeName || countryDetails?.countryCodeName || "";

                    const fallbackCountry = countryData.find((c) => {
                        if (!c) return false;
                        const phone = (c.phoneInternationalCode || "").toString();
                        const code = (c.countryCode || "").toString();
                        return (
                            (venueCountryCode && phone.includes(String(venueCountryCode).replace(/\+/g, '')))
                            || (venueCountryCode === phone)
                            || (venueCountryCodeName && code.toLowerCase() === String(venueCountryCodeName).toLowerCase())
                            || (venueCountryCode && String(c.countryId) === String(venueCountryCode))
                        );
                    }) || null;

                    if (fallbackCountry) {
                        setValue("selectedCountryId", fallbackCountry.countryId, { shouldValidate: true });
                        setValue("countryCode", fallbackCountry.phoneInternationalCode || "", { shouldValidate: true });
                        setValue("countryCodeName", fallbackCountry.countryCode || "", { shouldValidate: true });
                    }
                }

                const matchingVenueType = getVenueType.find((item) =>
                    item.venueTypeId === data.venueType ||
                    item.id === data.venueType ||
                    item.description === data.venueTypeName
                );
                if (matchingVenueType) {
                    setselectedVenue(matchingVenueType);
                }

                const previewUrl = getImagePreviewUrl(data.imagePath || data.imageUrl || data.imageName || data.imageFullPath || data.venueImagePath || data.venueImageUrl);
                if (previewUrl) {
                    setImagePreview(previewUrl);
                }

                const existingImageValue = data.imageName || data.imagePath || data.imageUrl || data.imageFullPath || data.venueImagePath || data.venueImageUrl || "";
                setExistingImageName(existingImageValue);
                setValue("imageName", existingImageValue, { shouldValidate: true });

                if (data.guns && Array.isArray(data.guns)) {
                    setSelectedGuns(data.guns);
                    setValue("gunIds", data.guns.map(g => g.gunId), { shouldValidate: true });
                }
            }
        };

        if (editVenueId && countryData.length > 0 && endUserData.length > 0 && getVenueType.length > 0) {
            getSingleVenue();
        }
    }, [editVenueId, countryData, endUserData, getVenueType, setValue]);

    useEffect(() => {
        getEndUuser()
        getVenue()
        getGun()
        getCountry()

        let link = document.querySelector("link[href*='leaflet.css']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        let script = document.querySelector("script[src*='leaflet.js']");
        if (window.L) {
            initializeMap();
        } else if (!script) {
            script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.async = true;
            script.onload = () => {
                initializeMap();
            };
            document.body.appendChild(script);
        } else {
            const handleLoad = () => initializeMap();
            script.addEventListener('load', handleLoad);
            return () => {
                script.removeEventListener('load', handleLoad);
                if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                }
            };
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [])
    useEffect(() => {
        console.log(countryDetails);

    }, [countryDetails])
    return (
        <div
            className="modal mb-5 mt-5 fade show d-block venue-modal"
            style={{ background: "rgba(0,0,0,0.4)" }}
        >
            <div
                style={{
                    marginTop: "40px",
                    marginBottom: "40px",
                }}
                className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow">
                    <form onSubmit={handleSubmit(handleSave)}>
                        {/* Header */}
                        <div className="modal-header border-0 px-4 pt-4 pb-3">
                            <h2 className="fw-bold mb-0">{editVenueId ? "Edit Venue" : "Add Venue"}</h2>

                            <button
                                onClick={() => {
                                    setvenueAddBtn(false);
                                    if (setEditVenueId) setEditVenueId(null);
                                }}
                                type="button"
                                className="btn-close fs-5"
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body px-4 pb-4">
                            {/* Row 1 */}
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">
                                        Select Username <span className="text-danger">*</span>
                                    </label>

                                    <div className="custom-dropdown" ref={userDropdownRef}>

                                        {/* Header */}
                                        <div
                                            className="custom-dropdown-toggle"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <span>
                                                {selectedUser ? (selectedUser.userName || selectedUser.value || selectedUser.name || selectedUser.key || selectedUser.userId) : "Select Username"}
                                            </span>

                                            <i
                                                className={`demo-icon ${isOpen ? "icon-angle-up" : "icon-angle-down"
                                                    }`}
                                            ></i>
                                        </div>

                                        {/* Menu */}
                                        {isOpen && (
                                            <div className="custom-dropdown-menu">
                                                {endUserData.map((item, index) => {
                                                    console.log(item);

                                                    return (

                                                        <div
                                                            key={index}
                                                            className="custom-dropdown-item"
                                                            onClick={() => {
                                                                setSelectedUser(item);
                                                                setValue("userId", item.key || item.userId || item.id || "", { shouldValidate: true });
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            {item.userName}
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </div>
                                        )}

                                    </div>
                                    {errors.userId && (
                                        <div className="invalid-feedback d-block">
                                            {errors.userId.message}
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">
                                        Venue Name <span className="text-danger">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        className={`form-control form-control-custom ${errors.venueName ? 'is-invalid' : ''}`}
                                        {...register('venueName')}
                                    />
                                    {errors.venueName && (
                                        <div className="invalid-feedback d-block">
                                            {errors.venueName.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">
                                        Venue Image <span className="text-danger">*</span>
                                    </label>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                setImagePreview(URL.createObjectURL(file));
                                                setValue("imageName", file, { shouldValidate: true });
                                            }
                                        }}
                                    />

                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className={`form-control form-control-custom d-flex align-items-center p-0 ${errors.imageName ? 'is-invalid' : ''}`}
                                        style={{ cursor: 'pointer', overflow: 'hidden', height: '46px', border: '1px solid #dee2e6', borderRadius: '10px' }}
                                    >
                                        <div style={{
                                            backgroundColor: '#f1f3f5',
                                            borderRight: '1px solid #dee2e6',
                                            padding: '0 16px',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#495057',
                                            fontWeight: '500'
                                        }}>
                                            Choose file
                                        </div>
                                        <div style={{
                                            padding: '0 16px',
                                            color: imageFile ? '#212529' : '#6c757d',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {imageFile ? imageFile.name : "No file chosen"}
                                        </div>
                                    </div>
                                    {errors.imageName && (
                                        <div className="invalid-feedback d-block">
                                            {errors.imageName.message}
                                        </div>
                                    )}

                                    {imagePreview && (
                                        <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '6px',
                                                    border: '1px solid #dee2e6'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImageFile(null);
                                                    setImagePreview(null);
                                                    setValue("imageName", null, { shouldValidate: true });
                                                    if (fileInputRef.current) fileInputRef.current.value = "";
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
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                &#10006;
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Description</label>

                                    <textarea
                                        rows="4"
                                        className={`form-control form-control-custom ${errors.description ? 'is-invalid' : ''}`}
                                        {...register('description')}
                                    ></textarea>
                                    {errors.description && (
                                        <div className="invalid-feedback d-block">
                                            {errors.description.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">Website</label>

                                    <input
                                        type="text"
                                        className={`form-control form-control-custom ${errors.website ? 'is-invalid' : ''}`}
                                        placeholder="https://example.com"
                                        {...register('website')}
                                    />
                                    {errors.website && (
                                        <div className="invalid-feedback d-block">
                                            {errors.website.message}
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">
                                        Phone <span className="text-danger">*</span>
                                    </label>

                                    <div className="d-flex gap-2">
                                        <select
                                            className={`form-select form-control-custom ${errors.selectedCountryId ? 'is-invalid' : ''}`}
                                            style={{ maxWidth: "140px" }}
                                            {...register('selectedCountryId')}
                                            // onChange={(e) => {
                                            //     const countryId = e.target.value;
                                            //     console.log(countryId);

                                            //     const country = countryData.find((value) => String(value.countryId) === String(countryId));
                                            //     console.log(country);
                                            //     setcountryDetails(country)
                                            //     setValue("selectedCountryId", countryId, { shouldValidate: true });
                                            //     setValue("countryCode", country ? country.phoneInternationalCode : "", { shouldValidate: true });
                                            //     setValue("countryCodeName", country ? country.countryCode : "", { shouldValidate: true });
                                            // }}
                                            onChange={handleCountry}
                                        >
                                            <option value="">Select Code</option>
                                            {countryData.map((value, index) => {
                                                return (
                                                    <option key={value.countryId} value={value.countryId}>
                                                        ({value.phoneInternationalCode}) {value.countryName}
                                                    </option>
                                                )
                                            }
                                            )}
                                        </select>

                                        <input
                                            type="text"
                                            className={`form-control form-control-custom ${errors.phone ? 'is-invalid' : ''}`}
                                            {...register('phone')}
                                        />
                                        <input type="hidden" {...register('countryCode')} />
                                        <input type="hidden" {...register('countryCodeName')} />
                                    </div>
                                    {errors.selectedCountryId && (
                                        <div className="invalid-feedback d-block">
                                            {errors.selectedCountryId.message}
                                        </div>
                                    )}
                                    {errors.phone && (
                                        <div className="invalid-feedback d-block">
                                            {errors.phone.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Address <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    className={`form-control form-control-custom ${errors.address ? 'is-invalid' : ''}`}
                                    {...register('address')}
                                    onBlur={handleAddressBlur}
                                />
                                {errors.address && (
                                    <div className="invalid-feedback d-block">
                                        {errors.address.message}
                                    </div>
                                )}
                            </div>

                            {/* Map */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Map Location <span className="text-danger">*</span>
                                </label>

                                <div className="map-box" style={{ overflow: 'hidden', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                                    <div id="map-container" style={{ width: "100%", height: "330px" }}></div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">
                                        Venue Type <span className="text-danger">*</span>
                                    </label>

                                    <div className="custom-dropdown" ref={venueDropdownRef}>

                                        {/* Header */}
                                        <div
                                            className="custom-dropdown-toggle"
                                            onClick={() => setisVenuOpen(!isVenuOpen)}
                                        >
                                            <span>
                                                {selectedVenue ? selectedVenue.description : "Select Venue Type"}
                                            </span>

                                            <i
                                                className={`demo-icon ${isVenuOpen ? "icon-angle-up" : "icon-angle-down"
                                                    }`}
                                            ></i>
                                        </div>

                                        {/* Menu */}
                                        {isVenuOpen && (
                                            <div className="custom-dropdown-menu">
                                                {getVenueType.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="custom-dropdown-item"
                                                        onClick={() => {
                                                            setselectedVenue(item);
                                                            setValue("venueType", item.venueTypeId || item.id || item.venueType || "", { shouldValidate: true });
                                                            setisVenuOpen(false);
                                                        }}
                                                    >
                                                        {item.description}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                    {errors.venueType && (
                                        <div className="invalid-feedback d-block">
                                            {errors.venueType.message}
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-6 mb-3">
                                    <label className="form-label">
                                        Gun
                                    </label>

                                    <div className="custom-dropdown" ref={gunDropdownRef}>
                                        {/* Header */}
                                        <div
                                            className="custom-dropdown-toggle"
                                            style={{ height: 'auto', minHeight: '46px', padding: '6px 14px' }}
                                            onClick={() => setIsGunOpen(!isGunOpen)}
                                        >
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', width: '90%' }}>
                                                {selectedGuns.length === 0 ? (
                                                    <span style={{ color: '#6c757d' }}>Select Gun</span>
                                                ) : (
                                                    <>
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
                                                            <span>{selectedGuns[0].gunName}</span>
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
                                                                    lineHeight: '1'
                                                                }}
                                                            >
                                                                &#10006;
                                                            </span>
                                                        </div>

                                                        {selectedGuns.length > 1 && (
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
                                                                <span>{selectedGuns.length - 1} items selected</span>
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedGuns([selectedGuns[0]]);
                                                                        setValue("gunIds", [selectedGuns[0].gunId], { shouldValidate: true });
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
                                                {selectedGuns.length > 0 && (
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedGuns([]);
                                                            setValue("gunIds", [], { shouldValidate: true });
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
                                                <i className={`demo-icon ${isGunOpen ? "icon-angle-up" : "icon-angle-down"}`}></i>
                                            </div>
                                        </div>

                                        {/* Menu */}
                                        {isGunOpen && (
                                            <div className="custom-dropdown-menu">
                                                {gunData && gunData.map((item, index) => {
                                                    const isSelected = selectedGuns.some(g => g.gunId === item.gunId);
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="custom-dropdown-item d-flex justify-content-between align-items-center"
                                                            onClick={() => handleSelectGun(item)}
                                                            style={{
                                                                backgroundColor: isSelected ? '#b8252a' : '',
                                                                color: isSelected ? '#fff' : '',
                                                                fontWeight: isSelected ? '500' : 'normal'
                                                            }}
                                                        >
                                                            {item.gunName}
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
                            </div>


                            {/* Buttons */}
                            <div className="text-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setvenueAddBtn(false);
                                        if (setEditVenueId) setEditVenueId(null);
                                    }}
                                    className="btn btn-light px-4 me-2"
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="btn btn-primary px-4">
                                    Save Venue
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

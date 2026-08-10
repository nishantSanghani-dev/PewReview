import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../services/Api'
import { API_ROUTES } from '../../routes/api.routes'
import { useNavigate } from 'react-router-dom'

export default function SupportTicketEdit({ showModal, setShowModal, ticketId, statusOptions, getTickets }) {

    const navigation = useNavigate()
    const [ticketSingleData, setticketSingleData] = useState(null)
    const [editData, seteditData] = useState({
        statusId: "",
        description: ""
    })
    const getTicketById = async () => {
        const res = await apiRequest("GET", API_ROUTES.supportTicket.supportTicketViewById(ticketId), null, null, {
            showLoader: true
        })

        const ticket = res.data
        setticketSingleData(ticket)
        seteditData({
            statusId: ticket?.statusId ?? "",
            description: ticket?.adminDescription ?? ""
        })
    }



    const handleTicketEdit = async (event) => {
        event.preventDefault()
        const payload = {
            ticketId,
            statusId: Number(editData.statusId),
            description: editData.description?.trim() || "-",
        };

        const res = await apiRequest("POST", API_ROUTES.supportTicket.supportTicketUpdate, payload, null, {
            showLoader: true,
            showToaster: true
        })

        if (res.status) {
            setShowModal(false)
            if (getTickets) {
                getTickets()
            }
        }
    }

    useEffect(() => {
        getTicketById()
    }, [ticketId])

    useEffect(() => {
        console.log(editData);

    }, [editData])
    return (
        <>
            {/* Backdrop */}
            {
                console.log(ticketSingleData)
                
            }
            <div className='custom-backdrop'></div>

            {/* Modal */}
            <div className="custom-modal-wrapper">
                <div className="custom-modal">

                    {/* Header */}
                    <div className="modal-header-custom">
                        <h3>Edit Support Ticket</h3>

                        <button
                            className="btn-close-modal"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                    </div>

                    {/* Body */}
                    <div className="modal-body-custom">
                        <form onSubmit={handleTicketEdit} action="">
                            <div className="mb-3">
                                <label className="form-label">
                                    Username <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control custom-input"
                                    defaultValue={ticketSingleData?.userName}
                                    readOnly
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Issue Type <span className="text-danger">*</span>
                                </label>

                                <input
                                    type="text"
                                    className="form-control custom-input"
                                    defaultValue={ticketSingleData?.issueType}
                                    readOnly
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Description <span className="text-danger">*</span>
                                </label>

                                <textarea
                                    rows="4"
                                    className="form-control custom-input"
                                    defaultValue={ticketSingleData?.description}
                                    readOnly
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Ticket Status <span className="text-danger">*</span>
                                </label>
                                <select
                                    name='statusId'
                                    value={editData.statusId}
                                    onChange={(e) => seteditData({
                                        ...editData,
                                        statusId: e.target.value
                                    })}
                                    className="form-select custom-input"
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions && statusOptions.map((status, index) => (
                                        <option key={index} value={status.id}>
                                            {status.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    Admin Comment
                                </label>

                                <textarea
                                    rows="4"
                                    defaultValue={ticketSingleData?.adminDescription}
                                    className="form-control custom-input"
                                    onChange={(e) => seteditData({
                                        ...editData,
                                        description: e.target.value || "-"
                                    })}
                                ></textarea>
                            </div>

                            <hr />

                            <div className="text-end">

                                <button
                                    className="btn btn-light btn-cancel me-3"

                                >
                                    Cancel
                                </button>

                                <button type='submit' className="btn btn-save">
                                    Save
                                </button>

                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </>

    )
}

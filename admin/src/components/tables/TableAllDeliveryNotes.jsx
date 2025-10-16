import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css";
import { useNavigate } from "react-router-dom";

const TableAllDeliveryNotes = () => {
    const [deliverynotes, setDeliverynotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const type = localStorage.getItem("type");
    const Eid = localStorage.getItem("EID");

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        filterBySearch(searchTerm);
    }, [searchTerm, deliverynotes]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const endpoint = type === "ADMIN"
                ? "http://localhost:5001/api/admin/main/alldeliverynotes"
                : `http://localhost:5001/api/admin/main/alldeliverynotes-stid?eid=${Eid}`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setDeliverynotes(data);
                setFilteredNotes(data);
            } else {
                setDeliverynotes([]);
                setFilteredNotes([]);
                setError("No deliveries available.");
            }
        } catch (error) {
            console.error("Error fetching deliveries:", error);
            setError("Error fetching deliveries.");
            setDeliverynotes([]);
            setFilteredNotes([]);
        } finally {
            setLoading(false);
        }
    };

    const filterBySearch = (term) => {
        if (!term) {
            setFilteredNotes(deliverynotes);
            return;
        }

        const lowerTerm = term.toLowerCase();

        const filtered = deliverynotes.filter(note =>
            (note.billNumbers || []).some(bill =>
                bill.toLowerCase().includes(lowerTerm)
            )
        );

        // Sort by first bill number
        filtered.sort((a, b) => {
            const aFirst = (a.billNumbers?.[0] || "").toLowerCase();
            const bFirst = (b.billNumbers?.[0] || "").toLowerCase();
            return aFirst.localeCompare(bFirst);
        });

        setFilteredNotes(filtered);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const handleView = (delNoID) => {
        if (type === "ADMIN") {
            navigate(`/deliveryNote-detail/${delNoID}`);
        } else if (type === "DRIVER") {
            navigate(`/deliveryNote-detail-drive/${delNoID}`);
        }
    };

    return (
        <div className="table-container">
            <h4 className="table-title">All Deliveries</h4>

            {/* 🔍 Search Bar */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search by Bill Number..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Delivery Note ID</th>
                            <th>Delivery Date</th>
                            <th>Driver Name</th>
                            <th>District</th>
                            <th>Bill Numbers</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="loading-text text-center">Loading...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="6" className="error-text text-center">{error}</td>
                            </tr>
                        ) : filteredNotes.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-items-message text-center">No matching deliveries</td>
                            </tr>
                        ) : (
                            filteredNotes.map((delivery) => (
                                <tr key={delivery.delNoID}>
                                    <td>{delivery.delNoID}</td>
                                    <td>{formatDate(delivery.date)}</td>
                                    <td>{delivery.driverName}</td>
                                    <td>{delivery.district}</td>
                                    <td>{(delivery.billNumbers || []).join(", ")}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="view-btn"
                                            onClick={() => handleView(delivery.delNoID)}
                                        >
                                            👁️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableAllDeliveryNotes;

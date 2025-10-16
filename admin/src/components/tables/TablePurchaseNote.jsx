import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../style/TableThree.css";

const TablePurchaseNote = () => {
    const [notes, setNotes] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    // 🔍 Filter whenever search query or date range changes
    useEffect(() => {
        filterOrders();
    }, [searchQuery, startDate, endDate, notes]);

    const fetchNotes = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/purchase-notes/unpaid");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch orders");
            }

            setNotes(data.data);
            setFilteredOrders(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        // If backend returns YYYY-MM-DD, this already works
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj)) return dateStr;
        return dateObj.toISOString().split("T")[0];
    };

    const handleViewOrder = (noteId) => {
        navigate(`/purchase-detail/${noteId}`);
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Are you sure you want to delete this purchase note?")) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/deletePurchase/${noteId}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (response.ok) {
                toast.success("✅ Purchase note deleted successfully");
                fetchNotes(); // Refresh list
            } else {
                alert(result.message || "Failed to delete purchase note.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Server error while deleting purchase note.");
        }
    };

    // 🧠 Main filtering logic (by search + date range)
    const filterOrders = () => {
        let filtered = [...notes];

        // Search filter
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((note) =>
                note.noteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Date range filter
        if (startDate) {
            filtered = filtered.filter((note) => new Date(note.date) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter((note) => new Date(note.date) <= new Date(endDate));
        }

        setFilteredOrders(filtered);
    };

    return (
        <div className="table-container">
            <h4 className="table-title">Purchase Notes</h4>

            {/* Date Range Picker */}
            <div style={{ marginBottom: "15px" }}>
                <label>
                    Start Date:{" "}
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label style={{ marginLeft: "20px" }}>
                    End Date:{" "}
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
            </div>

            <input
                type="text"
                placeholder="Search by Note ID or Supplier name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Note ID</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="loading-text text-center">Loading orders...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="error-text text-center">{error}</td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data text-center">No issued orders found</td>
                            </tr>
                        ) : (
                            filteredOrders.map((note) => (
                                <tr key={note.noteId}>
                                    <td>{note.noteId}</td>
                                    <td>{formatDateForInput(note.date)}</td>
                                    <td>{note.supplierId} - {note.supplierName}</td>
                                    <td>{note.total}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewOrder(note.noteId)}
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteNote(note.noteId)}
                                        >
                                            🗑️
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

export default TablePurchaseNote;

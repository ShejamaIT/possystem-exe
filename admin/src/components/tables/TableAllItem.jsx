import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css";
import { useNavigate } from "react-router-dom";

const TableAllItem = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restockMessage, setRestockMessage] = useState("");

    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminContact, setAdminContact] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitems");
            const data = await response.json();

            if (data.length > 0) {
                setItems(data);
                setFilteredItems(data);
                setError(null);
            } else {
                setItems([]);
                setFilteredItems([]);
                setError("No items available.");
            }
        } catch (error) {
            setItems([]);
            setFilteredItems([]);
            setError("Error fetching items.");
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewItem = (itemId) => {
        navigate(`/item-detail/${itemId}`);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = items.filter(
            (item) =>
                item.I_Id.toString().toLowerCase().includes(query) ||
                item.I_name.toLowerCase().includes(query)
        );

        setFilteredItems(filteredData);
    };

    // 🔐 Show modal before restock
    const handleAutoRestockClick = () => {
        setShowAdminModal(true);
    };

    // 🔒 Admin authentication then proceed to auto restock
    const handleAdminLogin = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/admin-pass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contact: adminContact,
                    password: adminPassword,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setShowAdminModal(false);
                setAdminContact("");
                setAdminPassword("");
                runAutoRestock(); // Proceed with restock if login successful
            } else {
                alert("Invalid admin credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Admin login failed");
        }
    };

    // 🔄 Actual restock logic
    const runAutoRestock = async () => {
        setRestockMessage("Processing auto restock...");
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/auto-restock", {
                method: "GET",
            });

            const result = await response.json();

            if (result.success) {
                setRestockMessage(result.message || "Auto restock completed successfully.");
                fetchItems();
            } else {
                setRestockMessage(result.message || "Auto restock failed.");
            }
        } catch (error) {
            console.error("Error running auto restock:", error);
            setRestockMessage("Error running auto restock.");
        }
    };

    return (
        <div className="table-container">
            <h4 className="table-title">All Items</h4>

            {/* 🔍 Search Box */}
            <input
                type="text"
                placeholder="Search by Item ID or Name..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            {/* 🔄 Auto Restock Button */}
            <div className="action-bar">
                <button className="restock-btn" onClick={handleAutoRestockClick}>
                    🔄 Auto Restock
                </button>
                {restockMessage && <p className="restock-message">{restockMessage}</p>}
            </div>

            {/* 🔐 Admin Confirmation Modal */}
            {showAdminModal && (
                <div className="modal-overlay">
                    <div className="receipt-modal" style={{ width: 350, padding: 20 }}>
                        <h3>Admin Authentication Required</h3>
                        <input
                            placeholder="Admin Contact"
                            value={adminContact}
                            onChange={(e) => setAdminContact(e.target.value)}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleAdminLogin} className="print-btn">Confirm</button>
                            <button onClick={() => setShowAdminModal(false)} className="close-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Item Id</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>All Quantity</th>
                            <th>Available Quantity</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="loading-text text-center">Loading...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="8" className="error-text text-center">{error}</td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="no-items-message text-center">No items found</td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item.I_Id}>
                                    <td>{item.I_Id}</td>
                                    <td>{item.I_name}</td>
                                    <td>Rs.{item.price}</td>
                                    <td>{item.stockQty}</td>
                                    <td>{item.availableQty}</td>
                                    <td>{item.descrip}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewItem(item.I_Id)}
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

export default TableAllItem;

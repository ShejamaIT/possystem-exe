import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TableAllItem = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [restockMessage, setRestockMessage] = useState("");
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminContact, setAdminContact] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [showBookedOrdersModal, setShowBookedOrdersModal] = useState(false);
    const [selectedItemOrders, setSelectedItemOrders] = useState([]);
    const [selectedItemName, setSelectedItemName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitems");
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setItems(data);
                setFilteredItems(data);
                setError(null);
            } else {
                setItems([]);
                setFilteredItems([]);
                setError("No items available.");
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            setError("Error fetching items.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/categories");
            const data = await response.json();
            if (Array.isArray(data.data)) {
                setCategories(data.data);
            } else {
                setCategories([]);
            }
        } catch (err) {
            toast.error("Failed to load categories.");
        }
    };

    const handleCategoryChange = (event) => {
        const selected = event.target.value;
        setSelectedCategory(selected);

        if (selected === "") {
            setFilteredItems(items);
        } else {
            const filtered = items.filter((item) => item.type === selected);
            setFilteredItems(filtered);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = items.filter(
            (item) =>
                (item.I_Id?.toLowerCase().includes(query) ||
                    item.I_name?.toLowerCase().includes(query)) &&
                (selectedCategory ? item.type === selectedCategory : true)
        );

        setFilteredItems(filteredData);
    };

    const handleViewItem = (itemId) => {
        navigate(`/item-detail/${itemId}`);
    };

    const handleViewBookedOrders = (item) => {
        if (item.bookedOrders && item.bookedOrders.length > 0) {
            setSelectedItemOrders(item.bookedOrders);
            setSelectedItemName(item.I_name);
            setShowBookedOrdersModal(true);
        } else {
            alert("No booked orders for this item.");
        }
    };

    const handleAutoRestockClick = () => {
        setShowAdminModal(true);
    };

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
                runAutoRestock();
            } else {
                alert("Invalid admin credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Admin login failed");
        }
    };

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

            {/* 🔹 Filter Bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                }}
            >
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "180px",
                        fontSize: "14px",
                    }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name} ({cat.itemCount})
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Search by Item ID or Name..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                    style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                    }}
                />
            </div>

            <div className="action-bar">
                <button className="restock-btn" onClick={handleAutoRestockClick}>
                    🔄 Auto Restock
                </button>
                {restockMessage && <p className="restock-message">{restockMessage}</p>}
            </div>

            {/* 🔹 Table */}
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Item Id</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>All Quantity</th>
                            <th>Booked Quantity</th>
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
                                    <td>
                                        {item.bookedQty > 0 ? (
                                            <button
                                                className="view-btn"
                                                onClick={() => handleViewBookedOrders(item)}
                                            >
                                                {item.bookedQty} 🔍
                                            </button>
                                        ) : (
                                            item.bookedQty
                                        )}
                                    </td>
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

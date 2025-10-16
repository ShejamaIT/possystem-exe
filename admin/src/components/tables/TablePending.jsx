import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/TableThree.css";

const TablePending = ({ refreshKey }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedType, setSelectedType] = useState("Walking");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();
    const userType = localStorage.getItem("type");

    // Fetch all orders initially or when refreshKey changes
    useEffect(() => {
        fetchOrders();
        // ✅ reset filters when switching tab
        setStartDate("");
        setEndDate("");
        setSearchQuery("");
    }, [refreshKey]);

    // Apply filters whenever inputs change
    useEffect(() => {
        applyFilters();
    }, [searchQuery, selectedType, orders, startDate, endDate]);

    // ✅ reset date + search when switching Walking/On-site
    useEffect(() => {
        setStartDate("");
        setEndDate("");
        setSearchQuery("");
    }, [selectedType]);

    const fetchOrders = async () => {
        setLoading(true);
        const type = userType;
        const Eid = localStorage.getItem("EID");

        try {
            const endpoint =
                type === "ADMIN"
                    ? "http://localhost:5001/api/admin/main/orders-pending"
                    : `http://localhost:5001/api/admin/main/orders-pending-stid?eid=${Eid}`;

            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch`);

            const data = await response.json();
            setOrders(data.data || []);
        } catch (err) {
            setError(err.message || "Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) =>
        new Intl.DateTimeFormat("en-GB").format(new Date(dateString));

    const handleViewOrder = (orderId) => {
        navigate(`/order-detail/${orderId}`);
    };

    const applyFilters = () => {
        const query = searchQuery.toLowerCase();

        const filtered = orders.filter((order) => {
            const matchesType = order.ordertype === selectedType;

            // ✅ filter by date range if selected
            const orderDate = new Date(order.orDate);
            const matchesDate =
                (!startDate || orderDate >= new Date(startDate)) &&
                (!endDate || orderDate <= new Date(endDate));

            const contact1 = order.contact1 ? order.contact1.toString() : "";
            const contact2 = order.contact2 ? order.contact2.toString() : "";
            const stId = order.stID ? order.stID.toString() : "";
            const bill = order.billNumber ? order.billNumber.toString() : "";
            const employeeName = order.employeeName ? order.employeeName.toLowerCase() : "";

            const matchesSearch =
                order.OrID.toString().toLowerCase().includes(query) ||
                contact1.toLowerCase().includes(query) ||
                contact2.toLowerCase().includes(query) ||
                bill.toLowerCase().includes(query) ||
                (userType === "ADMIN" && stId.toLowerCase().includes(query)) ||
                (userType === "ADMIN" && employeeName.includes(query));

            return matchesType && matchesDate && matchesSearch;
        });

        setFilteredOrders(filtered);
    };

    return (
        <div className="table-container">
            <h4 className="table-title">Pending Orders</h4>

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

            {/* Order Type Radio */}
            <div style={{ marginBottom: "15px" }}>
                <label style={{ marginRight: "20px" }}>
                    <input
                        type="radio"
                        value="Walking"
                        checked={selectedType === "Walking"}
                        onChange={(e) => setSelectedType(e.target.value)}
                    />
                    Walking Orders
                </label>
                <label>
                    <input
                        type="radio"
                        value="On-site"
                        checked={selectedType === "On-site"}
                        onChange={(e) => setSelectedType(e.target.value)}
                    />
                    On-site Orders
                </label>
            </div>

            {/* Search Box */}
            <input
                type="text"
                placeholder={`Search by Order ID, Contact${userType === "ADMIN" ? ", Staff ID, or Employee" : ""}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />

            {loading ? (
                <p className="loading-text">Loading orders...</p>
            ) : error ? (
                <p className="error-text">Error: {error}</p>
            ) : (
                <div className="table-wrapper">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Order Date</th>
                                <th>Expected Date</th>
                                <th>Customer</th>
                                <th>Bill Number</th>
                                <th>Delivery Status</th>
                                <th>Total Price</th>
                                {userType === "ADMIN" && <th>Staff ID</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="no-data">
                                        No {selectedType.toLowerCase()} orders found
                                        {startDate && endDate ? " in selected range." : "."}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.OrID}>
                                        <td>{order.OrID}</td>
                                        <td>{formatDate(order.orDate)}</td>
                                        <td>{formatDate(order.expectedDeliveryDate)}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.billNumber}</td>
                                        <td>{order.dvStatus}</td>
                                        <td>Rs.{order.totPrice.toFixed(2)}</td>
                                        {userType === "ADMIN" && <td>{order.stID || "N/A"}</td>}
                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() => handleViewOrder(order.OrID)}
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
            )}
        </div>
    );
};

export default TablePending;

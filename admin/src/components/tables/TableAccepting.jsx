import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/TableThree.css";

const TableAccepting = ({ refreshKey }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderType, setOrderType] = useState("Walking"); // Default
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();
    const userType = localStorage.getItem("type");

    // Fetch orders
    useEffect(() => {
        fetchOrders();
        // ✅ reset filters when switching tabs
        setSearchQuery("");
        setStartDate("");
        setEndDate("");
    }, [refreshKey]);

    // Apply filters whenever inputs change
    useEffect(() => {
        applyFilters();
    }, [orderType, searchQuery, orders, startDate, endDate]);

    // ✅ reset filters when switching order type
    useEffect(() => {
        setSearchQuery("");
        setStartDate("");
        setEndDate("");
    }, [orderType]);

    const fetchOrders = async () => {
        setLoading(true);
        const Eid = localStorage.getItem("EID");

        try {
            const endpoint =
                userType === "ADMIN"
                    ? "http://localhost:5001/api/admin/main/orders-accepting"
                    : `http://localhost:5001/api/admin/main/orders-accepting-stid?eid=${Eid}`;

            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(data);

            if (!response.ok || !data?.data?.bookedOrders) {
                throw new Error(data.message || "Failed to fetch orders");
            }

            setOrders(Array.isArray(data.data.bookedOrders) ? data.data.bookedOrders : []);
        } catch (err) {
            setError(err.message || "Something went wrong");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        if (!Array.isArray(orders)) {
            setFilteredOrders([]);
            return;
        }

        const query = searchQuery.toLowerCase();

        const filtered = orders.filter((order) => {
            const matchesType = order.ordertype === orderType;

            // ✅ date filter
            const orderDate = new Date(order.orDate);
            const matchesDate =
                (!startDate || orderDate >= new Date(startDate)) &&
                (!endDate || orderDate <= new Date(endDate));

            const contact1 = order.contact1 ? order.contact1.toString() : "";
            const contact2 = order.contact2 ? order.contact2.toString() : "";
            const stId = order.sT_ID ? order.sT_ID.toString() : "";
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

    const handleViewOrder = (orderId) => {
        navigate(`/accept-order-detail/${orderId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    return (
        <div className="table-container">
            <h4 className="table-title">Booked Orders</h4>

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
                        name="orderType"
                        value="Walking"
                        checked={orderType === "Walking"}
                        onChange={() => setOrderType("Walking")}
                    />
                    Walking Orders
                </label>
                <label>
                    <input
                        type="radio"
                        name="orderType"
                        value="On-site"
                        checked={orderType === "On-site"}
                        onChange={() => setOrderType("On-site")}
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

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Order Type</th>
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
                        {loading ? (
                            <tr>
                                <td colSpan="11" className="loading-text text-center">
                                    Loading orders...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="11" className="error-text text-center">{error}</td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="no-data text-center">
                                    No {orderType} orders found
                                    {startDate && endDate ? " in selected range." : "."}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.OrID}>
                                    <td>{order.OrID}</td>
                                    <td>{formatDate(order.orDate)}</td>
                                    <td>{order.ordertype}</td>
                                    <td>{formatDate(order.expectedDeliveryDate)}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.billNumber}</td>
                                    <td>{order.dvStatus}</td>
                                    <td>Rs.{order.totPrice.toFixed(2)}</td>
                                    {userType === "ADMIN" && <td>{order.stID || "N/A"}</td>}
                                    <td className="action-buttons">
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
        </div>
    );
};

export default TableAccepting;

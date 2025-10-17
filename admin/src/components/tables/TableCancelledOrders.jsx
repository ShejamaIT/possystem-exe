import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/TableThree.css";

const TableCanceled = ({ refreshKey }) => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("Walking"); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userType = localStorage.getItem("type");
    const Eid = localStorage.getItem("EID");

    useEffect(() => {
        fetchOrders();
        setSearchQuery("");  // Reset search on refresh
    }, [refreshKey]);

    useEffect(() => {
        applyFilters();
    }, [orders, searchQuery, selectedType]);

    useEffect(() => {
        setSearchQuery(""); // Reset search when type changes
    }, [selectedType]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const endpoint =
                userType === "ADMIN"
                    ? "http://localhost:5001/api/admin/main/orders-canceled"
                    : `http://localhost:5001/api/admin/main/orders-canceled-stid?eid=${Eid}`;

            const response = await fetch(endpoint);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch orders");

            setOrders(Array.isArray(data.data) ? data.data : []);
            setFilteredOrders(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            setError(err.message);
            setOrders([]);
            setFilteredOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        const query = searchQuery.toLowerCase();

        const filtered = orders.filter((order) => {
            const matchesType = order.ordertype === selectedType;

            const contact1 = order.contact1 ? order.contact1.toString() : "";
            const contact2 = order.contact2 ? order.contact2.toString() : "";
            const stId = order.stID ? order.stID.toString() : "";
            const employeeName = order.employeeName ? order.employeeName.toLowerCase() : "";

            const matchesSearch =
                order.OrID.toString().toLowerCase().includes(query) ||
                contact1.toLowerCase().includes(query) ||
                contact2.toLowerCase().includes(query) ||
                (userType === "ADMIN" && stId.toLowerCase().includes(query)) ||
                (userType === "ADMIN" && employeeName.includes(query));

            return matchesType && matchesSearch;
        });

        setFilteredOrders(filtered);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const handleViewOrder = (orderId) => {
        navigate(`/cancel-order-detail/${orderId}`);
    };

    return (
        <div className="table-container">
            <h4 className="table-title">Canceled Orders</h4>

            {/* Order Type */}
            <div style={{ marginBottom: "15px" }}>
                <label style={{ marginRight: "20px" }}>
                    <input
                        type="radio"
                        value="Walking"
                        checked={selectedType === "Walking"}
                        onChange={(e) => setSelectedType(e.target.value)}
                    />
                    Walking
                </label>
                <label>
                    <input
                        type="radio"
                        value="On-site"
                        checked={selectedType === "On-site"}
                        onChange={(e) => setSelectedType(e.target.value)}
                    />
                    On-site
                </label>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder={`Search by Order ID, Contact${userType === "ADMIN" ? ", Staff ID, or Employee" : ""}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />

            {/* Table */}
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Order Type</th>
                            <th>Expected Date</th>
                            <th>Customer</th>
                            <th>Order Status</th>
                            <th>Delivery Status</th>
                            <th>Total Price</th>
                            {userType === "ADMIN" && <th>Sales By</th>}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={userType === "ADMIN" ? "10" : "9"} className="loading-text text-center">
                                    Loading orders...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={userType === "ADMIN" ? "10" : "9"} className="error-text text-center">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={userType === "ADMIN" ? "10" : "9"} className="no-data text-center">
                                    No Canceled orders found
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
                                    <td>
                                        <span className={`status ${order.orStatus.toLowerCase()}`}>
                                            {order.orStatus}
                                        </span>
                                    </td>
                                    <td>{order.dvStatus}</td>
                                    <td>Rs.{order.totPrice.toFixed(2)}</td>
                                    {userType === "ADMIN" && <td>{order.stID || "N/A"}</td>}
                                    <td className="action-buttons">
                                        <button className="view-btn" onClick={() => handleViewOrder(order.OrID)}>
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

export default TableCanceled;

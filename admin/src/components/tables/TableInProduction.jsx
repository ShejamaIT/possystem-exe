import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditOrderModal from "../../pages/EditOrderModal"; // Import the modal component
import "../../style/inproduction.css";
import {toast} from "react-toastify"; // Import CSS

const TableInproduction = ({ refreshKey }) => {
    const [orders, setOrders] = useState([]);
    const [item, setItem] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [refreshKey]);

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/orders-inproduction");
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch orders");
            }
            setOrders(data.data); // Assuming the orders are in data.data
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    // Open modal and set selected order
    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setItem(order.I_Id);
        setShowModal(true);
    };

    // Handle form submission (Update order status)
    const handleSubmit = async (formData) => {
        const { newStatus, isOrderComplete, rDate, recCount, cost,delivery ,Invoice} = formData;
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/update-stock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    p_ID: selectedOrder.p_ID,
                    rDate,
                    recCount,
                    cost,
                    item: item,
                     delivery,Invoice
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Stock updated successfully!");
                // Update the order list to reflect changes
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.p_ID === selectedOrder.p_ID
                            ? { ...order, status: data.updatedStatus, qty: data.remainingQty }
                            : order
                    )
                );

                setShowModal(false); // Close the modal
                setTimeout(() => {
                    window.location.reload(); // Auto-refresh the page
                }, 1000);
            } else {
                alert(data.error || "Failed to update stock.");
            }
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Server error. Please try again.");
        }
    };

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Item ID</th>
                        <th>Supplier ID</th>
                        <th>Quantity</th>
                        <th>Expected Date</th>
                        <th>Special Note</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="loading-text text-center">Loading orders...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="8" className="error-text text-center">{error}</td>
                        </tr>
                    ) : orders.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="no-data text-center">No orders for production</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.p_ID}>
                                <td>{order.p_ID}</td>
                                <td>{order.I_Id}</td>
                                <td>{order.s_ID}</td>
                                <td>{order.qty}</td>
                                <td>{formatDate(order.expectedDate)}</td>
                                <td>{order.specialNote}</td>
                                <td>{order.status}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEditClick(order)}>✏️</button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Popup Modal */}
            {showModal && selectedOrder && (
                <EditOrderModal
                    selectedOrder={selectedOrder}
                    setShowModal={setShowModal}
                    handleSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default TableInproduction;

import React, { useState } from "react";
import "../style/deleiverynote.css";
import { toast } from "react-toastify";

const MakeGatePassNow = ({ selectedOrders, setShowModal, handleGatepassUpdate }) => {
    console.log(selectedOrders);
    const order = Array.isArray(selectedOrders) ? selectedOrders[0] : selectedOrders;
    console.log(order);
    const [vehicleId, setVehicleId] = useState("");

    const handlePrintAndSubmit = () => {
        if (!vehicleId.trim()) {
            toast.error("Please provide a valid Vehicle ID.");
            return;
        }

        handleGatepassUpdate({
            orders: [order], // sent as an array for backend compatibility
            vehicleId,
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content make-delivery-note">
                <h2 className="invoice-title">Make Gate Pass</h2>

                {/* Order Info Table */}
                <div className="invoice-section">
                    <table className="receipt-table">
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Total</th>
                            <th>Advance</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{order.orderId}</td>
                            <td>{order.customerName}</td>
                            <td>Rs.{order.totalPrice}</td>
                            <td>Rs.{order.advance}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Vehicle ID Input */}
                <div className="delivery-details">
                    <div className="input-group">
                        <label><strong>Vehicle ID:</strong></label>
                        <input
                            type="text"
                            placeholder="Enter vehicle ID"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-buttons">
                    <button className="print-btn" onClick={handlePrintAndSubmit}>Save</button>
                    <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MakeGatePassNow;

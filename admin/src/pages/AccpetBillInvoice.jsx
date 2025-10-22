import React, { useState } from "react";
import html2canvas from "html2canvas";
import "../style/invoice.css"; // Make sure this file includes the print styles

const BillInvoice = ({ selectedOrder, setShowModal1, handleSubmit }) => {
    const invoiceDate = new Date().toLocaleDateString();
    const [deliveryCharge, setDeliveryCharge] = useState(selectedOrder.deliveryCharge);
    const [previousDeliveryCharge, setPreviousDeliveryCharge] = useState(selectedOrder.deliveryCharge);
    const [discount, setDiscount] = useState(selectedOrder.discount);
    const [specialdiscount , setSpecialDiscount] = useState(selectedOrder.specialdiscount);
    const [advance, setAdvance] = useState(selectedOrder.advance);
    const [nowPay, setNowPay] = useState(0);
    // const [isPickup, setIsPickup] = useState(false);
    const [isPickup, setIsPickup] = useState(selectedOrder.deliveryStatus === "Pick up");

    const calculateTotal = (item) => item.quantity * (item.unitPrice -item.discount);
    const subtotal = selectedOrder.items.reduce((sum, item) => sum + calculateTotal(item), 0);
    const validAdvance = advance ? Number(advance) : 0;
    const totalAdvance = validAdvance + Number(nowPay);
    const netTotal = Number(subtotal) + (isPickup ? 0 : Number(deliveryCharge)) - Number(discount) - Number(specialdiscount);
    const balance = netTotal - totalAdvance;

    const handlePickupChange = () => {
        if (!isPickup) {
            setPreviousDeliveryCharge(deliveryCharge);
            setDeliveryCharge(0);
        } else {
            setDeliveryCharge(previousDeliveryCharge);
        }
        setIsPickup(!isPickup);
    };

    const handlePrintAndSubmit = () => {
        handleSubmit({
            orID: selectedOrder.orderId,
            updatedDeliveryCharge: isPickup ? 0 : Number(deliveryCharge),
            updatedcouponeDiscount: Number(discount),
            updatespecialDiscount : Number(specialdiscount),
            previousAdvance: validAdvance,
            addedAdvance: Number(nowPay),
            totalAdvance: totalAdvance,
            netTotal: netTotal,
            balance: balance,
            isPickup: isPickup
        });

        // window.print(); // This will now hide the buttons when printing
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content bill-invoice">
                <h2 className="invoice-title">Invoice</h2>

                <div className="invoice-section">
                    <p><strong>Order ID:</strong> #{selectedOrder.orderId}</p>
                    <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                    <p><strong>Invoice Date:</strong> {invoiceDate}</p>
                    <p><strong>Contact:</strong> {selectedOrder.phoneNumber || selectedOrder.customerPhone}</p>
                </div>

                <table className="invoice-table">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price (Rs.)</th>
                        <th>Discount (Rs.)</th>
                        <th>Total (Rs.)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice.toFixed(2)}</td>
                            <td>{item.discount.toFixed(2)}</td>
                            <td>{calculateTotal(item).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="invoice-summary">
                    <p><strong>Subtotal:</strong> Rs. {subtotal.toFixed(2)}</p>

                    <div className="invoice-summary-item">
                        <label><strong>Delivery Price:</strong></label>
                        <p>
                            <input type="checkbox" checked={isPickup} onChange={handlePickupChange} />
                            Set as Pick up
                        </p>
                        <input
                            type="text"
                            value={isPickup ? 0 : deliveryCharge}
                            disabled={isPickup || selectedOrder.deliveryStatus === "Pick up"} // Disabled if pickup
                            onChange={(e) => setDeliveryCharge(e.target.value)}
                        />

                    </div>

                    <div className="invoice-summary-row">
                        <div className="invoice-summary-item">
                            <label><strong>Coupon Discount:</strong></label>
                            <input
                                type="text"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                        </div>
                        <div className="invoice-summary-item">
                            <label><strong>Special Discount:</strong></label>
                            <input
                                type="text"
                                value={specialdiscount}
                                onChange={(e) => setSpecialDiscount(e.target.value)}
                            />
                        </div>
                    </div>

                    <hr />
                    <p><strong>Net Total:</strong> Rs. {netTotal.toFixed(2)}</p>
                    <p><strong>Previous Advance:</strong> Rs. {validAdvance.toFixed(2)}</p>

                    <div className="invoice-summary-item">
                        <label><strong>Current Payment:</strong></label>
                        <input
                            type="text"
                            value={nowPay}
                            onChange={(e) => setNowPay(e.target.value)}
                        />
                    </div>

                    <p><strong>Total Advance:</strong> Rs. {totalAdvance.toFixed(2)}</p>
                    <p><strong>Balance:</strong> Rs. {balance.toFixed(2)}</p>
                </div>

                {/* Print & Close Buttons */}
                <div className="modal-buttons">
                    <button className="print-btn" onClick={handlePrintAndSubmit}>Save</button>
                    <button className="close-btn" onClick={() => setShowModal1(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default BillInvoice;

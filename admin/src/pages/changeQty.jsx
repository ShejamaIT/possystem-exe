import React, { useState, useEffect } from "react";
import "../style/invoice.css";

const ChangeQty = ({ selectedItem, setShowModal, handleSubmit2 }) => {
    const [quantity, setQuantity] = useState(selectedItem?.quantity || 1);
    const [orID, setOrID] = useState(selectedItem?.orId);
    const [updatedPrice, setUpdatedPrice] = useState(quantity * (selectedItem?.unitPrice || 0));

    // 🔄 Update when selectedItem changes
    useEffect(() => {
        if (selectedItem) {
            setQuantity(selectedItem.quantity || 1);
            setOrID(selectedItem.orId);
            setUpdatedPrice((selectedItem.quantity || 1) * (selectedItem.unitPrice || 0));
        }
    }, [selectedItem]);

    // ✍️ Handle quantity input change
    const handleQuantityChange = (e) => {
        let newQty = parseInt(e.target.value, 10) || 1;
        newQty = newQty < 1 ? 1 : newQty; // Prevent negative or zero quantity
        setQuantity(newQty);
        setUpdatedPrice((selectedItem.unitPrice || 0) * newQty);
    };

    // 💾 Save updated data
    const handleSave = () => {
        if (quantity < 1 || isNaN(quantity)) {
            alert("Please enter a valid quantity.");
            return;
        }

        handleSubmit2({
            orId: orID,
            itemId: selectedItem.itemId,
            newQuantity: quantity,
            updatedPrice: updatedPrice,
            booked: selectedItem.booked,
        });

        setShowModal(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="invoice-title">Change Request Qty</h2>
                <div className="invoice-section">
                    <p><strong>Item:</strong> {selectedItem.itemName}</p>
                    <div className="invoice-summary-item">
                        <label><strong>Requested Quantity:</strong></label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            max={selectedItem.stockQuantity}
                        />
                    </div>
                    <p><strong>Available Quantity:</strong> {selectedItem.availableQuantity}</p>
                    <p><strong>Booked Quantity:</strong> {selectedItem.bookedQuantity}</p>
                    <p><strong>Unit Price:</strong> Rs. {selectedItem.unitPrice}</p>
                    <p><strong>Updated Price:</strong> Rs. {updatedPrice}</p>
                </div>
                <div className="modal-buttons">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ChangeQty;

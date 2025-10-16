import React, { useState, useEffect } from "react";
import "../style/EditOrderModal.css"; // Import CSS file
import { Container, Row, Col, Table, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

const EditOrderModal = ({ selectedOrder, setShowModal, handleSubmit }) => {
    const [newStatus, setNewStatus] = useState(selectedOrder.status || "Incomplete");
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [rDate, setRDate] = useState("");
    const [recCount, setRecCount] = useState("");
    const [delivery, setDelivery] = useState("");
    const [Invoice, setInvoice] = useState("-");
    const [cost, setCost] = useState(""); // Initially empty

    // Update cost when selectedOrder changes
    useEffect(() => {
        if (selectedOrder.unit_cost) {
            setCost(selectedOrder.unit_cost); // Set unit cost when modal opens
        }
    }, [selectedOrder.unit_cost]);

    // Function to check order completion
    const checkOrderCompletion = () => {
        const qty = Number(selectedOrder.qty);
        const receivedQty = Number(recCount);

        if (receivedQty >= qty) {
            setIsOrderComplete(true);
            setNewStatus("Complete");
        } else {
            setIsOrderComplete(false);
            setNewStatus("Incomplete");
        }
    };

    // Effect to update status after state changes
    useEffect(() => {
        if (recCount) {
            checkOrderCompletion();
        }
    }, [recCount]);

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const finalCost = cost === String(selectedOrder.unit_cost) ? null : cost; // Send cost only if changed

        handleSubmit({
            newStatus,
            isOrderComplete,
            rDate,
            recCount,
            cost: finalCost,
            delivery,
            Invoice
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    return (
        <Container>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h4>Receive Stock Update</h4>
                    <form onSubmit={handleFormSubmit}>

                        <Row>
                            <Col lg={6}>
                                <label><strong>Order ID:</strong></label>
                                <p>{selectedOrder.p_ID}</p>
                            </Col>
                            <Col lg={6}>
                                <label><strong>Invoice ID:</strong></label>
                                <input
                                    type="text"
                                    value={Invoice}
                                    onChange={(e) => setInvoice(e.target.value)}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <label><strong>Expected Date:</strong></label>
                                <p>{formatDate(selectedOrder.expectedDate)}</p>
                            </Col>
                            <Col lg={6}>
                                <label><strong>Received Date:</strong></label>
                                <input type="date" value={rDate} onChange={(e) => setRDate(e.target.value)} required />
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <label><strong>Received Item Cost:</strong></label>
                                <input
                                    type="text"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    required
                                />
                            </Col>
                            <Col lg={6}>
                                <label><strong>Delivery Charge:</strong></label>
                                <input
                                    type="text"
                                    value={delivery}
                                    onChange={(e) => setDelivery(e.target.value)}
                                    required
                                />
                            </Col>
                        </Row>


                        <Row>
                            <Col lg={6}>
                                <label><strong>Order Quatity:</strong></label>
                                <p>{selectedOrder.qty}</p>
                            </Col>
                            <Col lg={6}>
                                <label><strong>Received Count:</strong></label>
                                <input
                                    type="text"
                                    value={recCount}
                                    onChange={(e) => setRecCount(e.target.value)}
                                    min="1"
                                    required
                                />
                            </Col>
                        </Row>

                        <div className="checkbox-container">
                            <input type="checkbox" id="orderComplete" checked={isOrderComplete} readOnly />
                            <label htmlFor="orderComplete">Order Complete</label>
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </Container>

    );
};

export default EditOrderModal;

import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Button, Input, Table } from "reactstrap";
import "../style/orderDetailsUpdated.css";
import SelectedPurchasePaymentPopup from "./SelectedPurchasePaymentPopup";
import PurchaseNotePopup from "./purchaseNotePopup";

const SupplierPayment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [purchases, setPurchase] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [totalSelectedBalance, setTotalSelectedBalance] = useState(0);
    const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
    const [payLoading, setPayLoading] = useState(false);

    const togglePaymentPopup = () => setIsPaymentPopupOpen(!isPaymentPopupOpen);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const fetchOrder = async () => {
        if (!searchTerm.trim()) {
            toast.warning("Please enter a valid Supplier ID, Name, or Contact Number.");
            setError("Please enter a valid Supplier ID, Name, or Contact Number.");
            setPurchase([]);
            setSelectedSupplier(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `http://localhost:5001/api/admin/main/supplier/unpaid-purchase-notes?search=${encodeURIComponent(searchTerm)}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch purchase notes.");
            }

            const data = await response.json();
            console.log(data.purchaseNotes);

            if (!data.purchaseNotes || data.purchaseNotes.length === 0) {
                throw new Error("No unpaid purchase notes found for this supplier.");
            }

            setPurchase(data.purchaseNotes);
            setSelectedSupplier(data.supplierDetails);
            setSelectedOrders([]); // Clear previous selection
            setTotalSelectedBalance(0);
        } catch (err) {
            setError(err.message);
            setPurchase([]);
            setSelectedSupplier(null);
        } finally {
            setLoading(false);
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCheckboxChange = (order) => {
        setSelectedOrders((prevSelected) => {
            let updated;
            const isAlreadySelected = prevSelected.some((o) => o.orderId === order.purchaseId);

            if (isAlreadySelected) {
                updated = prevSelected.filter((o) => o.orderId !== order.purchaseId);
            } else {
                updated = [
                    ...prevSelected,
                    {
                        orderId: order.purchaseId,
                        netTotal: Number(order.total || 0) - Number(order.deliveryCharge || 0),
                        delivery: Number(order.deliveryCharge || 0),
                        fullTotal: Number(order.total || 0),
                        pay: Number(order.pay || 0),
                        balance: Number(order.balance || 0),
                        items: order.items,
                    },
                ];
            }

            const totalBalance = updated.reduce((sum, o) => sum + o.balance, 0);
            setTotalSelectedBalance(totalBalance);
            return updated;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allOrders = purchases.map((order) => ({
                orderId: order.purchaseId,
                netTotal: Number(order.total || 0) - Number(order.deliveryCharge || 0),
                delivery: Number(order.deliveryCharge || 0),
                fullTotal: Number(order.total || 0),
                pay: Number(order.pay || 0),
                balance: Number(order.balance || 0),
                items: order.items,
            }));

            setSelectedOrders(allOrders);
            const totalBalance = allOrders.reduce((sum, order) => sum + order.balance, 0);
            setTotalSelectedBalance(totalBalance);
        } else {
            setSelectedOrders([]);
            setTotalSelectedBalance(0);
        }
    };

    const handleSubmitSelectedPayments = async (payload) => {
        try {
            setPayLoading(true);
            console.log("Submitting payment payload:", payload);
            toast.success("Payment submitted!");
            fetchOrder();
        } catch (e) {
            console.error(e);
            toast.error("Failed to submit payment");
        } finally {
            setPayLoading(false);
        }
    };

    return (
        <Helmet title="Supplier Payments">
            <section className="order-section">
                <Container>
                    {/* Search Section */}
                    <Row className="mb-4">
                        <Col lg="6" className="mx-auto text-center">
                            <div className="search-box d-flex gap-2 justify-content-center">
                                <Input
                                    type="text"
                                    placeholder="Enter Supplier ID, Contact Number or Name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button color="primary" onClick={fetchOrder}>Search</Button>
                            </div>
                        </Col>
                    </Row>

                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-danger text-center">{error}</p>}

                    {/* Supplier Info */}
                    {!loading && !error && selectedSupplier && (
                        <Row className="mb-3">
                            <Col lg="8" className="mx-auto">
                                <div className="p-3 border rounded bg-light">
                                    <h5>Supplier Details</h5>
                                    <p><strong>ID:</strong> {selectedSupplier.supplierId}</p>
                                    <p><strong>Name:</strong> {selectedSupplier.supplierName}</p>
                                    <p><strong>Contact 1:</strong> {selectedSupplier.contact1}</p>
                                    <p><strong>Contact 2:</strong> {selectedSupplier.contact2}</p>
                                    <p><strong>Address:</strong> {selectedSupplier.address}</p>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* Orders Table */}
                    {!loading && !error && purchases.length > 0 && (
                        <Row>
                            <Col lg="12">
                                <Table bordered hover responsive className="order-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.length === purchases.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th>Purchase Note ID</th>
                                            <th>Date</th>
                                            <th>Item Total</th>
                                            <th>Delivery</th>
                                            <th>Invoice Total</th>
                                            <th>Paid</th>
                                            <th>Balance</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchases.map((order) => (
                                            <tr key={order.purchaseId}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOrders.some((o) => o.orderId === order.purchaseId)}
                                                        onChange={() => handleCheckboxChange(order)}
                                                    />
                                                </td>
                                                <td>{order.purchaseId}</td>
                                                <td>{order.receiveDate}</td>
                                                <td>{order.total - order.deliveryCharge}</td>
                                                <td>{order.deliveryCharge}</td>
                                                <td>{order.total}</td>
                                                <td>{order.pay}</td>
                                                <td>{order.balance}</td>
                                                <td>
                                                    <Button
                                                        color="info"
                                                        size="sm"
                                                        onClick={() => openOrderDetails(order)}
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {selectedOrders.length > 0 && (
                                    <>
                                        <div className="text-end mt-2">
                                            <h5>
                                                Total Selected Balance:{" "}
                                                <span className="text-primary">{totalSelectedBalance}</span>
                                            </h5>
                                        </div>
                                        <div className="text-end mt-3">
                                            <Button color="success" onClick={togglePaymentPopup}>
                                                Proceed to Payment
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Col>

                            {/* Popups */}
                            <PurchaseNotePopup
                                isOpen={isModalOpen}
                                toggle={toggleModal}
                                order={selectedOrder}
                            />
                            <SelectedPurchasePaymentPopup
                                isOpen={isPaymentPopupOpen}
                                toggle={togglePaymentPopup}
                                selectedOrders={selectedOrders}
                                selectedSupplier={selectedSupplier}
                                onSubmit={handleSubmitSelectedPayments}
                                loading={payLoading}
                            />
                        </Row>
                    )}
                </Container>
            </section>
        </Helmet>
    );
};

export default SupplierPayment;

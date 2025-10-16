import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Button, Input, Table } from "reactstrap";
import "../style/orderDetailsUpdated.css";
import SelectedOrdersPaymentPopup from "./SelectedOrdersPaymentPopup";
import OrderDetailsPopup from "./OrderDetailsPopup";

const CustomerPayment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]); // Track selected order objects
    const [selectedCustomer , setSeletedCustomer] = useState([]);
    const [totalSelectedBalance, setTotalSelectedBalance] = useState(0); // Track total balance
    const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const togglePaymentPopup = () => setIsPaymentPopupOpen(!isPaymentPopupOpen);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const fetchOrder = async () => {
  if (!searchTerm.trim()) {
    setError("Please enter a valid Customer ID or Contact Number.");
    setOrders([]);
    setSeletedCustomer([]);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const response = await fetch(
      `http://localhost:5001/api/admin/main/customer/unsettled-orders-details?search=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) throw new Error("Failed to fetch order details.");

    const data = await response.json();

    if (!data.orders || data.orders.length === 0) {
      throw new Error("No unsettled orders found for this customer.");
    }

    // ✅ Extract customer info from the first order
    const customerDetails = {
      customerId: data.orders[0].customerId,
      customerName: data.orders[0].customerName,
      contact1: data.orders[0].customerPhone,
      contact2: data.orders[0].customerOptionalPhone,
      address: data.orders[0].customerAddress,
    };

    setSeletedCustomer(customerDetails); // ✅ Set customer details
    setOrders(data.orders);
    setSelectedOrder(null);
    setSelectedOrders([]);
    setTotalSelectedBalance(0);
  } catch (err) {
    setError(err.message);
    setOrders([]);
    setSeletedCustomer([]); // Clear on error
  } finally {
    setLoading(false);
  }
};

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // Handle individual checkbox toggle
    const handleCheckboxChange = (order) => {
        setSelectedOrders((prevSelected) => {
            let updated;
            const isAlreadySelected = prevSelected.some((o) => o.orderId === order.orderId);

            if (isAlreadySelected) {
                updated = prevSelected.filter((o) => o.orderId !== order.orderId);
            } else {
                updated = [
                    ...prevSelected,
                    {
                        orderId: order.orderId,
                        billTotal: Number(order.totalPrice || 0),
                        advance: Number(order.advance || 0),
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

    // Handle Select All checkbox
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Keep full order details
            const allOrders = orders.map((order) => ({
                ...order,
                billTotal: Number(order.totalPrice || 0),
                advance: Number(order.advance || 0),
                balance: Number(order.balance || 0),
            }));

            setSelectedOrders(allOrders);

            // Calculate total balance
            const totalBalance = allOrders.reduce((sum, order) => sum + order.balance, 0);
            setTotalSelectedBalance(totalBalance);
        } else {
            setSelectedOrders([]);
            setTotalSelectedBalance(0);
        }
    };

    const handleSubmitSelectedPayments = async (payload) => {
        // payload = { totalToPay, totalSelectedBalance, orders: [{ orderId, billTotal, advance, balance, payAmount }] }
        try {
            setPayLoading(true);
            toast.success("Payment submitted!");
            // Optionally refresh orders
            fetchOrder();
        } catch (e) {
            console.error(e);
            toast.error("Failed to submit payment");
        } finally {
            setPayLoading(false);
        }
    };

    return (
        <Helmet title="Order Details">
            <section className="order-section">
                <Container>
                    {/* Search Section */}
                    <Row className="mb-4">
                        <Col lg="6" className="mx-auto text-center">
                            <div className="search-box d-flex gap-2 justify-content-center">
                                <Input
                                    type="text"
                                    placeholder="Enter Customer ID or Contact Number"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button color="primary" onClick={fetchOrder}>Search</Button>
                            </div>
                        </Col>
                    </Row>

                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-danger text-center">{error}</p>}

                    {/* Orders Table */}
                    {!loading && !error && orders.length > 0 && (
                        <Row>
                            <Col lg="12">
                                <Table bordered hover responsive className="order-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.length === orders.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Net Total</th>
                                            <th>Bill Total</th>
                                            <th>Advance</th>
                                            <th>Balance</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.orderId}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOrders.some((o) => o.orderId === order.orderId)}
                                                        onChange={() => handleCheckboxChange(order)}
                                                    />
                                                </td>
                                                <td>{order.orderId}</td>
                                                <td>{order.orderDate}</td>
                                                <td>{order.netTotal}</td>
                                                <td>{order.totalPrice}</td>
                                                <td>{order.advance}</td>
                                                <td>{order.balance}</td>
                                                <td>{order.orderStatus}</td>
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

                                {/* Show Total Selected Balance */}
                                {selectedOrders.length > 0 && (
                                    <div className="text-end mt-2">
                                        <h5>
                                            Total Selected Balance: <span className="text-primary">{totalSelectedBalance}</span>
                                        </h5>
                                    </div>
                                )}
                                {selectedOrders.length > 0 && (
                                    <div className="text-end mt-3">
                                        <Button color="success" onClick={togglePaymentPopup}>
                                        Proceed to Payment
                                        </Button>
                                    </div>
                                )}

                            </Col>

                            <OrderDetailsPopup
                                isOpen={isModalOpen}
                                toggle={toggleModal}
                                order={selectedOrder}
                            />
                            <SelectedOrdersPaymentPopup
                                isOpen={isPaymentPopupOpen}
                                toggle={togglePaymentPopup}
                                selectedOrders={selectedOrders}
                                selecetdCustomer={selectedCustomer}
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

export default CustomerPayment;

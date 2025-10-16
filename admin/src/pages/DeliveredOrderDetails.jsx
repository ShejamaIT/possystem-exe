import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Button } from "reactstrap";
import NavBar from "./NavBar/Navbar";
import "../style/orderDetailsUpdated.css"; // updated CSS file

const DeliverdOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/issued-order-details?orID=${id}`);
            if (!response.ok) throw new Error("Failed to fetch order details.");
            const data = await response.json();
            setOrder(data.order);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handlePrintPaymentHistory = () => {
        const printWindow = window.open("", "Print Window", "width=600,height=600");
        printWindow.document.write("<h3>Payment History</h3>");
        if (order.paymentHistory?.length > 0) {
            order.paymentHistory.forEach(payment => {
                printWindow.document.write(`
                    <p><strong>Payment ID:</strong> ${payment.paymentId}</p>
                    <p><strong>Amount Paid:</strong> Rs. ${payment.amount}</p>
                    <p><strong>Payment Date:</strong> ${payment.paymentDate}</p>
                    <hr />
                `);
            });
        } else {
            printWindow.document.write("<p>No payments made yet.</p>");
        }
        printWindow.document.close();
        printWindow.print();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!order) return <p>Order not found</p>;

    return (
        <Helmet title={`Order Details - ${order.orderId}`}>
            <section className="order-section">
                <NavBar />
                <Container>
                    <Row>
                        <Col lg="12" className="text-center">
                            <h2 className="order-title">Delivered Order Details</h2>
                            <h4 className="order-subtitle">Order ID: #{order.orderId}</h4>
                        </Col>
                    </Row>

                    <div className="order-wrapper">
                        <Row>
                            <Col lg="6">
                                <div className="order-card">
                                    <h5>General Information</h5>
                                    <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                                    <p><strong>Customer:</strong> {order.customerName}</p>
                                    <p><strong>Status:</strong> {order.orderStatus}</p>
                                    <p><strong>Delivery:</strong> {order.deliveryStatus}</p>
                                    <p><strong>Payment:</strong> {order.payStatus}</p>
                                    <p><strong>Delivery Date:</strong> {formatDate(order.expectedDeliveryDate)}</p>
                                    <p><strong>Contact:</strong> {order.customerPhone}</p>
                                    <p><strong>Optional Contact:</strong> {order.customerOptionalPhone}</p>
                                    <p><strong>Note:</strong> {order.specialNote}</p>
                                </div>
                            </Col>

                            <Col lg="6">
                                <div className="order-card">
                                    <h5>Payment Details</h5>
                                    {order.paymentDetails.map((payment, index) => (
                                        <div key={index}>
                                            <p><strong>Type:</strong> {payment.type} - {payment.subType}</p>
                                            {payment.card?.map((c, i) => (
                                                <p key={i}><strong>Card:</strong> Rs. {c.amount} | Interest: Rs. {c.intrestValue}</p>
                                            ))}
                                            {payment.transfer?.map((t, i) => (
                                                <p key={i}><strong>Transfer:</strong> Rs. {t.amount} | Bank: {t.bank}</p>
                                            ))}
                                            {payment.cheque?.map((ch, i) => (
                                                <p key={i}><strong>Cheque:</strong> Rs. {ch.amount} | Bank: {ch.bank} | Branch: {ch.branch} | A/C: {ch.accountNumber} | No: {ch.chequeNumber} | Date: {ch.date}</p>
                                            ))}
                                            {payment.credit?.map((cr, i) => (
                                                <p key={i}><strong>Credit:</strong> Rs. {cr.amount} | Expected: {formatDate(cr.expectedDate)}</p>
                                            ))}
                                        </div>
                                    ))}
                                    <hr />
                                    <p><strong>Net Total:</strong> Rs. {order.netTotal}</p>
                                    <p><strong>Delivery Fee:</strong> Rs. {order.deliveryCharge}</p>
                                    <p><strong>Discount:</strong> Rs. {order.discount}</p>
                                    <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
                                    <p><strong>Advance:</strong> Rs. {order.advance}</p>
                                    <p><strong>Balance:</strong> Rs. {order.balance}</p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="12">
                                <div className="order-card">
                                    <h5>Ordered Items</h5>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="item-line">
                                            <p><strong>Item:</strong> {item.itemName} | <strong>Color:</strong> {item.color} | <strong>Qty:</strong> {item.quantity} | <strong>Amount:</strong> Rs. {item.totalPrice}</p>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="12">
                                <div className="order-card">
                                    <h5>Issued Items</h5>
                                    {order.issuedItems.map((item, index) => (
                                        <div key={index} className="item-line">
                                            <p><strong>Batch ID:</strong> {item.BatchId} | <strong>Stock ID:</strong> {item.stockId} | <strong>Issued On:</strong> {item.issuedDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="12">
                                <div className="order-card">
                                    <h5>Payment History</h5>
                                    {order.paymentHistory?.length > 0 ? (
                                        order.paymentHistory.map((payment, index) => (
                                            <div key={index}>
                                                <p><strong>Payment ID:</strong> {payment.paymentId} | <strong>Amount:</strong> Rs. {payment.amount} | <strong>Date:</strong> {payment.paymentDate}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No payment history available.</p>
                                    )}
                                    <div className="text-center mt-3">
                                        <Button color="primary" onClick={handlePrintPaymentHistory}>
                                            Print Payment History
                                        </Button>
                                        <Button
                                            color="secondary"
                                            className="ms-3"
                                            onClick={() => {
                                                const userType = localStorage.getItem("type");
                                                const path = order.orderStatus === "Delivered"
                                                    ? (userType === "ADMIN" ? "/admin-dashboard/product_list?tab=Delivered%20Orders" : "/user-dashboard/product-list?tab=Delivered%20Orders")
                                                    : (userType === "ADMIN" ? "/admin-dashboard/product_list?tab=Issued%20Orders" : "/user-dashboard/product-list?tab=Issued%20Orders");
                                                navigate(path);
                                            }}
                                        >
                                            <i className="bx bx-home-alt-2"></i>
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
        </Helmet>
    );
};

export default DeliverdOrderDetails;

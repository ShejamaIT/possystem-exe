import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Table } from "reactstrap";
import "../style/productDetails.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar/Navbar";

const PurchaseNoteDetails = () => {
    const { id } = useParams(); // Get pc_Id from URL

    const [purchaseData, setPurchaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurchaseData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/admin/main/purchase-details?pc_Id=${id}`);
                setPurchaseData(response.data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!purchaseData) return <p>No purchase details found.</p>;

    const { purchase, purchaseDetails, pIDetails, paymentDetails } = purchaseData;
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : "N/A";
    };

    return (
        <Helmet title={`Purchase Details`}>
            <section>
                <Row>
                    <NavBar />
                </Row>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h4 className="mb-3 text-center topic">Purchase Details</h4>
                            <h4 className="mb-3 text-center topic">#{purchase.pc_Id}</h4>

                            {/* General Purchase Details */}
                            <div className="order-details">
                                <div className="order-header">
                                    <h5 className="mt-4">General Details</h5>
                                    <div className="order-general">
                                        <p><strong>Supplier ID:</strong> {purchase.s_ID}</p>
                                        <p><strong>Date:</strong> {formatDate(purchase.rDate)}</p>
                                        <p><strong>Total Amount:</strong> Rs. {purchase.total}</p>
                                        <p><strong>Paid Amount:</strong> Rs. {purchase.pay}</p>
                                        <p><strong>Balance:</strong> Rs. {purchase.balance}</p>
                                        <p><strong>Delivery Charge:</strong> Rs. {purchase.deliveryCharge}</p>
                                        <p><strong>Invoice ID:</strong> {purchase.invoiceId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Purchased Items Details */}
                            <div className="order-details">
                                <h5 className="mt-4">Purchased Items</h5>
                                <Table bordered className="coupon-table">
                                    <thead>
                                    <tr>
                                        <th>Item ID</th>
                                        <th>Received Count</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                        <th>Stock Range</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {purchaseDetails.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.I_Id}</td>
                                            <td>{item.rec_count}</td>
                                            <td>Rs. {item.unitPrice}</td>
                                            <td>Rs. {item.total}</td>
                                            <td>{item.stock_range}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Stock-Level Details */}
                            <div className="order-details">
                                <h5 className="mt-4">Stock Details</h5>
                                <Table bordered className="coupon-table">
                                    <thead>
                                    <tr>
                                        <th>Stock ID</th>
                                        <th>Item ID</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pIDetails.map((stock, index) => (
                                        <tr key={index}>
                                            <td>{stock.stock_Id}</td>
                                            <td>{stock.I_Id}</td>
                                            <td>{stock.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Payment Details Section (if available) */}
                            {paymentDetails && paymentDetails.length > 0 && (
                                <div className="order-details">
                                    <h5 className="mt-4">Payment Details</h5>
                                    <Table bordered className="coupon-table">
                                        <thead>
                                        <tr>
                                            <th>Payment ID</th>
                                            <th>Date & Time</th>
                                            <th>Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {paymentDetails.map((payment, index) => (
                                            <tr key={index}>
                                                <td>{payment.Id || "N/A"}</td>
                                                <td>{formatDate(payment.dateTime)}</td>
                                                <td>Rs. {Math.abs(payment.amount)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default PurchaseNoteDetails;

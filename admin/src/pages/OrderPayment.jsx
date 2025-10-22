import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Button, Input } from "reactstrap";
import NavBar from "./NavBar/Navbar";
import "../style/orderDetailsUpdated.css";
import RegenarateReceiptView from "./ReceiptView3";
import PaymentReceiptView from "./ReceiptView2";
import BillInvoice from "./AccpetBillInvoice";

const OrderPayment = () => {
    const navigate = useNavigate();
    const [orderid, setOrderid] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState(null);
    const [showReceiptView, setShowReceiptView] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [showModal1, setShowModal1] = useState(false);
    const [showReceiptView1, setShowReceiptView1] = useState(false);
    const [RecepitId , setRecepitId] = useState("");        

    const fetchRecepitID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/newRecepitID");
            const data = await response.json();
            if (data.nextRepid) {
                setRecepitId(data.nextRepid);
                return data.nextRepid;  // Return the value for immediate use
            } else {
                toast.error("Server did not return a valid Recepit ID.");
                return null;
            }
        } catch (err) {
            console.error("Error fetching Recepit ID:", err);
            toast.error("Failed to load Recepit ID.");
            return null;
        }
    };

     const fetchOrder = async () => {
        if (!orderid.trim()) {
            setError("Please enter a valid Order ID.");
            setOrder(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/sendid-order-details?orID=${orderid}`);
            if (!response.ok) throw new Error("Failed to fetch order details.");
            const data = await response.json();
            if (!data.order) throw new Error("Order not found.");
            setOrder(data.order);
            setSelectedOrder(data.order);
        } catch (err) {
            console.error("Error fetching order details:", err);
            setError(err.message);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintPaymentHistory = () => {
        const printWindow = window.open("", "Print Window", "width=600,height=800");

        const totalPayments =
            order.paymentHistory?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
        const balance = parseFloat(order.totalPrice) - totalPayments;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Payment History</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h3, h5 { text-align: center; margin: 5px 0; }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        table, th, td {
                            border: 1px solid #000;
                        }
                        th, td {
                            padding: 8px;
                            text-align: center;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <h3>Payment History</h3>
                    <h5>Order ID: #${order.orderId}</h5>
                    <h5>Total Order Amount: Rs. ${parseFloat(order.totalPrice).toFixed(2)}</h5>
                    <h5>Total Paid: Rs. ${totalPayments.toFixed(2)}</h5>
                    <h5>Balance: Rs. ${balance.toFixed(2)}</h5>
                    <hr />
        `);

        if (order.paymentHistory?.length > 0) {
            printWindow.document.write(`
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Payment ID</th>
                            <th>Amount Paid (Rs.)</th>
                            <th>Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
            `);

            order.paymentHistory.forEach((payment, index) => {
                printWindow.document.write(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${payment.paymentId}</td>
                        <td>${parseFloat(payment.amount).toFixed(2)}</td>
                        <td>${payment.paymentDate}</td>
                    </tr>
                `);
            });

            printWindow.document.write(`
                    </tbody>
                </table>
            `);
        } else {
            printWindow.document.write("<p>No payments made yet.</p>");
        }

        printWindow.document.write(`<div class="footer">-- Shejama Group --</div></body></html>`);
        printWindow.document.close();
        printWindow.print();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    };

    const generateBill = async () => {
        const receiptId = await fetchRecepitID();  // Wait for ID
        if (!receiptId) return; // If fetch fails, stop

        const updatedData = {
            recepitId: receiptId,
            orID: order.orderId,
            orderDate: order.orderDate,
            expectedDate: order.expectedDeliveryDate || '',
            customerName: order.customerName,
            contact1: order.customerPhone || '',
            contact2: order.customerOptionalPhone || '',
            address: order.address || '',
            balance: parseFloat(order.balance),
            delStatus: order.deliveryInfo ? 'Delivery' : 'Pickup',
            delPrice: parseFloat(order.deliveryCharge),
            deliveryStatus: order.status || '',
            discount: parseFloat(order.discount || 0),
            specialdiscount: parseFloat(order.specialdiscount || 0),
            subtotal: parseFloat(order.netTotal || 0),
            total: parseFloat(order.totalPrice || 0),
            advance: parseFloat(order.advance || 0),
            payStatus: (order.advance > 0 ? 'Advanced' : 'Pending'),
            paymentAmount: parseFloat(order.advance || 0),
            cashReturn: 0,
            salesperson: order.salespersonName || '',
            items: order.items,
            specialNote: order.specialNote,
            billNumber: order.billNumber || '-',
            issuable: 'Later',
        };

        setReceiptData(updatedData);
        setShowReceiptView(true);
    };
    
    const handleSubmit = async (formData) => {
        const { orID, isPickup, netTotal, totalAdvance, previousAdvance, balance, addedAdvance, updatedDeliveryCharge, updatedcouponeDiscount, updatespecialDiscount } = formData;

        try {
            // Fetch new Receipt ID and wait for it
            const receiptId = await fetchRecepitID();  

            // Send request to the "update-invoice" API
            const response = await fetch("http://localhost:5001/api/admin/main/update-invoice", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orID, isPickup, netTotal, totalAdvance, previousAdvance, balance, addedAdvance, updatedDeliveryCharge, updatedcouponeDiscount, updatespecialDiscount }),
            });

            const data = await response.json();

            if (response.ok) {
                fetchOrder();
                toast.success("Invoice and payment updated successfully!");

                const updatedData = {
                    recepitId: receiptId,
                    orID,
                    orderDate: order.orderDate,
                    expectedDate: order.deliveryInfo.scheduleDate || formData.expectedDate || '',
                    customerName: order.customerName,
                    contact1: order.phoneNumber || '',
                    contact2: order.optionalNumber || '',
                    address: order.deliveryInfo.address || '',
                    balance: parseFloat(formData.balance),
                    delStatus: order.deliveryStatus || '',
                    delPrice: parseFloat(formData.updatedDeliveryCharge || 0),
                    deliveryStatus: formData.dvStatus || 'Pending',
                    discount: parseFloat(formData.updatedcouponeDiscount || 0),
                    specialdiscount: parseFloat(formData.updatespecialDiscount || 0),
                    subtotal: parseFloat(order.netTotal || 0),
                    total: parseFloat(order.totalPrice || 0),
                    advance: parseFloat(formData.previousAdvance || 0),
                    payStatus: 'Advanced',
                    paymentAmount: parseFloat(formData.addedAdvance || 0),
                    cashReturn: parseFloat(0),
                    issuable: 'Later',
                    salesperson: order.salespersonName || '',
                    items: order.items,
                    customerBalanceDecision: "",
                    finalCustomerBalance: formData.balance,
                    specialNote: order.specialNote,
                };

                setShowModal1(false);
                fetchOrder();
                setReceiptData(updatedData);
                setShowReceiptView1(true);
            } else {
                alert(data.error || "Failed to update invoice.");
            }
        } catch (error) {
            console.error("Error updating invoice:", error);
            alert("Server error. Please try again.");
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
                                    placeholder="Enter Order ID or bill number"
                                    value={orderid}
                                    onChange={(e) => setOrderid(e.target.value)}
                                />
                                <Button color="primary" onClick={fetchOrder}>Search</Button>
                            </div>
                        </Col>
                    </Row>

                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-danger text-center">{error}</p>}
                    {!loading && !error && !order && <p className="text-center">Please enter an Order ID to search.</p>}

                    {order && (
                        <>
                            <Row>
                                <Col lg="12" className="text-center">
                                    <h2 className="order-title">{order.orderStatus} Order Details</h2>
                                    <h4 className="mb-3 text-center topic"> #{order.orderId} ({order.billNumber || '-'})</h4>
                                </Col>
                            </Row>

                            <div className="order-wrapper">
                                {/* General Info & Payment Details */}
                                <Row>
                                    <Col lg="6">
                                        <div className="order-card">
                                            <h5>General Information</h5>
                                            <p><strong>Order Date:</strong> {order.orderDate}</p>
                                            <p><strong>Customer:</strong> {order.customerName}</p>
                                            <p><strong>Status:</strong> {order.orderStatus}</p>
                                            <p><strong>Delivery:</strong> {order.deliveryStatus}</p>
                                            <p><strong>Payment:</strong> {order.payStatus}</p>
                                            <p><strong>Expected Delivery:</strong> {order.expectedDeliveryDate}</p>
                                            <p><strong>Contact:</strong> {order.customerPhone}</p>
                                            <p><strong>Optional Contact:</strong> {order.customerOptionalPhone}</p>
                                            <p><strong>Note:</strong> {order.specialNote}</p>
                                        </div>
                                    </Col>

                                    <Col lg="6">
                                        <div className="order-card">
                                            <h5>Payment Details</h5>
                                            {order.paymentDetails?.map((payment, index) => (
                                                <div key={index}>
                                                    <p><strong>Type:</strong> {payment.type} - {payment.subType}</p>
                                                    {payment.card?.map((c, i) => (
                                                        <p key={i}><strong>Card:</strong> Rs. {c.amount} | Interest: Rs. {c.intrestValue}</p>
                                                    ))}
                                                </div>
                                            ))}
                                            <hr />
                                            <p><strong>Net Total:</strong> Rs. {order.netTotal}</p>
                                            <p><strong>Delivery Fee:</strong> Rs. {order.deliveryCharge}</p>
                                            <p><strong>Coupon Discount:</strong> Rs. {order.discount}</p>
                                            <p><strong>Special Discount:</strong> Rs. {order.specialdiscount}</p>
                                            <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
                                            <p><strong>Advance:</strong> Rs. {order.advance}</p>
                                            <p><strong>Balance:</strong> Rs. {order.balance}</p>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Ordered Items */}
                                <Row>
                                    <Col lg="12">
                                        <div className="order-card">
                                            <h5>Ordered Items</h5>
                                            {order.items && order.items.length > 0 ? (
                                                <table className="table table-bordered table-striped mt-3">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Item</th>
                                                            <th>Color</th>
                                                            <th>Qty</th>
                                                            <th>Price (Rs.)</th>
                                                            <th>Discount (Rs.)</th>
                                                            <th>Amount (Rs.)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.itemName}</td>
                                                                <td>{item.color}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{parseFloat(item.unitPrice).toFixed(2)}</td>
                                                                <td>{parseFloat(item.discount || 0).toFixed(2)}</td>
                                                                <td>{parseFloat(item.amount).toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-muted mt-3">No items found for this order.</p>
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                {/* Payment History */}
                                <Row>
                                    <Col lg="12">
                                        <div className="order-card">
                                            <h5>Payment History</h5>
                                            {order.paymentHistory?.length > 0 ? (
                                                <table className="table table-bordered table-striped mt-3">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Payment ID</th>
                                                            <th>Amount Paid (Rs.)</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.paymentHistory.map((payment, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{payment.paymentId}</td>
                                                                <td>{parseFloat(payment.amount).toFixed(2)}</td>
                                                                <td>{payment.paymentDate}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-muted mt-3">No payment history available.</p>
                                            )}

                                            <div className="text-center mt-3">
                                                <Button color="primary" onClick={handlePrintPaymentHistory}>
                                                    Print Payment History
                                                </Button>
                                                <Button color="danger" className="ms-3" onClick={generateBill}>
                                                    Regenerate Bill
                                                </Button>
                                                <Button color="success" className="ms-3"
                                                        onClick={() => setShowModal1(true)} disabled={loading}>
                                                    Payment
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    className="ms-3"
                                                    onClick={() => {
                                                        const userType = localStorage.getItem("type");
                                                        navigate(
                                                            userType === "ADMIN"
                                                                ? "/admin-dashboard/product_list?tab=Issued"
                                                                : "/user-dashboard/product-list?tab=Issued"
                                                        );
                                                    }}
                                                >
                                                    <i className="bx bx-home-alt-2"></i>
                                                </Button>
                                            </div>
                                        </div>

                                        {showModal1 && selectedOrder && (
                                            <BillInvoice
                                                selectedOrder={selectedOrder}
                                                setShowModal1={setShowModal1}
                                                handleSubmit={handleSubmit}
                                            />
                                        )}

                                        {showReceiptView && (
                                            <RegenarateReceiptView
                                                receiptData={receiptData}
                                                setShowReceiptView={setShowReceiptView}
                                            />
                                        )}

                                        {showReceiptView1 && (
                                            <PaymentReceiptView
                                                receiptData={receiptData}
                                                setShowReceiptView={setShowReceiptView1}
                                            />
                                        )}

                                    </Col>
                                </Row>
                            </div>
                        </>
                    )}
                </Container>
            </section>
        </Helmet>
    );
};

export default OrderPayment;

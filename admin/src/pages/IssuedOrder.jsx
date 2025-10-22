import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Button } from "reactstrap";
import NavBar from "./NavBar/Navbar";
import "../style/orderDetailsUpdated.css";
import RegenarateReceiptView from "./ReceiptView3";
import ReceiptView from "./ReceiptView";

const IssuedOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReceiptView, setShowReceiptView] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
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
    const fetchInvoiceID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/newinvoiceID");
            const data = await response.json();
            if (data.nextRepid) {
                return data.nextRepid;  // Return the value for immediate use
            } else {
                toast.error("Server did not return a valid Invoice ID.");
                return null;
            }
        } catch (err) {
            console.error("Error fetching Inoice ID:", err);
            toast.error("Failed to load Invoice ID.");
            return null;
        }
    };
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateStr; // already in correct format
    };

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
            console.error("Error fetching order details:", err);
            setError(err.message);
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
        const invoiceId = await fetchInvoiceID();
        if (!receiptId) return; // If fetch fails, stop

        const updatedData = {
            recepitId: receiptId,
            invoiceId :invoiceId,
            orID: order.orderId,
            orderDate: formatDateForInput(order.orderDate),
            expectedDate: order.expectedDeliveryDate || '',
            customerName: order.customerName,
            contact1: order.customerPhone || '',
            contact2: order.customerOptionalPhone || '',
            address: order.customerAddress || '',
            balance: parseFloat(order.balance),
            delStatus: order.deliveryInfo ? 'Delivery' : 'Pickup',
            delPrice: parseFloat(order.deliveryCharge),
            deliveryStatus: order.deliveryInfo?.status || '',
            couponediscount: parseFloat(order.discount || 0),
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
                            <h2 className="order-title">Issued Order Details</h2>
                            <h4 className="mb-3 text-center topic"> #{order.orderId} ({order.billNumber !== null && order.billNumber !== undefined ? order.billNumber : '-'})</h4>
                        </Col>
                    </Row>

                    <div className="order-wrapper">
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
                                    <p><strong>Contact:</strong> {order.customerPhone} / {order.customerOptionalPhone}</p>
                                    <p><strong>Address:</strong> {order.customerAddress} </p>
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
                                    <p><strong>Coupone Discount:</strong> Rs. {order.discount}</p>
                                    <p><strong>Special Discount:</strong> Rs. {order.specialdiscount}</p>
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
                                <div className="d-flex flex-wrap gap-3">
                                    {order.items.map((item, index) => (
                                    <div key={index} className="item-card">
                                        <p><strong>Item:</strong> {item.itemName}</p>
                                        <p><strong>Color:</strong> {item.color}</p>
                                        <p><strong>Qty:</strong> {item.quantity}</p>
                                        <p><strong>Price:</strong> Rs. {item.unitPrice}</p>
                                        <p><strong>Discount:</strong> Rs. {item.discount}</p>
                                        <p><strong>Amount:</strong> Rs. {item.amount}</p>
                                    </div>
                                    ))}
                                </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="12">
                                <div className="order-card">
                                <h5>Issued Items</h5>
                                <div className="d-flex flex-wrap gap-3">
                                    {order.issuedItems.map((item, index) => (
                                    <div key={index} className="item-card">
                                        <p><strong>Batch ID:</strong> {item.itemId}</p>
                                        <p><strong>Stock ID:</strong> {item.stockId}</p>
                                        <p><strong>Batch ID:</strong> {item.BatchId}</p>
                                        <p><strong>Issued On:</strong> {item.issuedDate}</p>
                                    </div>
                                    ))}
                                </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="12">
                                <div className="order-card">
                                    <h5>Payment History</h5>
                                    {order.paymentHistory?.length > 0 ? (
                                        order.paymentHistory.map((payment, index) => (
                                            <div key={index} className="item-line">
                                                <p><strong>Payment ID:</strong> {payment.paymentId}</p>
                                                <p><strong>Amount Paid:</strong> Rs. {payment.amount}</p>
                                                <p><strong>Date:</strong> {payment.paymentDate}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No payment history available.</p>
                                    )}
                                    <div className="text-center mt-3">
                                        <Button color="primary" onClick={handlePrintPaymentHistory}>
                                            Print Payment History
                                        </Button>
                                        <Button color="danger" className="ms-3" onClick={() => generateBill()}>
                                            Regenrate Bill
                                        </Button>
                                        <Button
                                            color="secondary"
                                            className="ms-3"
                                            onClick={() => {
                                                    const userType = localStorage.getItem("type");
                                                if (userType === "ADMIN") {
                                                    navigate("/admin-dashboard/product_list?tab=Issued");
                                                } else {
                                                    navigate("/user-dashboard/product-list?tab=Issued");
                                                }
                                            }}
                                        >
                                            <i className="bx bx-home-alt-2"></i>
                                        </Button>
                                    </div>
                                </div>

                                {showReceiptView && (
                                    <ReceiptView
                                        receiptData={receiptData}
                                        setShowReceiptView={setShowReceiptView}
                                    />
                                )}
                            </Col>
                        </Row>
                    </div>
                </Container>
            </section>
        </Helmet>
    );
};

export default IssuedOrderDetails;

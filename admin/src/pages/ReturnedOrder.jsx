import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Helmet from "../components/Helmet/Helmet";
import {Container, Row, Col, Button, Input, FormGroup, Label, ModalHeader, ModalBody, ModalFooter, Modal} from "reactstrap";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar/Navbar";
import "../style/orderDetails.css";
import ReceiptView from "./ReceiptView";

const ReturnedOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReceiptView, setShowReceiptView] = useState(false);
    const [receiptData, setReceiptData] = useState(null);const [RecepitId , setRecepitId] = useState(""); 
    
    useEffect(() => {
        fetchOrder();fetchRecepitID();fetchInvoiceID();
    }, [id]);
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
    const fetchOrder = async () => {
        console.log(id);
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/returned-order-details?orID=${id}`);
            if (!response.ok) throw new Error("Failed to fetch order details.");

            const data = await response.json();
            const updatedItems = data.order.items.map(item => ({
                ...item,
            }));

            // ✅ Format the date so <input type="date" /> works
            const formattedOrder = {
                ...data.order,
                expectedDeliveryDate: formatDateForInput(data.order.expectedDeliveryDate),
                orderDate:formatDateForInput(data.order.orderDate),
                items: updatedItems
            };

            setOrder(formattedOrder);
            setFormData({
                orderStatus: data.order.orderStatus,
                deliveryStatus: data.order.deliveryStatus
            });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching order details:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                orderId: order.orderId,
                orderStatus: formData.orderStatus,
                deliveryStatus: formData.deliveryStatus
            };
            console.log(updatedData);
            const response = await fetch(`http://localhost:5001/api/admin/main/updateReturnOrder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                toast.error(result.message || "Failed to update order.");
                return;
            }

            await fetchOrder();
            setIsEditing(false);
            toast.success("Order updated successfully.");

            const orderRoutes = {
                Completed: `/complete-order-detail/${order.orderId}`,
            };
            navigate(orderRoutes[formData.orderStatus] || "/admin-dashboard");
        } catch (err) {
            console.error("Error updating order:", err);
            toast.error(`Error: ${err.message}`);
        }
    };
    const calculateTotal = () => {
        const itemTotal = Number(order.netTotal || 0);
        const delivery = Number(order.deliveryCharge || 0);
        const discount = Number(order.discount || 0);
        const specialdic = Number(order.specialDiscount ||0);
        const total = (itemTotal + delivery) - (discount + specialdic);
        return total.toFixed(2);
    };

    const generateBill = async () => {
        const receiptId = await fetchRecepitID();  // Wait for ID
        const invoiceId = await fetchInvoiceID();
        if (!receiptId) return; // If fetch fails, stop

        const updatedData = {
            recepitId: receiptId,
            invoiceId :invoiceId,
            orID: order.orderId,
            orderDate: order.orderDate,
            expectedDate: order.expectedDeliveryDate || '',
            customerName: order.customerName,
            contact1: order.customerPhone || '',
            contact2: order.customerOptionalPhone || '',
            address: order.deliveryInfo?.address || '',
            balance: parseFloat(order.balance),
            delStatus: order.deliveryInfo ? 'Delivery' : 'Pickup',
            delPrice: parseFloat(order.deliveryCharge),
            deliveryStatus: order.deliveryInfo?.status || '',
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!order) return <p>Order not found</p>;

    return (
        <Helmet title={`Order Details - ${order.orderId}`}>
            <section>
                <Row>
                    <NavBar />
                </Row>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h4 className="mb-3 text-center topic">Returned Order Details</h4>
                            <h4 className="mb-3 text-center topic"> #{order.orderId} ({order.billNumber !== null && order.billNumber !== undefined ? order.billNumber : '-'})</h4>
                            <div className="order-details">
                                <div className="order-header">
                                    <h5 className="mt-4">General Details</h5>
                                    <div className="order-general">
                                        <p><strong>Order Date:</strong> {order.orderDate}</p>
                                        <p><strong>Customer Name:</strong> {order.customerName}</p>

                                        {/* Order Status - Editable */}
                                        {!isEditing ? (
                                            <p><strong>Order Status:</strong>
                                                <span className={`status ${order.orderStatus.toLowerCase()}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </p>
                                        ) : (
                                            <FormGroup>
                                                <Label><strong>Order Status:</strong></Label>
                                                <Input
                                                    type="select"
                                                    name="orderStatus"
                                                    value={formData.orderStatus}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Completed">Completed</option>
                                                    <option value="Returned">Returned</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </Input>
                                            </FormGroup>
                                        )}

                                        {/* Delivery Status - Editable */}
                                        {!isEditing ? (
                                            <p><strong>Delivery Status:</strong> {order.deliveryStatus}</p>
                                        ) : (
                                            <FormGroup>
                                                <Label><strong>Delivery Status:</strong></Label>
                                                <Input
                                                    type="select"
                                                    name="deliveryStatus"
                                                    value={formData.deliveryStatus}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </Input>
                                            </FormGroup>
                                        )}

                                        <p><strong>Payment Status:</strong> {order.payStatus}</p>
                                        <p><strong>Expected Delivery Date:</strong> {order.expectedDeliveryDate}</p>
                                        <p><strong>Contact:</strong> {order.phoneNumber}</p>
                                        <p><strong>Optional Contact:</strong> {order.optionalNumber}</p>
                                        <p><strong>Special Note:</strong> {order.specialNote}</p>
                                        <p><strong>Sale By:</strong> {order.salesTeam.employeeName}</p>
                                        <p><strong>Reason to Return:</strong> {order.returnReason}</p>
                                    </div>
                                </div>
                                {/* Ordered Items */}
                                    <div>
                                        <h5 className="mt-4">Ordered Items</h5>
                                        <ul className="order-items">
                                            <div className="order-general">
                                                {order.items.map((item, index) => (
                                                    <li key={index}>
                                                        <p><strong>Item:</strong> {item.itemName}</p>
                                                        <p><strong>Color:</strong> {item.color}</p>
                                                        <p><strong>Requested Quantity:</strong> {item.quantity}</p>
                                                        <p><strong>Unit Price:</strong> Rs. {item.unitPrice}</p>
                                                        <p><strong>Discount:</strong> Rs. {item.discount}</p>
                                                        <p><strong>Amount:</strong> Rs. {((parseFloat(item.unitPrice)-parseFloat(item.discount))* (item.quantity))}</p>
                                                    </li>
                                                ))}
                                            </div>
                                        </ul>
                                    </div>


                                    {/* Issued Items */}
                                    <div className="mt-4">
                                        <h5 className="mt-4">Issued Items</h5>
                                        <ul className="order-items">
                                            <div className="order-general">
                                                {order.issuedItems.map((item, index) => (
                                                    <li key={index}>
                                                        <p><strong>Stock ID:</strong> {item.stockId}</p>
                                                        <p><strong>Batch ID:</strong> {item.BatchId}</p>
                                                        <p><strong>Status:</strong> {item.status}</p>
                                                        <p><strong>Issued On:</strong> {item.issuedDate}</p>
                                                    </li>
                                                ))}
                                            </div>
                                        </ul>

                                    </div>
                                    <div className="order-summary">
                                        <Row>
                                            <Col md="3">
                                                <p><strong>Item Total:</strong> Rs. {order.netTotal}</p>
                                            </Col>
                                            <Col md="3">
                                                <p><strong>Item Discount:</strong> Rs. {formData.itemDiscount ?? order.itemDiscount}</p>
                                            </Col>
                                            <Col md="3">
                                                <p><strong>Coupone Discount:</strong> Rs. {formData.discount ?? order.discount}</p>
                                            </Col>
                                            <Col md="3">
                                                <p><strong>Special Discount:</strong> Rs. {order.specialDiscount}</p>
                                            </Col>
                                        </Row>
    
    
                                        <Row >
                                            <Col md="3">
                                                {formData.deliveryStatus === "Pick up" ? (
                                                    <p><strong>Delivery
                                                        Amount:</strong> Rs. {formData.deliveryCharge ?? order.deliveryCharge}
                                                    </p>
                                                ) : (
                                                    !isEditing ? (
                                                        <p><strong>Delivery
                                                            Amount:</strong> Rs. {formData.deliveryCharge ?? order.deliveryCharge}
                                                        </p>
                                                    ) : (
                                                        <FormGroup>
                                                            <Label><strong>Delivery Amount:</strong></Label>
                                                            <Input
                                                                type="text"
                                                                name="deliveryCharge"
                                                                value={formData.deliveryCharge ?? order.deliveryCharge}
                                                                onChange={handleChange}
                                                            />
                                                        </FormGroup>
                                                    )
                                                )}
                                            </Col>
                                            <Col md="3">
                                                <p><strong>Total Amount:</strong> Rs. {calculateTotal()}</p>
                                            </Col>
    
                                            <Col md="3">
                                                <p><strong>Advance Amount:</strong> Rs. {order.advance}</p>
                                            </Col>
    
                                            <Col md="3">
                                                <p><strong>Balance Amount:</strong> Rs. {order.balance}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                {/* Buttons */}
                                <div className="text-center mt-4">
                                    {!isEditing ? (
                                        <>
                                            <Button color="primary" onClick={() => setIsEditing(true)} disabled={loading}>
                                                {loading ? "Loading..." : "Edit Order"}
                                            </Button>
                                            <Button color="danger" className="ms-3" onClick={() => generateBill()}>
                                                Regenrate Bill
                                            </Button>
                                            <Button
                                                color="secondary"
                                                className="ms-3"
                                                onClick={() => {
                                                    const userType = localStorage.getItem("type");
                                                    if (order.orderStatus === "Returned") {
                                                        if (userType === "ADMIN") {
                                                            navigate("/admin-dashboard/product_list?tab=Returned");
                                                        } else {
                                                            navigate("/user-dashboard/product_list?tab=Returned");
                                                        }
                                                    }else if (order.orderStatus === "Cancelled") {
                                                        if (userType === "ADMIN") {
                                                            navigate("/admin-dashboard/product_list?tab=Cancel");
                                                        } else {
                                                            navigate("/user-dashboard/product_list?tab=Cancel");
                                                        }
                                                    }
                                                }}
                                            >
                                                <i className="bx bx-home-alt-2"></i>
                                            </Button>
                                        </>

                                    ) : (
                                        <>
                                            <Button color="success" onClick={handleSave} disabled={loading}>
                                                {loading ? "Saving..." : "Save Changes"}
                                            </Button>
                                            <Button color="secondary" className="ms-3" onClick={() => setIsEditing(false)} disabled={loading}>
                                                Cancel
                                            </Button>
                                        </>
                                    )}
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
                </Container>
            </section>
        </Helmet>
    );
};

export default ReturnedOrderDetails;



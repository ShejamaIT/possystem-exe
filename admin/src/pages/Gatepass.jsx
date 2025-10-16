import React, {useState, useEffect, useRef} from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Table } from "reactstrap";
import { toast } from "react-toastify";
import "../style/deliverynotes.css";
import MakeGatePassNow from "./MakeGatePassNow";
import DeliveryNoteView from "./DeliveryNoteView";
import GatePassView from "./GatepassView";
import ReceiptView from "./ReceiptView";
import FinalInvoice2 from "./FinalInvoice2";

const GatePass = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(""); // Added state for selected date
    const [showModal2, setShowModal2] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showGatepassView, setGatePassView] = useState(false);
    const [showReceiptView, setShowReceiptView] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [receiptDataD, setReceiptDataD] = useState(null);
    const selectedItem2Ref = useRef([]);
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateStr; // already in correct format
    };

    const fetchRecepitID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/newRecepitID");
            const data = await response.json();
            if (data.nextRepid) {
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

    const handleSubmit2 = async (formData) => {
        const order = formData.orders[0]; // extract the first order

        const updatedReceiptData = {
            order: {
                orderId: order.orderId,
                customerId: order.customerId,
                customerName: order.customerName,
                balance: parseFloat(order.balance) || 0,
                address: order.deliveryInfo?.address || "-",
                contact1: order.phoneNumber,
                contact2: order.optionalNumber,
                total: order.totalPrice,
                advance: parseFloat(order.advance) || 0,
                selectedItem: order.selectedItems || [],
                deliveryStatus: order.deliveryStatus,
                payStatus: order.payStatus,
                billNumber: order.billNumber,
                orderDate: formatDateForInput(order.orderDate),
                expectedDeliveryDate:formatDateForInput(order.expectedDeliveryDate),
                specialNote: order.specialNote,
            },
            vehicleId: formData.vehicleId,
        };

         // Prepare the data for the API request
        const gatepassData = {

            order:{
                orderId: order.orderId,
                orderDate: formatDateForInput(order.orderDate),
                balance: parseFloat(order.balance) || 0,
                address:order.deliveryInfo?.address || "-",
                contact1:order.phoneNumber,
                contact2:order.optionalNumber,
                selectedItem:order.selectedItems || [],
            },
            vehicleId: formData.vehicleId,
        };
        try {
            
            //Make the API call
            const response = await fetch("http://localhost:5001/api/admin/main/create-gate-pass-now", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gatepassData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error creating gatepass.");
            }

            toast.success("Gate pass created successfully.");

            setReceiptDataD(updatedReceiptData);
            setShowModal2(false);
            setGatePassView(true);
        } catch (error) {
            console.error("Error while submitting delivery note:", error);
            toast.error(error.message || "An unexpected error occurred while submitting the delivery note.");
        }
    };

    const loadOrders = (e) => {
        const routedate = e.target.value;
        setSelectedDeliveryDate(routedate); // Set the selected date
        fetchOrders(routedate);
    };

    const fetchOrders = async (date) => {
        console.log(date);
        try {
            let url = `http://localhost:5001/api/admin/main/find-completed-orders-by-date-pickup?date=${date}`;
            console.log(url);
            const response = await fetch(url);
            const data = await response.json();
            console.log(data.orders);
            setOrders(data.orders || []);
        } catch (error) {
            toast.error("Error fetching orders.");
        }
    };

    const handleOrderSelection = (order) => {
        const updatedOrders = selectedOrders.includes(order)
            ? selectedOrders.filter(o => o !== order)
            : [...selectedOrders, order];

        setSelectedOrders(updatedOrders);
        setSelectedOrder(order);
        handleEditClick1(order);
        calculateTotal(updatedOrders);
    };


    const handleEditClick1 = (order) => {
        console.log(order);
        if (!order) return;
        setSelectedOrder(order);
        setShowModal1(true);
    };

    const calculateTotal = (orders) => {
        const total = orders.reduce((sum, order) => sum + order.balance, 0);
        setTotalAmount(total);
    };

    const handleSubmit3 = async (formData) => {
        const receiptId = await fetchRecepitID();
        const invoiceId = await fetchInvoiceID();
        console.log(formData);
        const enrichedOrder = {
            ...selectedOrder,
            selectedItems: formData.selectedItems, // Inject selected items
        };

        console.log(formatDateForInput(enrichedOrder.orderDate));
        const updatedData = {
            recepitId: receiptId,
            invoiceId :invoiceId,
            orID: enrichedOrder.orderId,
            orderDate: formatDateForInput(enrichedOrder.orderDate),
            expectedDate: formatDateForInput(enrichedOrder.expectedDeliveryDate),
            deliveryStatus: formData.deliveryStatus,
            delStatus: formData.deliveryStatus,
            delPrice: formData.delivery,
            couponediscount: enrichedOrder.discount,
            specialdiscount: enrichedOrder.specialDiscount,
            itemDiscount: enrichedOrder.itemDiscount,
            subtotal: formData.subtotal,
            total: formData.billTotal,
            advance: formData.totalAdvance,
            balance: Number(formData.billTotal) - Number(formData.totalAdvance),
            payStatus: formData.paymentType,
            stID: enrichedOrder.salesTeam.stID,
            paymentAmount: formData.advance || 0,
            selectedItems: formData.selectedItems,
            balance: formData.billTotal - formData.totalAdvance,
            salesperson: enrichedOrder.salesTeam?.employeeName || "Unknown",
            items: enrichedOrder.items,
            customerName: enrichedOrder.customerName,
            contact1: enrichedOrder.phoneNumber || '',
            contact2: enrichedOrder.optionalNumber || '',
            address: enrichedOrder.deliveryInfo?.address || '',
            issuable: 'now',
            specialNote: enrichedOrder.specialNote,
            billNumber: enrichedOrder.billNumber || '-',
        };

        console.log("Updated data being sent:", updatedData);

        selectedItem2Ref.current = formData.selectedItems || [];

        // ✅ Update selectedOrders state with selectedItems for this order
        setSelectedOrders(prevOrders =>
            prevOrders.map(order =>
                order.orderId === enrichedOrder.orderId
                    ? { ...order, selectedItems: formData.selectedItems }
                    : order
            )
        );

        try {
            const response = await fetch('http://localhost:5001/api/admin/main/issued-items-Now', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("Update order successfully");
                setShowModal1(false);
                setReceiptData(updatedData); // Save updated order for receipt
                setShowReceiptView(true);
            } else {
                console.error("Error:", result.message);
            }
        } catch (error) {
            console.error("Error making API request:", error.message);
        }
    };

    const handleEditClick3 = (selectedOrders) => {
        if (!selectedOrders) return;
        setSelectedOrders(selectedOrders);
        setShowModal2(true);
    };

    return (
        <Container className="delivery-notes-container">
            <Row>
                <Col lg="10" className="mx-auto">
                    <h3 className="text-center mb-4">Gate Pass</h3>
                    <Form className ='delivery-notes-form'>
                        {/* Show Date Input if 'All' Route is selected */}
                        <FormGroup>
                            <Label for="deliveryDateSelect">Select Pickup Date</Label>
                            <Input
                                type="date"
                                id="deliveryDateSelect"
                                value={selectedDeliveryDate}
                                onChange={loadOrders}
                            />
                        </FormGroup>

                        {/* Orders Table */}
                        {orders.length > 0 && (
                            <>
                                <h5>Completed Orders</h5>
                                <Table bordered responsive className="order-table">
                                    <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Advance</th>
                                        <th>Balance</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td>
                                                <Input type="checkbox" onChange={() => handleOrderSelection(order)} />
                                            </td>
                                            <td>{order.orderId}</td>
                                            <td>{order.customerName}</td>
                                            <td>Rs.{order.totalPrice}</td>
                                            <td>Rs.{order.advance}</td>
                                            <td>Rs.{order.balance}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </>
                        )}
                        <h5 className="text-end mt-3">Total Balance: Rs.{totalAmount}</h5>
                    </Form>

                    <div className="text-center mt-4">
                        <Button color="primary" onClick={() => handleEditClick3(selectedOrders)}>Get Gatepass</Button>
                    </div>
                    {/* Modals for Delivery Note and Receipt */}
                    {showModal2 && selectedOrders && (
                        <MakeGatePassNow
                            selectedOrders={selectedOrders}
                            setShowModal={setShowModal2}
                            handleGatepassUpdate={handleSubmit2}
                        />
                    )}
                    {showGatepassView && (
                        <GatePassView
                            receiptData={receiptDataD}
                            setShowDeliveryView={setGatePassView}
                        />
                    )}
                    {showReceiptView && (
                        <ReceiptView
                            receiptData={receiptData}
                            setShowReceiptView={setShowReceiptView}
                        />
                    )}
                    {showModal1 && selectedOrder && (
                        <FinalInvoice2
                            selectedOrder={selectedOrder}
                            setShowModal2={setShowModal1}
                            handlePaymentUpdate={handleSubmit3}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default GatePass;

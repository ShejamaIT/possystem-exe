import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Button,
    Input,
    Label,
    FormGroup
} from "reactstrap";
import NavBar from "./NavBar/Navbar";
import Helmet from "../components/Helmet/Helmet";
import "../style/orderDetailsUpdated.css";

const CustomerDetailsView = () => {
    const { c_ID } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [ledger, setLedger] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState({
        totalBilled: 0,
        totalPaid: 0,
        balance: 0,
    });
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Fetch customer details on load
    useEffect(() => {
        fetchCustomerDetails();
    }, [c_ID]);

    // Populate formData when customer is loaded
    useEffect(() => {
        if (customer) {
            setFormData({
                title: customer.title || "",
                FtName: customer.FtName || "",
                SrName: customer.SrName || "",
                id: customer.id || "",
                address: customer.address || "",
                contact1: customer.contact1 || "",
                contact2: customer.contact2 || "",
                category: customer.category || "",
                type: customer.type || "",
                t_name: customer.t_name || "",
                occupation: customer.occupation || "",
                workPlace: customer.workPlace || ""
            });
        }
    }, [customer]);

    // Fetch ledger when date range selected
    useEffect(() => {
        if (startDate && endDate) {
            fetchCustomerLedger();
        }
    }, [startDate, endDate]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5001/api/admin/main/customer-details&orders?c_ID=${c_ID}`
            );
            if (!response.ok) throw new Error("Failed to fetch customer details.");
            const data = await response.json();
            setCustomer(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerLedger = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5001/api/admin/main/customer-ledger?c_ID=${c_ID}&startDate=${startDate}&endDate=${endDate}`
            );
            const result = await response.json();
            console.log(result);
            if (!result.success) throw new Error(result.message);

            setLedger(result.data);

            // Calculate summary
            const totalPaid = result.data.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
            const totalBilled = result.data.reduce((sum, r) => sum + (r.netTotal || 0), 0);
            const balance = result.data.reduce((sum, r) => sum + (r.balance || 0), 0);

            setPaymentSummary({ totalPaid, totalBilled, balance });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        console.log(formData);
        try {
            const response = await fetch(
                `http://localhost:5001/api/admin/main/customer/${c_ID}`,  // <-- FIXED
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error("Failed to update customer.");

            const { data } = await response.json();  // backend sends { success, message, data }
            setCustomer(data); // ✅ only set the actual customer object
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (error) return <p className="text-danger text-center mt-5">{error}</p>;
    if (!customer) return <p className="text-center mt-5">Customer not found.</p>;

    const orderStats = customer.orders?.[0] || {};

    return (
        <Helmet title={`Customer - ${customer.FtName} ${customer.SrName}`}>
            <section className="order-section">
                <NavBar />
                <Container>
                    <Row className="mb-3">
                        <Col lg="12" className="text-center">
                            <h2 className="order-title">Customer Details</h2>
                            <h4 className="order-subtitle">Customer ID: {customer.c_ID}</h4>
                        </Col>
                    </Row>

                    <Row>
                        {/* Personal Info */}
                        <Col lg="6">
                            <div className="order-card">
                                <h5>Personal Information</h5>
                                {!isEditing ? (
                                    <>
                                        <p><strong>Full Name:</strong>{customer.title} {customer.FtName} {customer.SrName}</p>
                                        <p><strong>NIC:</strong> {customer.id}</p>
                                        <p><strong>Address:</strong> {customer.address}</p>
                                        <p><strong>Phone 1:</strong> {customer.contact1}</p>
                                        <p><strong>Phone 2:</strong> {customer.contact2}</p>
                                    </>
                                ) : (
                                    <>
                                        <FormGroup>
                                            <Label>Title</Label>
                                                <Input type="select" name="title" value={formData.title} onChange={handleChange}>
                                                    <option value="">Select Title</option>
                                                    <option value="Mr">Mr</option>
                                                    <option value="Mrs">Mrs</option>
                                                    <option value="Ms">Ms</option>
                                                    <option value="Dr">Dr</option>
                                                    <option value="Rev">Rev</option>
                                                </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>First Name</Label>
                                            <Input type="text" name="FtName" value={formData.FtName} onChange={handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Last Name</Label>
                                            <Input type="text" name="SrName" value={formData.SrName} onChange={handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>NIC</Label>
                                            <Input type="text" name="id" value={formData.id} onChange={handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Address</Label>
                                            <Input type="text" name="address" value={formData.address} onChange={handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Phone 1</Label>
                                            <Input type="text" name="contact1" value={formData.contact1} onChange={handleChange} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Phone 2</Label>
                                            <Input type="text" name="contact2" value={formData.contact2} onChange={handleChange} />
                                        </FormGroup>
                                    </>
                                )}
                            </div>
                        </Col>

                        {/* Classification */}
                        <Col lg="6">
                            <div className="order-card">
                                <h5>Classification</h5>
                                {!isEditing ? (
                                    <>
                                        <p><strong>Category:</strong> {customer.category}</p>
                                        <p><strong>Type:</strong> {customer.type}</p>
                                        <p><strong>Trade Name:</strong> {customer.t_name}</p>
                                        <p><strong>Occupation:</strong> {customer.occupation}</p>
                                        <p><strong>Workplace:</strong> {customer.workPlace}</p>
                                        <p><strong>Current Balance:</strong> Rs. {customer.balance.toFixed(2)}</p>
                                    </>
                                ) : (
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label className="fw-bold">Category</Label>
                                                <Input type="select" name="category" value={formData.category} onChange={handleChange}>
                                                    <option value="">Select Category</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="Credit">Credit</option>
                                                    <option value="Loyal">Loyal</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label className="fw-bold">Type</Label>
                                                <Input type="select" name="type" value={formData.type} onChange={handleChange}>
                                                    <option value="">Select Type</option>
                                                    <option value="Walking">Walking</option>
                                                    <option value="On site">On site</option>
                                                    <option value="Shop">Shop</option>
                                                    <option value="Force">Force</option>
                                                    <option value="Hotel">Hotel</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label>Trade Name</Label>
                                                <Input type="text" name="t_name" value={formData.t_name} onChange={handleChange} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label>Occupation</Label>
                                                <Input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label>Workplace</Label>
                                                <Input type="text" name="workPlace" value={formData.workPlace} onChange={handleChange} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* Edit/Save Buttons */}
                    <Row className="mt-3">
                        <Col className="text-center">
                            {!isEditing ? (
                                <Button color="primary" onClick={() => setIsEditing(true)}>Edit</Button>
                            ) : (
                                <>
                                    <Button color="success" className="me-2" onClick={handleSave}>Save</Button>
                                    <Button color="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                </>
                            )}
                        </Col>
                    </Row>

                    {/* Order Stats */}
                    <Row className="mt-4">
                        <Col lg="12">
                            <div className="order-card">
                                <h5>Order Status Summary</h5>
                                <p><strong>Accepted:</strong> {orderStats.Accepted || 0}</p>
                                <p><strong>Pending:</strong> {orderStats.Pending || 0}</p>
                                <p><strong>Delivered:</strong> {orderStats.Delivered || 0}</p>
                                <p><strong>Issued:</strong> {orderStats.Issued || 0}</p>
                                <p><strong>Production:</strong> {orderStats.Production || 0}</p>
                            </div>
                        </Col>
                    </Row>

                    {/* Date Range Picker */}
                    <Row className="mt-4">
                        <Col lg="6">
                            <Label><strong>Start Date</strong></Label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </Col>
                        <Col lg="6">
                            <Label><strong>End Date</strong></Label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </Col>
                    </Row>

                    {/* Ledger */}
                    {ledger.length > 0 ? (
                        ledger.map((entry, idx) => (
                            <Row key={idx} className="mt-4">
                                <Col lg="12">
                                    <div className="order-card p-3 shadow-sm rounded">
                                        {/* Date Header */}
                                        <h5 className="mb-3">
                                            📅 {new Date(entry.date).toLocaleDateString()}
                                        </h5>

                                        <Row>
                                            {/* Left: Bills */}
                                            <Col lg="6">
                                                <h6 className="fw-bold">Bills</h6>
                                                {entry.bills.length > 0 ? (
                                                    <table className="table table-sm table-bordered">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Order ID</th>
                                                                <th>Net Total</th>
                                                                <th>Balance</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {entry.bills.map((bill, i) => (
                                                                <tr key={i}>
                                                                    <td>{bill.orID}</td>
                                                                    <td>Rs. {Number(bill.netTotal || 0).toFixed(2)}</td>
                                                                    <td>
                                                                        Rs.{" "}
                                                                        <strong
                                                                            className={
                                                                                (bill.balance || 0) > 0
                                                                                    ? "text-danger"
                                                                                    : "text-success"
                                                                            }
                                                                        >
                                                                            {Number(bill.balance || 0).toFixed(2)}
                                                                        </strong>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-muted">No bills</p>
                                                )}
                                            </Col>

                                            {/* Right: Payments */}
                                            <Col lg="6">
                                                <h6 className="fw-bold">Payments</h6>
                                                {entry.payments.length > 0 ? (
                                                    <table className="table table-sm table-bordered">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Type</th>
                                                                <th>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {entry.payments.map((pay, i) => (
                                                                <tr key={i}>
                                                                    <td>
                                                                        {pay.type || "Unknown"}
                                                                        {pay.subType ? ` (${pay.subType})` : ""}
                                                                        {pay.payMethod === "ords_card" && pay.intrestValue && (
                                                                            <small className="text-muted d-block">
                                                                                Interest: Rs. {pay.intrestValue.toFixed(2)}
                                                                            </small>
                                                                        )}
                                                                        {pay.payMethod === "ords_cheque" && (
                                                                            <small className="text-muted d-block">
                                                                                Cheque No: {pay.chequeNumber || "N/A"} | Bank: {pay.bank || "N/A"} | Status: {pay.status || "N/A"}
                                                                            </small>
                                                                        )}
                                                                    </td>
                                                                    <td>Rs. {Number(pay.amount || 0).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-muted">No payments</p>
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        ))
                    ) : (
                        <p className="text-muted text-center mt-4">
                            No ledger records found for selected date range.
                        </p>
                    )}

                    <Row className="mt-4">
                        <Col lg="12" className="text-center">
                            <Button color="secondary" onClick={() => navigate(-1)}>← Back</Button>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default CustomerDetailsView;

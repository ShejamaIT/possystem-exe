import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar/Navbar";
import "../style/suppierDetail.css";

const SupplierDetails = () => {
    const { id } = useParams(); // Get item ID from URL
    const navigate = useNavigate(); // Initialize navigate
    const [suppliers, setSuppliers] = useState([]);
    const [item, setItem] = useState(null);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);
    const [loadingItem, setLoadingItem] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        itemId: id,
        supplierId: '',
        qty: '',
        expectdate: '',
        specialnote: ''
    });

    // Fetch Supplier and Item Details
    useEffect(() => {
        fetchSuppliers();
        fetchItemDetails();
    }, [id]);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/item-suppliers?I_Id=${id}`);
            if (!response.ok) throw new Error("Failed to fetch supplier details.");
            const data = await response.json();
            setSuppliers(data.suppliers);
        } catch (err) {
            console.error("Error fetching supplier details:", err);
            setError(err.message);
        } finally {
            setLoadingSuppliers(false);
        }
    };

    const fetchItemDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/item-detail?Id=${id}`);
            if (!response.ok) throw new Error("Failed to fetch item details.");
            const data = await response.json();
            setItem(data.item);
        } catch (err) {
            console.error("Error fetching item details:", err);
            setError(err.message);
        } finally {
            setLoadingItem(false);
        }
    };

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form inputs
        if (!formData.supplierId || !formData.qty || !formData.expectdate) {
            toast.error("Please fill all required fields!");
            return;
        }

        const payload = {
            itemId: formData.itemId,
            qty: parseInt(formData.qty,10),
            supplierId: formData.supplierId,
            expectedDate: formData.expectdate,
            specialnote: formData.specialnote
        };

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/add-production", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit production order.");
            }

            toast.done("saved successfully");

            // Reset form after submission
            setFormData({
                itemId: id,
                supplierId: '',
                qty: '',
                expectdate: '',
                specialnote: ''
            });

            navigate(`/admin-dashboard/products?tab=For%20Production`); // Navigate to AdminHome page

        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(error.message);
        }
    };

    // Loading, Error, and No Data Handling
    if (loadingSuppliers || loadingItem) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (suppliers.length === 0) return <p>No suppliers found for this item.</p>;
    if (!item) return <p>No item details available.</p>;

    // Handle supplier card click
    const handleSupplierCardClick = (supplierId) => {
        setFormData({
            ...formData,
            supplierId: supplierId // Update supplierId when a card is clicked
        });
    };

    return (
        <Helmet title="Supplier Details">
            <section>
                <Row>
                    <NavBar />
                </Row>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h4 className="mb-3 text-center topic">Supplier Details for {item.I_name}</h4>
                            <div className="supplier-details">
                                {/* Supplier List */}
                                <h5 className="mt-4">Supplier List</h5>
                                <Row>
                                    {suppliers.map((supplier) => (
                                        <Col key={supplier.s_ID} lg="4" md="6" sm="12">
                                            <Card
                                                className="supplier-card"
                                                onClick={() => handleSupplierCardClick(supplier.s_ID)} // Handle card click
                                                style={{ cursor: "pointer" }}
                                            >
                                                <CardBody>
                                                    <CardTitle tag="h5">{supplier.name}</CardTitle>
                                                    <CardText><strong>Supplier ID:</strong> {supplier.s_ID}</CardText>
                                                    <CardText><strong>Contact:</strong> {supplier.contact}</CardText>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Form Section */}
                                <Row>
                                    <Col lg="6">
                                        <h5 className="mt-4">Supplier Order Form</h5>
                                        <Card className="supplier-order-card">
                                            <CardBody>
                                                <Form onSubmit={handleSubmit}>
                                                    <FormGroup>
                                                        <Label for="supplierId"><strong>Supplier ID</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="supplierId"
                                                            id="supplierId"
                                                            value={formData.supplierId}
                                                            onChange={handleFormChange}
                                                            disabled // Disable the input once a supplier is selected
                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="qty"><strong>Order Quantity</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="qty"
                                                            id="qty"
                                                            value={formData.qty}
                                                            onChange={handleFormChange}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="expectdate"><strong>Expected Date</strong></Label>
                                                        <Input
                                                            type="date"
                                                            name="expectdate"
                                                            id="expectdate"
                                                            value={formData.expectdate}
                                                            onChange={handleFormChange}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="specialnote"><strong>Special Note</strong></Label>
                                                        <Input
                                                            type="textarea"
                                                            name="specialnote"
                                                            id="specialnote"
                                                            value={formData.specialnote}
                                                            onChange={handleFormChange}
                                                        />
                                                    </FormGroup>
                                                    <Button type="submit" color="primary">Submit</Button>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default SupplierDetails;

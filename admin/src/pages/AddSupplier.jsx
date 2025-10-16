import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import "../style/addProduct.css";

const AddSupplier = ({ onAddSupplier }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contact: "",
        contact2: "",
    });

    // Handle input changes for the supplier form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation to ensure required fields are filled
        if (!formData.name || !formData.address || !formData.contact) {
            toast.error("Please fill out all supplier details.");
            return;
        }

        try {
            // Prepare data to send to the server
            const supplierData = {
                name: formData.name,
                contact: formData.contact,
                contact2: formData.contact2 || "",
                address: formData.address,
            };

            // Make a POST request to the server to add the supplier
            const response = await fetch("http://localhost:5001/api/admin/main/supplier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(supplierData),
            });

            const result = await response.json();

            if (response.ok) {
                // On success, call the parent function to update the supplier list in the parent component
                toast.success(result.message);
                onAddSupplier(supplierData); // Pass the new supplier to the parent component
                handleClear(); // Clear form after successful submission
                setTimeout(() => {
                    window.location.reload(); // Auto-refresh the page
                }, 1000);

            } else {
                toast.error(result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting supplier data:", error);
            toast.error("Error submitting supplier data. Please try again.");
        }
    };

    // Clear form data
    const handleClear = () => {
        setFormData({
            name: "",
            address: "",
            contact: "",
            contact2: "",
        });
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center">Add New Supplier</h3>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="name">Supplier Name</Label>
                            <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="address">Address</Label>
                            <Input type="textarea" name="address" id="address" value={formData.address} onChange={handleChange} required/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="contact">Contact</Label>
                            <Input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} required/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="contact2">Secondary Contact</Label>
                            <Input type="text" name="contact2" id="contact2" value={formData.contact2} onChange={handleChange}/>
                        </FormGroup>

                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>
                                    Add Supplier
                                </Button>
                            </Col>
                            <Col md="6">
                                <Button type="button" color="danger" block onClick={handleClear}>
                                    Clear
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddSupplier;

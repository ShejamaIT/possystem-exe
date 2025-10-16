import React, { useState } from "react";
import { toast } from "react-toastify";
import {Container, Row, Col, Form, FormGroup, Label, Input, Button,} from "reactstrap";
import "../style/addProduct.css";

const AddVehicle = () => {
    const [formData, setFormData] = useState({
        registration_no: "",
        brand: "",
        model: "",
        color: "",
        year: "",
        license_Date: "",
        insurance_Date: "",
        fuel_type: "",
        size: "",
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.registration_no || !formData.license_Date || !formData.insurance_Date) {
            toast.error("Please fill out all required vehicle details.");
            return;
        }
        

        try {
            const vehicleData = {
                registration_no: formData.registration_no,
                brand: formData.brand,
                model: formData.model,
                color: formData.color,
                year: formData.year,
                license_Date: formData.license_Date,
                insurance_Date: formData.insurance_Date,
                fuel_type: formData.fuel_type,
                size: formData.size,
                status: formData.status,
            };
            const response = await fetch("http://localhost:5001/api/admin/main/vehicle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vehicleData),
            });

            const textResponse = await response.text();
            const result = JSON.parse(textResponse);

            if (!response.ok) {
                throw new Error(result.message || "Failed to add vehicle.");
            }

            toast.success(result.message);
            handleClear();
        } catch (error) {
            console.error("Error submitting vehicle data:", error);
            toast.error(error.message);
        }
    };

    const handleClear = () => {
        setFormData({
            registration_no: "",
            brand: "",
            model: "",
            color: "",
            year: "",
            license_Date: "",
            insurance_Date: "",
            fuel_type: "",
            size: "",
            status: "",
        });
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center">Add New Vehicle</h3>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="registration_no">Registration No</Label>
                            <Input type="text" name="registration_no" id="registration_no" value={formData.registration_no} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label for="brand">Brand</Label>
                            <Input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="model">Model</Label>
                            <Input type="text" name="model" id="model" value={formData.model} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="color">Color</Label>
                            <Input type="text" name="color" id="color" value={formData.color} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="year">Year</Label>
                            <Input type="text" name="year" id="year" value={formData.year} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="license_Date">License Date</Label>
                            <Input type="date" name="license_Date" id="license_Date" value={formData.license_Date} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label for="insurance_Date">Insurance Date</Label>
                            <Input type="date" name="insurance_Date" id="insurance_Date" value={formData.insurance_Date} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label for="fuel_type">Fuel Type</Label>
                            <Input type="text" name="fuel_type" id="fuel_type" value={formData.fuel_type} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="size">Size</Label>
                            <Input type="text" name="size" id="size" value={formData.size} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="status">Status</Label>
                            <Input type="select" name="status" id="status" value={formData.status} onChange={handleChange} required>
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Sold">Sold</option>
                            </Input>
                        </FormGroup>

                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>Add Vehicle</Button>
                            </Col>
                            <Col md="6">
                                <Button type="button" color="danger" block onClick={handleClear}>Clear</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddVehicle;

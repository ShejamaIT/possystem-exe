import React, { useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import "../style/addProduct.css";
import Helmet from "../components/Helmet/Helmet";

const AddEmployee = ({ onAddEmployee }) => {
    const [formData, setFormData] = useState({
        name: "",address: "",nic: "",dob: "",contact: "",job: "",basic: "",type: "",
        orderTarget: "",issuedTarget: "",lincenseimg:"",lincenseDate:"",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "basic" || name === "orderTarget" || name === "issuedTarget" ? parseFloat(value) || "" : value,
        }));
    };
    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.nic || !formData.dob || !formData.contact || !formData.job || !formData.basic) {
            toast.error("Please fill out all required employee details.");
            return;
        }

        const form = new FormData();
        form.append("name", formData.name);
        form.append("address", formData.address);
        form.append("nic", formData.nic);
        form.append("dob", formData.dob);
        form.append("contact", formData.contact);
        form.append("job", formData.job);
        form.append("basic", formData.basic);
        form.append("type", formData.type);
        form.append("orderTarget", formData.orderTarget);
        form.append("issuedTarget", formData.issuedTarget);
        form.append("lincenseDate", formData.lincenseDate);
        
        if (formData.lincenseimg && formData.job === "Driver") {
            form.append("lincenseimg", formData.lincenseimg);
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/employees", {
                method: "POST",
                body: form // ✅ Let browser set Content-Type
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add employee.");
            }

            toast.success(result.message);
            onAddEmployee(result.data); // or `employeeData`
            handleClear();
        } catch (error) {
            console.error("Error submitting employee data:", error);
            toast.error(error.message);
        }
    };

    const handleClear = () => {
        setFormData({
            E_Id: "",name: "",address: "",nic: "",dob: "",contact: "",job: "", basic: "", target: "",type: "",
            orderTarget: "",issuedTarget: "",lincenseimg:"",lincenseDate:"",monthlyTarget:"",dailyTarget:""
        });
    };

    return (
        <Helmet title="Add New Employee">
           <Container className="add-item-container">
                <Row>
                    <Col lg="8" className="mx-auto">
                        <h3 className="text-center">Add New Employee</h3>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="address">Address</Label>
                                <Input type="textarea" name="address" id="address" value={formData.address} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="nic">NIC</Label>
                                <Input type="text" name="nic" id="nic" value={formData.nic} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="dob">Date of Birth</Label>
                                <Input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="contact">Contact</Label>
                                <Input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} required />
                            </FormGroup>
                            <FormGroup>
                                <Label for="job">Job Role</Label>
                                <Input type="select" name="job" id="job" value={formData.job} onChange={handleChange} required>
                                    <option value="">Select Job Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                    <option value="Driver">Driver</option>
                                    <option value="It">It</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="type">Job Type</Label>
                                <Input type="select" name="type" id="type" value={formData.type} onChange={handleChange} required>
                                    <option value="">Select Job Type</option>
                                    <option value="Permanent">Permanent</option>
                                    <option value="Intern">Intern</option>
                                    <option value="Temporary">Temporary</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="basic">Basic Salary</Label>
                                <Input type="text" name="basic" id="basic" value={formData.basic} onChange={handleChange} required />
                            </FormGroup>
                            {formData.job === "Sales" && (
                                <>
                                    <FormGroup>
                                        <Label for="target">Received Target</Label>
                                        <Input type="text" name="orderTarget" id="orderTarget" value={formData.orderTarget} onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="target">Issued Target</Label>
                                        <Input type="text" name="issuedTarget" id="issuedTarget" value={formData.issuedTarget} onChange={handleChange} required />
                                    </FormGroup>
                                </>
                            )}
                            {formData.job === "Driver" && (
                                <>
                                    <FormGroup>
                                        <Label for="target">Daily Target</Label>
                                        <Input type="text" name="dailyTarget" id="dailyTarget" value={formData.dailyTarget} onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="target">Monthly Target</Label>
                                        <Input type="text" name="monthlyTarget" id="monthlyTarget" value={formData.monthlyTarget} onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="lincenseDate">Lincense Date</Label>
                                        <Input type="date" name="lincenseDate" id="lincenseDate" value={formData.lincenseDate} onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="lincenseimg">Lincense Image (Required)</Label>
                                        <Input type="file" name="lincenseimg" id="lincenseimg" accept="image/*" onChange={handleImageChange} required />
                                    </FormGroup>
                                </>
                            )}
                            <Row>
                                <Col md="6">
                                    <Button type="submit" color="primary" block>Add Employee</Button>
                                </Col>
                                <Col md="6">
                                    <Button type="button" color="danger" block onClick={handleClear}>Clear</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Helmet>  
    );
};

export default AddEmployee;

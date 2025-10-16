import React, { useState } from "react";
import { toast } from "react-toastify";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";
import "../style/addProduct.css";

const AddNewUser = () => {
    const [formData, setFormData] = useState({
        password: "",
        role: "",
        contactNumber: "",
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

        try {
            const userData = {
                password: formData.password,
                role: formData.role,
                contactNumber: formData.contactNumber,
            };

            const response = await fetch("http://localhost:5001/api/auth/emp/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const textResponse = await response.text();
            const result = JSON.parse(textResponse);

            if (!response.ok) {
                throw new Error(result.message || "Failed to add user.");
            }

            toast.success(result.message);
            handleClear();
        } catch (error) {
            console.error("Error submitting user data:", error);
            toast.error(error.message);
        }
    };

    const handleClear = () => {
        setFormData({
            password: "",
            role: "",
            contactNumber: "",
        });
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center">Add New User</h3>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="contactNumber">Contact Number</Label>
                            <Input
                                type="text"
                                name="contactNumber"
                                id="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="role">Role</Label>
                            <Input
                                type="select"
                                name="role"
                                id="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">Sales</option>
                                <option value="DRIVER">Driver</option>
                                <option value="CHASHIER">Cashier</option>
                                <option value="OTHER">Other</option>
                            </Input>
                        </FormGroup>

                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>
                                    Add User
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

export default AddNewUser;

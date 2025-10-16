import React, { useState } from "react";
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col
} from "reactstrap";
import "../style/invoice.css";

const AddNewSupplier = ({ setShowModal, handleSubmit2 }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contact: "",
        contact2: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClear = () => {
        setFormData({
            name: "",
            address: "",
            contact: "",
            contact2: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.contact) {
            alert("Please fill all required fields.");
            return;
        }

        handleSubmit2(formData);
        setShowModal(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="invoice-title">Add New Supplier</h2>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Supplier Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="address">Address</Label>
                        <Input
                            type="textarea"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="contact">Contact</Label>
                        <Input
                            type="text"
                            name="contact"
                            id="contact"
                            value={formData.contact}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="contact2">Secondary Contact</Label>
                        <Input
                            type="text"
                            name="contact2"
                            id="contact2"
                            value={formData.contact2}
                            onChange={handleChange}
                        />
                    </FormGroup>

                    <Row className="mb-3">
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

                    <div className="text-center">
                        <Button color="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddNewSupplier;

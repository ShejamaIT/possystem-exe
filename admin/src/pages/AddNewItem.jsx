import React, { useState, useEffect } from "react";
import {Form, FormGroup, Label, Input, Button, Row, Col} from "reactstrap";
import "../style/invoice.css";
import AddNewSupplier from "../pages/AddNewSupplier";
import {toast} from "react-toastify";

const AddNewItem = ({ setShowModal, handleSubmit2 }) => {
    const [formData, setFormData] = useState({
        I_Id: "", I_name: "", descrip: "", color: "",startStock:"",
        material: "", warrantyPeriod: "", price: "", cost: "", minQty: "", s_Id: "",});

    const [suppliers, setSuppliers] = useState([]);
    const [showSupplierModal, setShowSupplierModal] = useState(false);


    // Fetch categories and suppliers on mount
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/suppliers");
            const data = await response.json();
            if (data.success) {
                setSuppliers(data.suppliers.length > 0 ? data.suppliers : []);
            } else {
                setSuppliers([]);
            }
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            setSuppliers([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmit2(formData);
        setShowModal(false);
    };

    const handleClear = () => {
        setFormData({
            I_Id: "", I_name: "", descrip: "", color: "", material: "", warrantyPeriod: "",startStock:"",
            price: "", cost: "", minQty: "", s_Id: "", });
    };
    const handleAddSupplier = async (newSupplier) => {
        try {
            // Example: Save to server (optional)
            const response = await fetch("http://localhost:5001/api/admin/main/supplier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSupplier),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("✅ Supplier added successfully!");
                // Refetch suppliers to refresh dropdown
                await fetchSuppliers();
            }
        } catch (err) {
            console.error("Failed to add supplier:", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="invoice-title">Add New Item</h2>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="I_Id">Item ID</Label>
                        <Input type="text" name="I_Id" id="I_Id" value={formData.I_Id} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="I_name">Item Name</Label>
                        <Input type="text" name="I_name" id="I_name" value={formData.I_name} onChange={handleChange} required />
                    </FormGroup>                    
                    <FormGroup>
                        <Label for="descrip">Description</Label>
                        <Input type="textarea" name="descrip" id="descrip" value={formData.descrip} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                        <Label for="color">Color</Label>
                        <Input type="text" name="color" id="color" value={formData.color} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                        <Label for="material">Material</Label>
                        <Input type="select" name="material" id="material" value={formData.material}
                               onChange={handleChange} required>
                            <option value="">Select Material</option>
                            <option value="Teak">Teak</option>
                            <option value="Mahogani">Mahogani</option>
                            <option value="Mara">Mara</option>
                            <option value="Attorina">Attorina</option>
                            <option value="Sapu">Sapu</option>
                            <option value="Steel">Steel</option>
                            <option value="MDF">MDF</option>
                            <option value="MM">MM</option>
                            <option value="Mattress">Mattress</option>
                            <option value="Other">Other</option>
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label for="warrantyPeriod">Warranty Period</Label>
                        <Input type="text" name="warrantyPeriod" id="warrantyPeriod" value={formData.warrantyPeriod} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                        <Label for="s_Id" className="fw-bold">Select Supplier</Label>
                        <div className="d-flex gap-2 align-items-start">
                            {/* Dropdown - takes more space */}
                            <div style={{ flex: 2 }}>
                                <Input type="select" name="s_Id" id="s_Id" value={formData.s_Id} onChange={handleChange} required>
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.s_ID} value={supplier.s_ID}>
                                            {supplier.name} ({supplier.contact})
                                        </option>
                                    ))}
                                </Input>
                            </div>

                            {/* Add New Supplier Button */}
                            <div style={{ flex: 1 }}>
                                <Button
                                    color="primary"
                                    className="w-100"
                                    onClick={() => setShowSupplierModal(true)}
                                >
                                    Add New
                                </Button>

                            </div>
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <Label for="cost">Cost</Label>
                        <Input type="text" name="cost" id="cost" value={formData.cost} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="price">Selling Price</Label>
                        <Input type="text" name="price" id="price" value={formData.price} onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                        <Label for="minQty">Min Quantity (for production)</Label>
                        <Input type="text" name="minQty" id="minQty" value={formData.minQty} onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="startStock">Avaliable Stock</Label>
                        <Input type="text" name="startStock" id="startStock" value={formData.startStock} onChange={handleChange} required />
                    </FormGroup>
                    <Row className="mt-3">
                        <Col md={6}>
                            <Button type="submit" color="primary" block>
                                Add Item
                            </Button>
                        </Col>
                        <Col md={6}>
                            <Button type="button" color="secondary" block onClick={handleClear}>Clear</Button>
                        </Col>
                    </Row>
                    <div className="text-center mt-3">
                        <Button type="button" color="danger" onClick={() => setShowModal(false)}>Close</Button>
                    </div>
                </Form>
                {showSupplierModal && (
                    <AddNewSupplier
                        setShowModal={setShowSupplierModal}
                        handleSubmit2={handleAddSupplier}
                    />
                )}

            </div>
        </div>
    );
};

export default AddNewItem;

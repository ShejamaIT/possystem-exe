import React, { useState, useEffect } from "react";
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { toast } from "react-toastify";

const UpdateSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [formData, setFormData] = useState({
        name: "", address: "", contact: "", contact2: ""
    });
    const [supplierItems, setSupplierItems] = useState([]);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/suppliers");
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setSuppliers(data.suppliers || []);
        } catch (err) {
            toast.error("Failed to load suppliers");
        }
    };

    const fetchSupplierDetails = async (sId) => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/supplier-details?s_ID=${sId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setFormData({
                name: data.supplier.name || "",
                address: data.supplier.address || "",
                contact: data.supplier.contact || "",
                contact2: data.supplier.contact2 || "",
            });
        } catch (err) {
            toast.error("Failed to fetch supplier details");
        }
    };

    const fetchSupplierItems = async (sId) => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/supplier-items?s_Id=${sId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setSupplierItems(data.items || []);
        } catch (err) {
            toast.error("Failed to fetch supplier items");
        }
    };

    const handleSelectChange = async (e) => {
        const id = e.target.value;
        setSelectedId(id);
        console.log(id);
        if (id) {
            await fetchSupplierDetails(id);
            await fetchSupplierItems(id);
        } else {
            setFormData({ name: "", address: "", contact: "", contact2: "" });
            setSupplierItems([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/supplier/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("Supplier updated successfully");
            fetchSuppliers();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async () => {
        if (!selectedId || !window.confirm("Are you sure you want to delete this supplier?")) return;
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/supplier/${selectedId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("Supplier deleted");
            fetchSuppliers();
            setSelectedId("");
            setFormData({ name: "", address: "", contact: "", contact2: "" });
            setSupplierItems([]);
        } catch (err) {
            toast.error("Failed to delete supplier");
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Remove this item from the supplier?")) return;
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/supplier-item", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ I_Id: itemId, s_ID: selectedId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("Item removed from supplier");
            setSupplierItems(prev => prev.filter(item => item.I_Id !== itemId));
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    return (
        <Container>
            <h4 className="mt-4 mb-3">Update Supplier</h4>
            <Form onSubmit={handleUpdate}>
                <FormGroup>
                    <Label for="supplierSelect">Select Supplier</Label>
                    <Input
                        type="select"
                        id="supplierSelect"
                        value={selectedId}
                        onChange={handleSelectChange}
                    >
                        <option value="">-- Select Supplier --</option>
                        {suppliers.map(s => (
                            <option key={s.s_ID} value={s.s_ID}>
                                {s.s_ID} - {s.name}
                            </option>
                        ))}
                    </Input>
                </FormGroup>

                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!selectedId}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="contact">Contact</Label>
                            <Input
                                type="text"
                                name="contact"
                                id="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                disabled={!selectedId}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="contact2">Secondary Contact</Label>
                            <Input
                                type="text"
                                name="contact2"
                                id="contact2"
                                value={formData.contact2}
                                onChange={handleChange}
                                disabled={!selectedId}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="address">Address</Label>
                            <Input
                                type="textarea"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={!selectedId}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md="6">
                        <Button color="primary" type="submit" disabled={!selectedId}>
                            Update Supplier
                        </Button>
                    </Col>
                    <Col md="6">
                        <Button color="danger" onClick={handleDelete}>
                            Delete Supplier
                        </Button>
                    </Col>
                </Row>
            </Form>

            {selectedId && (
                <>
                    <h5 className="mt-4">Supplied Items</h5>
                    {supplierItems.length === 0 ? (
                        <p>No items linked with this supplier.</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>Item ID</th>
                                <th>Unit Cost</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {supplierItems.map(item => (
                                <tr key={item.I_Id}>
                                    <td>{item.I_Id}</td>
                                    <td>{item.unit_cost}</td>
                                    <td>
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.I_Id)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </Container>
    );
};

export default UpdateSupplier;

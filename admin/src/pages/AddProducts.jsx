import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import "../style/addProduct.css"; // Import CSS

const AddItem = () => {
    const [formData, setFormData] = useState({
        I_Id: "", I_name: "", descrip: "", color: "", material: "", otherMaterial: "", price: "", warrantyPeriod: "", cost: "", s_Id: "", minQty: "",stockQty:""
    });
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [subCatOne, setSubCatOne] = useState([]);
    const [subCatTwo, setSubCatTwo] = useState([]);
    const [PurchaseId, setPurchaseId] = useState("");
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Fetch Categories
    useEffect(() => {
        fetchSuppliers();fetchPurchaseID();
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
            setSuppliers([]); // Default to empty array on error
        }
    };
    const fetchPurchaseID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/newPurchasenoteID");
            const data = await response.json();
            setPurchaseId(data.PurchaseID);
        } catch (err) {
            toast.error("Failed to load Purchase ID.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Material fallback
        const materialToSend = formData.material === "Other" ? formData.otherMaterial : formData.material;

        // Prepare JSON payload for the item
        const itemPayload = {
            I_Id: formData.I_Id,
            I_name: formData.I_name,
            descrip: formData.descrip,
            color: formData.color,
            material: materialToSend,
            price: formData.price,
            warrantyPeriod: formData.warrantyPeriod,
            cost: formData.cost,
            s_Id: formData.s_Id,
            minQty: formData.minQty
        };

        // Prepare order/purchase data
        const cost = Number(formData.cost);
        const quantity = Number(formData.stockQty);
        const itemTotal = cost * quantity;

        const orderData = {
            purchase_id: PurchaseId,
            supplier_id: formData.s_Id,
            date: currentDate,
            time: currentTime,
            itemTotal,
            delivery: 0,
            invoice: "-",
            items: [{
                I_Id: formData.I_Id,
                material: materialToSend,
                color: formData.color || "N/A",
                unit_price: Number(formData.price),
                price: cost,
                quantity,
                total_price: itemTotal.toFixed(2)
            }]
        };


        // Step 1: Submit item
        const itemRes = await fetch("http://localhost:5001/api/admin/main/add-item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemPayload)
        });
        const itemData = await itemRes.json();

        if (!itemRes.ok) {
            toast.error(itemData.message || "❌ Failed to add item.");
            return;
        }
        toast.success("✅ Item added successfully!");

        // Step 2: If stock quantity > 0, submit stock entry
        if (quantity > 0) {
            const stockRes = await fetch("http://localhost:5001/api/admin/main/addStock2", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const stockData = await stockRes.json();
            if (!stockRes.ok) {
                toast.error(stockData.message || "❌ Failed to save purchase.");
                return;
            }
            toast.success("✅ Purchase saved successfully!");
        }

        // Reset form fields
        setFormData({
            I_Id: "", I_name: "", descrip: "", color: "", material: "", otherMaterial: "", 
            price: "", warrantyPeriod: "", cost: "", s_Id: "", minQty: "", stockQty: ""
        });

        // Reload page to reflect new item
        setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
        console.error("❌ Error submitting form:", error);
        toast.error("❌ An error occurred while adding the item.");
    }
};

    const handleClear = () => {
        setFormData({
            I_Id: "", I_name: "", descrip: "", color: "", material: "", otherMaterial: "", price: "", warrantyPeriod: "", cost: "", s_Id: "", minQty: ""
        });
        setSubCatOne([]);
        setSubCatTwo([]);
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center">Add New Item</h3>
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
                            <Input
                                type="select"
                                name="material"
                                value={formData.material}
                                onChange={handleChange}
                                required
                            >
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
                            <Label for="s_Id">Select Supplier</Label>
                            <Input type="select" name="s_Id" id="s_Id" value={formData.s_Id} onChange={handleChange} required>
                                <option value="">Select Supplier</option>
                                {suppliers.length > 0 ? suppliers.map((supplier) => (
                                    <option key={supplier.s_ID} value={supplier.s_ID}>
                                        {supplier.name} ({supplier.contact})
                                    </option>
                                )) : <option value="">No Suppliers Available</option>}
                            </Input>
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
                            <Label for="stockQty">Available Stock Qty</Label>
                            <Input type="text" name="stockQty" id="stockQty" value={formData.stockQty} onChange={handleChange} required />
                        </FormGroup>
                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>
                                    Add Item
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

export default AddItem;
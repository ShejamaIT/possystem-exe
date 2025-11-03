import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import "../style/addProduct.css";

const UpdateItem = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        I_Id: "",
        stDesc: "",
        lgdesc: "",
        height: "",
        width: "",
        depth: "",
        mnCategory:"",
        type:"",
    });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);

    // Fetch all items on load
    useEffect(() => {
        fetchItems();fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/categories");
            const data = await response.json();
            console.log(data);
            setCategories(data.data.length > 0 ? data.data : []);
        } catch (err) {
            toast.error("Failed to load categories.");
        }
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitems");
            const data = await response.json();
            console.log(data);
            if (Array.isArray(data) && data.length > 0) {
                setItems(data);
                setError(null);
            } else {
                setItems([]);
                setError("No items available.");
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            setError("Error fetching items.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChange = (e) => {
        const itemId = e.target.value;
        setSelectedItem(itemId);
        const selected = items.find((item) => item.I_Id === itemId);
        console.log(selected);
        if (selected) {
            setFormData({
                I_Id: selected.I_Id || "",
                stDesc: selected.stDesc || "",
                lgdesc: selected.lgdesc || "",
                height: selected.height || "",
                width: selected.width || "",
                depth: selected.depth || "",
                mnCategory: selected.mnCategory || "",
                type: selected.type || "",

            });
        } else {
            handleClear();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = new FormData();
            Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
            if (imageFile) payload.append("image", imageFile);

            const res = await fetch("http://localhost:5001/api/admin/main/item-details", {
                method: "POST",
                body: payload
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "❌ Failed to add/update item.");
                return;
            }

            toast.success("✅ Item saved successfully!");
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error("❌ Error submitting form:", error);
            toast.error("❌ An error occurred while saving the item.");
        }
    };

    const handleClear = () => {
        setFormData({
            I_Id: "",
            stDesc: "",
            lgdesc: "",
            height: "",
            width: "",
            depth: "",
            mnCategory:"",
            type:"",
        });
        setImageFile(null);
        setSelectedItem("");
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center mb-4">Update Item Details</h3>

                    {loading && <p>Loading items...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="itemSelect">Select Existing Item</Label>
                            <Input
                                type="select"
                                id="itemSelect"
                                value={selectedItem}
                                onChange={handleSelectChange}
                            >
                                <option value="">-- Select Item --</option>
                                {items.map((item) => (
                                    <option key={item.I_Id} value={item.I_Id}>
                                        {item.I_name}({item.I_Id}) {/* You can show name if available */}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="I_Id">Item ID</Label>
                            <Input
                                type="text"
                                name="I_Id"
                                id="I_Id"
                                value={formData.I_Id}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="mnCategory">Main Category</Label>
                            <Input
                                type="select"
                                name="mnCategory"
                                id="mnCategory"
                                value={formData.mnCategory}
                                onChange={handleChange}
                            >
                                <option value="">Select Main Category</option>
                                <option value="Home">Home Furniture</option>
                                <option value="Kids">Kids Furniture</option>
                                <option value="Office">Office Furniture</option>
                                <option value="Hotel">Hotel Furniture</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="type">Sub Category</Label>
                            <Input
                                type="select"
                                name="type"
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.Ca_Id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="stDesc">Short Description</Label>
                            <Input
                                type="textarea"
                                name="stDesc"
                                id="stDesc"
                                value={formData.stDesc}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="lgdesc">Long Description</Label>
                            <Input
                                type="textarea"
                                name="lgdesc"
                                id="lgdesc"
                                value={formData.lgdesc}
                                onChange={handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="height">Height</Label>
                            <Input
                                type="text"
                                name="height"
                                id="height"
                                value={formData.height}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="width">Width</Label>
                            <Input
                                type="text"
                                name="width"
                                id="width"
                                value={formData.width}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="depth">Depth</Label>
                            <Input
                                type="text"
                                name="depth"
                                id="depth"
                                value={formData.depth}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="image">Upload Image</Label>
                            <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                            {imageFile && <small>Selected file: {imageFile.name}</small>}
                        </FormGroup>

                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>
                                    Save Item
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

export default UpdateItem;

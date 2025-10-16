import React, { useState, useEffect } from "react";
import { Container, Row, Col, Label, Input, Button } from "reactstrap";
import { toast } from "react-toastify";

const AddOtherDetails = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Track selected subcategory
    const [catname, setCatname] = useState({ Catname: "" });
    const [formData, setFormData] = useState({
        Ca_Id: "",
        sub_one: "",
        sub_two: "",
        subcatone_img: null,
        subcattwo_img: null,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/categories");
            const data = await response.json();
            setCategories(data.length > 0 ? data : []);
        } catch (err) {
            toast.error("Failed to load categories.");
        }
    };

    const handleCategoryChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/find-subcategory?Ca_Id=${value}`);
            const data = await response.json();
            const subcategoriesData = data.data && data.data.length > 0 ? data.data : [];

            // Add "New" option for adding a new subcategory
            setSubCategories([...subcategoriesData, { sb_c_id: "new", subcategory: "New" }]);
            setSelectedSubcategory(""); // Reset selection
        } catch (err) {
            toast.error("Failed to load subcategories.");
        }
    };

    const handleSubcategoryChange = (e) => {
        const value = e.target.value;
        setSelectedSubcategory(value);
        setFormData((prev) => ({ ...prev, sub_one: value === "New" ? "" : value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmitSubCategory = async () => {
        if (!formData.Ca_Id || (!formData.sub_one && selectedSubcategory !== "New")) {
            toast.error("Category and Sub-category One are required.");
            return;
        }

        // If "New" is selected, require an image
        if (selectedSubcategory === "New" && !formData.subcatone_img) {
            toast.error("Image is required for a new sub-category.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("Ca_Id", formData.Ca_Id);
        formDataToSend.append("sub_one", formData.sub_one || selectedSubcategory);
        formDataToSend.append("isNewSubOne", selectedSubcategory === "New" ? "true" : "false");

        if (formData.sub_two && formData.sub_two !== "None") {
            formDataToSend.append("sub_two", formData.sub_two);
        } else {
            formDataToSend.append("sub_two", "None");
        }

        // Append image file only if a new subcategory is being added
        if (selectedSubcategory === "New" && formData.subcatone_img) {
            formDataToSend.append("subcatone_img", formData.subcatone_img);
        }

        if (formData.sub_two !== "None" && formData.subcattwo_img) {
            formDataToSend.append("subcattwo_img", formData.subcattwo_img);
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/subcategory", {
                method: "POST",
                body: formDataToSend,
            });
            const result = await response.json();

            if (result.success) {
                toast.success("Sub-category added successfully!");
                setFormData({
                    Ca_Id: "",
                    sub_one: "",
                    sub_two: "",
                    subcatone_img: null,
                    subcattwo_img: null,
                });
                setSelectedSubcategory(""); // Reset selection
                // Auto-refresh the page
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to add sub-category.");
        }
    };
    const handleSaveCategory = async () => {
        if (!catname.Catname.trim()) {
            toast.error("Category name cannot be empty!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Catname: catname.Catname }),
            });

            const result = await response.json();

            if (result.success) {
                fetchCategories();
                toast.success("Category added successfully!");
                setCatname({ Catname: "" }); // Reset the input field
            } else {
                toast.error(result.message || "Failed to add category.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to add category. Please try again.");
        }
    };

    return (
        <Container className="add-item-container">
            <Row className="justify-content-center">
                <Col lg="6" className="d-flex flex-column gap-4">
                    {/* Add Category Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Add Category</Label>
                        <Input
                            type="text"
                            placeholder="Enter category name"
                            className="mb-2"
                            name="Catname"
                            value={catname.Catname}
                            onChange={(e) => setCatname({ Catname: e.target.value })}
                        />
                        <Button color="primary" onClick={handleSaveCategory}>
                            Add Category
                        </Button>
                    </div>

                    {/* Add Sub-Category Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Select Category</Label>
                        <Input
                            type="select"
                            className="mb-2"
                            name="Ca_Id"
                            id="Ca_Id"
                            value={formData.Ca_Id}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Input>

                        <Label className="fw-bold">Add Sub-Category One</Label>
                        <Input
                            type="select"
                            className="mb-2"
                            name="sub_one"
                            value={selectedSubcategory}
                            onChange={handleSubcategoryChange}
                        >
                            <option value="">Select Subcategory</option>
                            {subcategories.map((sub) => (
                                <option key={sub.sb_c_id} value={sub.subcategory}>
                                    {sub.subcategory}
                                </option>
                            ))}
                        </Input>

                        {/* Show input field if "New" is selected */}
                        {selectedSubcategory === "New" && (
                            <Input
                                type="text"
                                placeholder="Enter new sub-category"
                                className="mb-2"
                                name="sub_one"
                                value={formData.sub_one}
                                onChange={handleChange}
                            />
                        )}

                        <Input
                            type="file"
                            accept="image/*"
                            className="mb-2"
                            name="subcatone_img"
                            onChange={handleFileChange}
                        />

                        <Label className="fw-bold">Add Sub-Category Two</Label>
                        <Input
                            type="text"
                            placeholder="Enter second sub-category"
                            className="mb-2"
                            name="sub_two"
                            value={formData.sub_two}
                            onChange={handleChange}
                        />
                        <Input
                            type="file"
                            accept="image/*"
                            className="mb-2"
                            name="subcattwo_img"
                            onChange={handleFileChange}
                        />

                        <Button color="success" onClick={handleSubmitSubCategory}>
                            Add Sub-Category
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddOtherDetails;

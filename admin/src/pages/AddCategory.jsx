import React, { useState, useEffect } from "react";
import { Container, Row, Col, Label, Input, Button, Table, Spinner } from "reactstrap";
import { toast } from "react-toastify";

const AddCategory = () => {
    const [categories, setCategories] = useState([]);
    const [catname, setCatname] = useState({ Catname: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
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
                // 👇 Add new category directly without refetch for instant update
                // setCategories((prev) => [...prev, result.data]);
                fetchCategories();
                toast.success("Category added successfully!");
                setCatname({ Catname: "" });
            } else {
                toast.error(result.message || "Failed to add category.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to add category. Please try again.");
        }
    };

    return (
        <Container className="add-item-container mt-4">
            <Row className="justify-content-center">
                <Col lg="6" className="d-flex flex-column gap-4">
                    {/* Add Category Section */}
                    <div className="p-3 border rounded shadow-sm bg-light">
                        <Label className="fw-bold mb-2">Add Category</Label>
                        <Input
                            type="text"
                            placeholder="Enter category name"
                            className="mb-2"
                            name="Catname"
                            value={catname.Catname}
                            onChange={(e) => setCatname({ Catname: e.target.value })}
                        />
                        <Button color="primary" onClick={handleSaveCategory} disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Add Category"}
                        </Button>
                    </div>

                    {/* Category List Table */}
                    <div className="p-3 border rounded shadow-sm bg-white">
                        <h5 className="fw-bold mb-3">Category List</h5>

                        {loading ? (
                            <div className="text-center p-3">
                                <Spinner color="primary" />
                            </div>
                        ) : categories.length > 0 ? (
                            <Table bordered hover responsive>
                                <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Category ID</th>
                                        <th>Name</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, index) => (
                                        <tr key={cat.Ca_Id}>
                                            <td>{index + 1}</td>
                                            <td>{cat.id}</td>
                                            <td>{cat.name}</td>
                                            <td>{cat.itemCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted">No categories available.</p>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddCategory;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";

const AddCategory = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCat, setSelectedMainCat] = useState("");
  const [types, setTypes] = useState([]);
  const [catname, setCatname] = useState({ Catname: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMainCategories();
  }, []);

  // -------------------- Fetch Main Categories --------------------
  const fetchMainCategories = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/admin/main/categories");
      const data = await response.json();
      if (data.success) {
        setMainCategories(data.data || []);
      } else {
        toast.error("Failed to load main categories.");
      }
    } catch (err) {
      toast.error("Failed to load main categories.");
    }
  };

  // -------------------- Fetch Types (Subcategories) --------------------
  const fetchTypes = async (mainCategoryName) => {
    if (!mainCategoryName) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/admin/main/categories/hierarchy");
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const selected = data.data.find(
          (item) => item.mainCategory === mainCategoryName
        );
        setTypes(selected ? selected.subCategories : []);
      } else {
        toast.error("Failed to load type data.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading type data.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Save Main Category --------------------
  const handleSaveMainCategory = async () => {
    if (!catname.Catname.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/admin/main/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Catname: catname.Catname }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Main category added successfully!");
        setCatname({ Catname: "" });
        fetchMainCategories();
      } else {
        toast.error(result.message || "Failed to add main category.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <Container className="add-item-container mt-4">
      <Row className="justify-content-center">
        <Col lg="8" className="d-flex flex-column gap-4">

          {/* ---------------- Add Main Category ---------------- */}
          <div className="p-3 border rounded shadow-sm bg-light">
            <Label className="fw-bold mb-2">Add Main Category</Label>
            <Input
              type="text"
              placeholder="Enter main category name"
              className="mb-2"
              name="Catname"
              value={catname.Catname}
              onChange={(e) => setCatname({ Catname: e.target.value })}
            />
            <Button color="primary" onClick={handleSaveMainCategory} disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Add Category"}
            </Button>
          </div>

          {/* ---------------- Select Main Category ---------------- */}
          <div className="p-3 border rounded shadow-sm bg-white">
            <Label className="fw-bold mb-2">Select Main Category</Label>
            <Input
              type="select"
              className="mb-3"
              value={selectedMainCat}
              onChange={(e) => {
                setSelectedMainCat(e.target.value);
                fetchTypes(e.target.value);
              }}
            >
              <option value="">-- Select Main Category --</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Input>

            {/* ---------------- Table for Types ---------------- */}
            {loading ? (
              <div className="text-center p-3">
                <Spinner color="primary" />
              </div>
            ) : selectedMainCat ? (
              types.length > 0 ? (
                <>
                  <h5 className="fw-bold mb-3 text-primary">
                    {selectedMainCat} - Types
                  </h5>
                  <Table bordered hover responsive>
                    <thead className="table-primary">
                      <tr>
                        <th>#</th>
                        <th>Type Name</th>
                        <th>Item Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {types.map((type, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{type.subCategory}</td>
                          <td>{type.itemCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <p className="text-center text-muted mb-0">
                  No types available for <b>{selectedMainCat}</b>.
                </p>
              )
            ) : (
              <p className="text-center text-muted mb-0">
                Select a main category to view its types.
              </p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCategory;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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

const UpdateCourier = () => {
  const navigate = useNavigate();

  const [couriers, setCouriers] = useState([]); // all couriers for dropdown
  const [selectedId, setSelectedId] = useState(""); // selected courier id

  const [formData, setFormData] = useState({
    serviceName: "",
    contact: "",
    othercontact: "",
    address: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch all courier services for dropdown
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/admin/main/courier");
        if (!response.ok) throw new Error("Failed to fetch courier list");
        const data = await response.json();
        setCouriers(data);
      } catch (error) {
        console.error("Error fetching couriers:", error);
        toast.error(error.message);
      }
    };

    fetchCouriers();
  }, []);

  // ✅ Fetch selected courier details
  const handleSelectCourier = async (id) => {
    setSelectedId(id);
    if (!id) return;

    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/main/courier/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch courier details");
      const data = await response.json();
      setFormData({
        serviceName: data.ser_name || data.serviceName || "",
        contact: data.contact || "",
        othercontact: data.othercontact || "",
        address: data.address || "",
        type: data.type || "",
      });
    } catch (error) {
      console.error("Error fetching courier:", error);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Update courier
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      toast.error("Please select a courier to update.");
      return;
    }

    if (!formData.serviceName || !formData.contact || !formData.type) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/main/courier/${selectedId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed.");

      toast.success(result.message || "Courier updated successfully!");
      navigate("/admin-dashboard/delivery?tab=Courier%20Services"); // go back to courier list
    } catch (error) {
      console.error("Error updating courier:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="add-item-container">
      <Row>
        <Col lg="8" className="mx-auto">
          <h3 className="text-center">Update Courier</h3>

          {/* ✅ Dropdown to select courier */}
          <FormGroup>
            <Label for="courierSelect">Select Courier</Label>
            <Input
              type="select"
              id="courierSelect"
              value={selectedId}
              onChange={(e) => handleSelectCourier(e.target.value)}
            >
              <option value="">-- Select Courier --</option>
              {couriers.map((c) => (
                <option key={c.Id} value={c.Id}>
                  {c.ser_name || c.serviceName}
                </option>
              ))}
            </Input>
          </FormGroup>

          {/* ✅ Only show form when a courier is selected */}
          {selectedId && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="serviceName">Courier Service Name</Label>
                <Input
                  type="text"
                  name="serviceName"
                  id="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
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
                <Label for="othercontact">Other Contact</Label>
                <Input
                  type="text"
                  name="othercontact"
                  id="othercontact"
                  value={formData.othercontact}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="type">Type</Label>
                <Input
                  type="select"
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Cod">COD</option>
                  <option value="Paid">Paid</option>
                </Input>
              </FormGroup>

              <Row>
                <Col md="6">
                  <Button
                    type="submit"
                    color="primary"
                    block
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Courier"}
                  </Button>
                </Col>
                <Col md="6">
                  <Button
                    type="button"
                    color="secondary"
                    block
                    onClick={() => navigate("/couriers")}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateCourier;

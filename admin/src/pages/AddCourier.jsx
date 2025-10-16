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

const AddCourier = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    contact: "",
    othercontact: "",
    address: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceName || !formData.contact || !formData.type) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // optional: validate contact number
    if (!/^\d+$/.test(formData.contact)) {
      toast.error("Contact must be numeric.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5001/api/admin/main/courier",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to add courier.");

      toast.success(result.message || "Courier added successfully!");
      handleClear();
    } catch (error) {
      console.error("Error adding courier:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      serviceName: "",
      contact: "",
      othercontact: "",
      address: "",
      type: "",
    });
  };

  return (
    <Container className="add-item-container">
      <Row>
        <Col lg="8" className="mx-auto">
          <h3 className="text-center">Add New Courier</h3>
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
                required
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
                <Button type="submit" color="primary" block disabled={loading}>
                  {loading ? "Saving..." : "Add Courier"}
                </Button>
              </Col>
              <Col md="6">
                <Button
                  type="button"
                  color="danger"
                  block
                  onClick={handleClear}
                >
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

export default AddCourier;

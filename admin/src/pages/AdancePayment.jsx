import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import "../style/addProduct.css";

const AdvancePayment = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        nic: "",
        job: "",
        basic: "",
        advance: "",
        date:"",
    });

    // Fetch Employees
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/employees");
            const data = await response.json();
            if (data.success && Array.isArray(data.employees)) {
                setEmployees(data.employees);
            } else {
                setEmployees([]);
            }
        } catch (err) {
            console.error("Error fetching employees:", err);
            setEmployees([]); // Default to empty array on error
        }
    };

    const handleEmployeeSelect = (e) => {
        const selectedId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.E_Id === selectedId);

        if (selectedEmployee) {
            setFormData({
                id: selectedEmployee.E_Id,
                name: selectedEmployee.name,
                nic: selectedEmployee.nic,
                job: selectedEmployee.job,
                basic: selectedEmployee.basic,
                advance: "",
            });
        } else {
            setFormData({
                id: "",name: "",nic: "",job: "",basic: "",advance: "",date:""
            });
        }
    };
    const handleClear = () => {
        setFormData({
            id: "",name: "",nic: "",job: "",basic: "",advance: "",date:""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "advance" ? parseFloat(value) || "" : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.advance) {
            toast.error("Please fill out all required details.");
            return;
        }
        try {
            // Prepare employee data for submission
            const employeeData = {
                id: formData.id,
                name: formData.name,
                advance: formData.advance,
                date: formData.date,
            };

            // Send the request to the backend
            const response = await fetch("http://localhost:5001/api/admin/main/save-advance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employeeData),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                handleClear();
                setTimeout(() => {
                    fetchEmployees();  // You can call this to refresh employee data
                }, 1000);
            } else {
                toast.error(result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting employee data:", error);
            toast.error(error.message);
        }
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center">Advance Payment</h3>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="id">Select Employee</Label>
                            <Input type="select" name="id" id="id" value={formData.id} onChange={handleEmployeeSelect}>
                                <option value="">-- Select Employee --</option>
                                {employees.length > 0 ? (
                                    employees.map(emp => (
                                        <option key={emp.E_Id} value={emp.E_Id}>
                                            {emp.E_Id} - {emp.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No employees available</option>
                                )}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input type="text" name="name" id="name" value={formData.name} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="nic">NIC</Label>
                            <Input type="text" name="nic" id="nic" value={formData.nic} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="job">Job Role</Label>
                            <Input type="text" name="job" id="job" value={formData.job} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="basic">Basic Salary</Label>
                            <Input type="text" name="basic" id="basic" value={formData.basic} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="advance">Advance Payment</Label>
                            <Input type="text" name="advance" id="advance" value={formData.advance} onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="date">Given Date</Label>
                            <Input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required />
                        </FormGroup>
                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>Add Advance</Button>
                            </Col>
                            <Col md="6">
                                <Button type="button" color="danger" block onClick={handleClear}>Clear</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AdvancePayment;

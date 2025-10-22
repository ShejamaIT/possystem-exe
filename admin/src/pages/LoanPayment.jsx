import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import "../style/addProduct.css";

const LoanPayment = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        nic: "",
        job: "",
        basic: "",
        loan: "",
        months: "",
        installment: "",
    });

    // Fetch Employees
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/Permanent-employees");
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
                loan: "",
                months: "",
                installment: "",
            });
        } else {
            setFormData({
                id: "",
                name: "",
                nic: "",
                job: "",
                basic: "",
                loan: "",
                months: "",
                installment: "",
            });
        }
    };

    const handleClear = () => {
        setFormData({
            id: "",
            name: "",
            nic: "",
            job: "",
            basic: "",
            loan: "",
            months: "",
            installment: "",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form data
        setFormData((prev) => {
            const updatedFormData = {
                ...prev,
                [name]: name === "loan" || name === "months" ? parseFloat(value) || "" : value,
            };

            // Calculate the installment amount if both loan and months are provided
            if (updatedFormData.loan && updatedFormData.months) {
                const installment = updatedFormData.loan / updatedFormData.months;
                updatedFormData.installment = installment.toFixed(2); // Round to 2 decimal places
            }

            return updatedFormData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.loan || !formData.months || !formData.installment) {
            toast.error("Please fill out all required details.");
            return;
        }

        try {
            const employeeData = {
                id: formData.id,
                name: formData.name,
                loan: formData.loan,
                months: formData.months,
                installment: formData.installment,
            };
            const response = await fetch("http://localhost:5001/api/admin/main/save-loan", {
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
                    fetchEmployees();  // Refresh employee data
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
                    <h3 className="text-center">Loan Payment</h3>
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
                            <Label for="job">Job Role</Label>
                            <Input type="text" name="job" id="job" value={formData.job} readOnly />
                        </FormGroup>

                        <FormGroup>
                            <Label for="basic">Basic Salary</Label>
                            <Input type="text" name="basic" id="basic" value={formData.basic} readOnly />
                        </FormGroup>

                        <FormGroup>
                            <Label for="loan">Loan Amount</Label>
                            <Input type="text" name="loan" id="loan" value={formData.loan} onChange={handleChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label for="month">Duration</Label>
                            <Input type="select" name="months" id="months" value={formData.months} onChange={handleChange} required>
                                <option value="">Select Duration</option>
                                <option value="1">1 Month</option>
                                <option value="2">2 Months</option>
                                <option value="3">3 Months</option>
                                <option value="4">4 Months</option>
                                <option value="5">5 Months</option>
                                <option value="6">6 Months</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="installment">Installment Amount</Label>
                            <Input type="text" name="installment" id="installment" value={formData.installment} readOnly />
                        </FormGroup>
                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>Add Loan</Button>
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

export default LoanPayment;

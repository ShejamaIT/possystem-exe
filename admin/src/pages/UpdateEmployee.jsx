import React, { useState, useEffect } from "react";
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import { toast } from "react-toastify";

const UpdateEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedId, setSelectedId] = useState("");
     const [licenseImage, setLicenseImage] = useState(null);
    const [formData, setFormData] = useState({
        name: "", address: "", nic: "", dob: "", contact: "", job: "", basic: "", type: "", devID: "", dailyTarget: "",
        monthlyTarget: "", lincenseDate: "", stID: "", orderTarget: "", issuedTarget: "",
        driver: { devID: "", balance: "", dailyTarget: "", monthlyTarget: "" },
        sales: { stID: "", orderTarget: "", issuedTarget: "" }
    });

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
                toast.error("Failed to load employees");
                setEmployees([]);
            }
        } catch (err) {
            console.error("Error fetching employees:", err);
            toast.error("Server error while fetching employees");
            setEmployees([]);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return ''; // if invalid date
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const handleSelectChange = async (e) => {
        const id = e.target.value;
        setSelectedId(id);

        if (!id) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/employee-details?E_Id=${id}`);
            const result = await response.json();

            if (!result.success) throw new Error(result.message || "Failed to fetch employee details");

            const emp = result.data;

            // Update the formData with driver and sales objects if applicable
            setFormData({
            name: emp.name || "",
            address: emp.address || "",
            nic: emp.nic || "",
            dob: formatDate(emp.dob),
            contact: emp.contact || "",
            job: emp.job || "",
            basic: emp.basic || "",
            type: emp.type || "",
            devID: emp.driver?.devID || "",
            dailyTarget: emp.driver?.dailyTarget || "",
            monthlyTarget: emp.driver?.monthlyTarget || "",
            lincenseDate: formatDate(emp.driver?.lincenseDate),
            stID: emp.sales?.stID || "",
            orderTarget: emp.sales?.orderTarget || "",
            issuedTarget: emp.sales?.issuedTarget || "",
            driver: {
                devID: emp.driver?.devID || "",
                balance: emp.driver?.balance || "",
                dailyTarget: emp.driver?.dailyTarget || "",
                monthlyTarget: emp.driver?.monthlyTarget || "",
                lincenseDate: formatDate(emp.driver?.lincenseDate),
            },
            sales: {
                stID: emp.sales?.stID || "",
                orderTarget: emp.sales?.orderTarget || "",
                issuedTarget: emp.sales?.issuedTarget || "",
            }
            });

        } catch (error) {
            console.error("Failed to fetch full employee details:", error);
            toast.error("Failed to fetch detailed data");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "orderTarget" || name === "issuedTarget") {
            setFormData(prev => ({
                ...prev,
                sales: {
                    ...prev.sales,
                    [name]: value,
                }
            }));
        } else if (name === "devID" || name === "dailyTarget" || name === "monthlyTarget" || name === "balance" || name === "lincenseDate") {
            setFormData(prev => ({
                ...prev,
                driver: {
                    ...prev.driver,
                    [name]: value,
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleFileChange = (e) => {
        setLicenseImage(e.target.files[0]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Ensure you check if the job is "Sales" or "Driver" and update the corresponding data
        const updatedFormData = {
            ...formData,
            sales: formData.job === "Sales" ? {
                stID: formData.sales.stID,
                orderTarget: formData.sales.orderTarget,
                issuedTarget: formData.sales.issuedTarget
            } : null,
            driver: formData.job === "Driver" ? {
                devID: formData.driver.devID,
                balance: formData.driver.balance,
                dailyTarget: formData.driver.dailyTarget,
                monthlyTarget: formData.driver.monthlyTarget,
                lincenseDate: formData.driver.lincenseDate
            } : null,
        };

        console.log("Updated Form Data:", updatedFormData); // Log updated data to check the structure

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/employees/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFormData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Update failed");
            }

            toast.success("Employee updated successfully");
        } catch (err) {
            console.error("Update failed:", err);
            toast.error(err.message);
        }
    };
    const handleDelete = async () => {
        console.log(selectedId);
            if (!selectedId) return;
            if (!window.confirm("Are you sure you want to delete this user?")) return;
    
            try {
                const res = await fetch(`http://localhost:5001/api/admin/main/employees/${selectedId}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                toast.success("Employee deleted");
                fetchEmployees();
            } catch (err) {
                toast.error("Error deleting user");
            }
        };
    

    return (
        <Container>
            <h4 className="mt-4 mb-3">Update Employee</h4>
            <Form onSubmit={handleUpdate}>
                <FormGroup>
                    <Label for="employeeSelect">Select Employee</Label>
                    <Input
                        type="select"
                        id="employeeSelect"
                        value={selectedId}
                        onChange={handleSelectChange}
                    >
                        <option value="">-- Select Employee --</option>
                        {employees.map(emp => (
                            <option key={emp.E_Id} value={emp.E_Id}>
                                {emp.E_Id} - {emp.name}
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
                            <Label for="nic">NIC</Label>
                            <Input
                                type="text"
                                name="nic"
                                id="nic"
                                value={formData.nic}
                                onChange={handleChange}
                                disabled={!selectedId}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
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
                    <Col md="6">
                        <FormGroup>
                            <Label for="dob">Date of Birth</Label>
                            <Input
                                type="date"
                                name="dob"
                                id="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                disabled={!selectedId}
                            />
                        </FormGroup>
                    </Col>
                </Row>

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

                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="job">Job Role</Label>
                            <Input
                                type="select"
                                name="job"
                                id="job"
                                value={formData.job}
                                onChange={handleChange}
                                disabled={!selectedId}
                            >
                                <option value="">Select</option>
                                <option value="Sales">Sales</option>
                                <option value="Driver">Driver</option>
                                <option value="HR">HR</option>
                                <option value="Admin">Admin</option>
                                <option value="It">It</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="type">Job Type</Label>
                            <Input
                                type="select"
                                name="type"
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                disabled={!selectedId}
                            >
                                <option value="">Select</option>
                                <option value="Permanent">Permanent</option>
                                <option value="Intern">Intern</option>
                                <option value="Temporary">Temporary</option>
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <FormGroup>
                    <Label for="basic">Basic Salary</Label>
                    <Input
                        type="number"
                        name="basic"
                        id="basic"
                        value={formData.basic}
                        onChange={handleChange}
                        disabled={!selectedId}
                    />
                </FormGroup>

                {formData.job === "Driver" && (
                    <>
                        <h5 className="mt-3">Driver Details</h5>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="devID">Device ID</Label>
                                    <Input
                                        type="text"
                                        name="devID"
                                        id="devID"
                                        value={formData.driver?.devID}
                                        onChange={handleChange}
                                        disabled={!selectedId}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="lincenseDate">License Expiry Date</Label>
                                    <Input
                                        type="date"
                                        name="lincenseDate"
                                        id="lincenseDate"
                                        value={formData.driver?.lincenseDate}
                                        onChange={handleChange}
                                        disabled={!selectedId}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="dailyTarget">Daily Target</Label>
                                    <Input
                                        type="number"
                                        name="dailyTarget"
                                        id="dailyTarget"
                                        value={formData.driver?.dailyTarget}
                                        onChange={handleChange}
                                        disabled={!selectedId}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="monthlyTarget">Monthly Target</Label>
                                    <Input
                                        type="number"
                                        name="monthlyTarget"
                                        id="monthlyTarget"
                                        value={formData.driver?.monthlyTarget}
                                        onChange={handleChange}
                                        disabled={!selectedId}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </>
                )}

                {formData.job === "Sales" && (
                    <>
                        <h5 className="mt-3">Sales Team Details</h5>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="orderTarget">Order Target</Label>
                                    <Input
                                        type="number"
                                        name="orderTarget"
                                        id="orderTarget"
                                        value={formData.sales?.orderTarget}
                                        onChange={handleChange}
                                        disabled={!selectedId}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Label for="issuedTarget">Issued Target</Label>
                                    <Input
                                        type="number"
                                        name="issuedTarget"
                                        id="issuedTarget"
                                        value={formData.sales?.issuedTarget}
                                        onChange={handleChange}
                                        disabled={!selectedId}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </>
                )}

                <Row>
                    <Col md="6">
                        <Button color="primary" type="submit" disabled={!selectedId}>Update Employee</Button>
                    </Col>
                    <Col md="6">
                        <Button color="danger" block onClick={handleDelete}>Delete Employee</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default UpdateEmployee;

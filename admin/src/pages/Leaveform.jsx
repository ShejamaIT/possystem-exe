import React, { useState, useEffect } from "react";
import {
    Container,Row,Col,Form,Label,Input,FormGroup,Button} from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import "../style/SaleteamDetail.css";
import { toast } from "react-toastify";

const Leaveform = () => {
    const [formData, setFormData] = useState({
        id: "",
        date: "",
        type: "",
        reason: "",
    });

    const [employees, setEmployees] = useState([]);
    const [type1, setType1] = useState(""); // to check user type

    useEffect(() => {
        const userType = localStorage.getItem("type");
        const eid = localStorage.getItem("EID");
        setType1(userType);

        if (userType !== "ADMIN") {
            setFormData((prev) => ({ ...prev, id: eid }));
        } else {
            fetchEmployees();
        }
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/employees");
            const data = await response.json();
            if (data.success && Array.isArray(data.employees)) {
                setEmployees(data.employees);
            } else {
                toast.error("Failed to load employees.");
            }
        } catch (err) {
            console.error("Error fetching employees:", err);
            toast.error("Error loading employees.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id, date, type, reason } = formData;

        if (!id || !date || !type || !reason) {
            toast.error("Please fill out all required details.");
            return;
        }

        console.log(formData);

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/add-leave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, date, type, reason }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Leave successfully recorded.");
                handleClear();
            } else {
                toast.error(result.message || "Failed to add leave.");
            }
        } catch (error) {
            console.error("Error submitting leave:", error);
            toast.error("Server error. Please try again later.");
        }
    };

    const handleClear = () => {
        setFormData({
            id: type1 === "ADMIN" ? "" : localStorage.getItem("EID"),
            date: "",
            type: "",
            reason: "",
        });
    };

    return (
        <Helmet title={`Leave Form`}>
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h3 className="text-center">Leave Form</h3>
                            <Form onSubmit={handleSubmit}>
                                {type1 === "ADMIN" && (
                                    <FormGroup>
                                        <Label for="id">Select Employee</Label>
                                        <Input
                                            type="select"
                                            name="id"
                                            id="id"
                                            value={formData.id}
                                            onChange={(e) =>
                                                setFormData({ ...formData, id: e.target.value })
                                            }
                                        >
                                            <option value="">-- Select Employee --</option>
                                            {employees.map((emp) => (
                                                <option key={emp.E_Id} value={emp.E_Id}>
                                                    {emp.name} ({emp.job})
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                )}

                                <FormGroup>
                                    <Label for="date">Leave Date</Label>
                                    <Input
                                        type="date"
                                        name="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="type">Leave Duration Type</Label>
                                    <Input
                                        type="select"
                                        name="type"
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, type: e.target.value })
                                        }
                                    >
                                        <option value="">-- Select Type --</option>
                                        <option value="Full-day">Full-day Leave</option>
                                        <option value="Half-day">Half-day Leave</option>
                                    </Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="reason">Reason</Label>
                                    <Input
                                        type="text"
                                        name="reason"
                                        id="reason"
                                        value={formData.reason}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reason: e.target.value })
                                        }
                                    />
                                </FormGroup>

                                <Row>
                                    <Col md="6">
                                        <Button type="submit" color="primary" block>
                                            Add Leave
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
            </section>
        </Helmet>
    );
};

export default Leaveform;

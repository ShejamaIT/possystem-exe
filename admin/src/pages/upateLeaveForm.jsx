import React, { useState, useEffect } from "react";
import {Container, Row,Col,Form,Label, Input,FormGroup,Button,} from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { toast } from "react-toastify";

const UpdateLeaveform = () => {
    const [formData, setFormData] = useState({
        id: "", date: "", type: "", reason: "", present: "Out", leaveId: "",});
    const [employees, setEmployees] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (formData.id && selectedMonth && selectedYear) {
            fetchLeaves();
        } else {
            setLeaves([]);
            setFormData((prev) => ({
                ...prev,
                leaveId: "", date: "", type: "",reason: "",present: "Out",
            }));
        }
    }, [formData.id, selectedMonth, selectedYear]);

    const fetchEmployees = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/employees");
            const data = await res.json();
            if (data.success) {
                setEmployees(data.employees);
            }
        } catch (err) {
            toast.error("Error fetching employees");
        }
    };

    const fetchLeaves = async () => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/leaves/${formData.id}/${selectedMonth}/${selectedYear}`);
            const data = await res.json();
            if (data.success) {
                setLeaves(data.leaves);
            } else {
                toast.info("No leave records found.");
                setLeaves([]);
            }
        } catch (err) {
            toast.error("Error fetching leaves.");
        }
    };

    const handleLeaveSelect = (e) => {
        const selected = leaves.find((lv) => lv.id === parseInt(e.target.value));
        if (selected) {
            setFormData({
                ...formData,
                leaveId: selected.id,
                date: selected.date.split("T")[0],
                type: selected.duration_type,
                reason: selected.reason,
                present: selected.present || "Out",
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const { leaveId, date, type, reason, present } = formData;

        if (!leaveId || !date || !type || !reason || present === "") {
            toast.error("All fields are required.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/update-leave/${leaveId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date, duration_type: type, reason, present }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Leave updated successfully.");
                fetchLeaves();
            } else {
                toast.error("Failed to update.");
            }
        } catch (err) {
            toast.error("Server error.");
        }
    };

    const months = [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <Helmet title="Update Leave Form">
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h3 className="text-center">Update Leave Record</h3>
                            <Form onSubmit={handleUpdate}>
                                <Row>
                                    <Col md="4">
                                        <FormGroup>
                                            <Label>Employee</Label>
                                            <Input
                                                type="select"
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
                                    </Col>
                                    <Col md="4">
                                        <FormGroup>
                                            <Label>Month</Label>
                                            <Input
                                                type="select"
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                            >
                                                <option value="">-- Select Month --</option>
                                                {months.map((m) => (
                                                    <option key={m.value} value={m.value}>
                                                        {m.label}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col md="4">
                                        <FormGroup>
                                            <Label>Year</Label>
                                            <Input
                                                type="select"
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                            >
                                                {years.map((y) => (
                                                    <option key={y} value={y}>
                                                        {y}
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                {leaves.length > 0 && (
                                    <FormGroup>
                                        <Label>Select Leave</Label>
                                        <Input
                                            type="select"
                                            value={formData.leaveId}
                                            onChange={handleLeaveSelect}
                                        >
                                            <option value="">-- Select Leave --</option>
                                            {leaves.map((lv) => (
                                                <option key={lv.id} value={lv.id}>
                                                    {lv.date.split("T")[0]} - {lv.duration_type}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                )}

                                <FormGroup>
                                    <Label>Leave Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Leave Type</Label>
                                    <Input
                                        type="select"
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, type: e.target.value })
                                        }
                                    >
                                        <option value="">-- Type --</option>
                                        <option value="Full-day">Full-day</option>
                                        <option value="Half-day">Half-day</option>
                                    </Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Reason</Label>
                                    <Input
                                        type="text"
                                        value={formData.reason}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reason: e.target.value })
                                        }
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Present Status</Label>
                                    <Input
                                        type="select"
                                        value={formData.present}
                                        onChange={(e) =>
                                            setFormData({ ...formData, present: e.target.value })
                                        }
                                    >
                                        <option value="">-- Select Status --</option>
                                        <option value="In">In</option>
                                        <option value="Out">Out</option>
                                    </Input>
                                </FormGroup>

                                <Button color="primary" block type="submit">
                                    Update Leave
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default UpdateLeaveform;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Label, Input, Button, Table } from "reactstrap";
import '../style/delivery.css';
import { toast } from "react-toastify";

const AddDriverTargets = () => {
    const [deliveryTarget, setDeliveryTarget] = useState({ target: "", bonus: "" ,type:""});
    const [dbRates, setDbRates] = useState([]);
    const [dbtargets, setDbtargets] = useState([]);
    const [dbtargets1, setDbtargets1] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedMember1, setSelectedMember1] = useState(null);
    const [editFields1, setEditFields1] = useState({ dailyTarget: "", monthlyTarget: "" });
    const [editIndex, setEditIndex] = useState(null);
    const [editIndex1, setEditIndex1] = useState(null);
    const handleRateChange1 = (e) => {
        const { name, value } = e.target;
        setDeliveryTarget((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitDeliveryTarget = async () => {
        const { target, bonus,type } = deliveryTarget;

        if (!target || !bonus || !type) {
            toast.error("Please fill all fileds.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/delivery-target", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ target, bonus,type })
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Target added successfully!");
                setDeliveryTarget({ target: "", bonus: "" ,type: ""});
                fetchTargets1(); // Refresh list
            } else {
                toast.error("Failed to add target.");
            }
        } catch (err) {
            console.error("Error adding target:", err);
            toast.error("Server error.");
        }
    };
    const updateDeliveryTarget = async () => {
        const { dailyTarget, monthlyTarget } = editFields1;

        if (!dailyTarget || !monthlyTarget) {
            toast.error("Please fill in both values.");
            return;
        }

        if (!selectedMember1) {
            toast.error("Please select a driver.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/update-driver-target", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    devID: selectedMember1.devID,
                    dailyTarget,
                    monthlyTarget
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Delivery target updated successfully!");
                setEditFields1({ dailyTarget: "", monthlyTarget: "" });
                setSelectedMember1(null);
                fetchDrivers(); // Refresh list
            } else {
                toast.error(data.message || "Failed to update target.");
            }
        } catch (err) {
            toast.error("Server error.");
        }
    };
    const fetchTargets = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/order-targets");
            const data = await response.json();
            if (data.success) {
                setDbRates(data.targetBouns || []);
                setDbtargets1(data.targetType || []);
            }
        } catch (err) {
            console.error("Error fetching targets:", err);
        }
    };
    const fetchTargets1 = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/delivery-targets");
            const data = await response.json();

            if (data.success) {
                const sortedTargets = (data.targets || []).sort((a, b) => {
                    if (a.type === "Daily" && b.type === "Monthly") return -1;
                    if (a.type === "Monthly" && b.type === "Daily") return 1;
                    return 0;
                });
                setDbtargets(sortedTargets);
            }
        } catch (err) {
            console.error("Error fetching targets:", err);
        }
    };
    const fetchDrivers = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/drivers-targets");
            const data = await response.json();
            if (data.success) setDrivers(data.drivers || []);
        } catch (err) {
            console.error("Error fetching drivers:", err);
        }
    };

    useEffect(() => {
        fetchTargets();
        fetchTargets1();
        fetchDrivers();
    }, []);
    const handleSelectChange1 = (e) => {
        const devID = e.target.value;
        const member = drivers.find((m) => m.devID === devID);
        setSelectedMember1(member || null);
        setEditFields1({ dailyTarget: "", monthlyTarget: "" });
    };

    const handleCancel = () => {
        setEditIndex(null);
    };
    const handleCancel1 = () => {
        setEditIndex1(null);
    };

    const handleDelete = async (index) => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/target-bonus/${index.id}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("🗑️ Deleted successfully!");
                fetchTargets();
                // optionally refresh data here
            } else {
                console.error("❌ Delete error:", result.message);
            }
        } catch (error) {
            console.error("❌ Network error:", error.message);
        }
    };
    return (
        <Container className="add-item-container">
            <Row className="justify-content-center">
                <Label className='text-center'>Driver Targets</Label>
                <Col lg="6" className="d-flex flex-column gap-4">
                    {/* Change Target values of driver */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Change delivery Target</Label>
                        <Input type="select" onChange={handleSelectChange1} className="mb-3">
                            <option value="">-- Select Member --</option>
                            {drivers.map((m) => (
                                <option key={m.devID} value={m.devID}>
                                    {m.E_ID} - {m.name}
                                </option>
                            ))}
                        </Input>

                        {selectedMember1 && (
                            <Table bordered>
                                <tbody>
                                <tr>
                                    <td colSpan="2">
                                        <Label className="fw-bold">Daily Targets</Label>
                                        <div className="d-flex gap-2">
                                            <div className="form-control w-50 bg-light fw-bold">
                                                {selectedMember1.dailyTarget || 0}
                                            </div>
                                            <Input
                                                type="text"
                                                name="totalOrder"
                                                placeholder="Edit Total Orders"
                                                value={editFields1.dailyTarget}
                                                onChange={(e) =>
                                                    setEditFields1({...editFields1, dailyTarget: e.target.value})
                                                }
                                                className="form-control w-50"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <Label className="fw-bold">Monthly Target</Label>
                                        <div className="d-flex gap-2">
                                            <div className="form-control w-50 bg-light fw-bold">
                                                {selectedMember1.monthlyTarget || 0}
                                            </div>
                                            <Input
                                                type="text"
                                                name="totalIssued"
                                                placeholder="Edit Total Issued"
                                                value={editFields1.monthlyTarget}
                                                onChange={(e) =>
                                                    setEditFields1({...editFields1, monthlyTarget: e.target.value})
                                                }
                                                className="form-control w-50"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        )}
                        <Button color="primary" onClick={updateDeliveryTarget}>Update Delivery Target</Button>
                    </div>
                    {/* Add Target Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Add Delivery Target Bonus</Label>

                        <Input
                            type="text"
                            placeholder="Enter Target value"
                            className="mb-2"
                            name="target"
                            value={deliveryTarget.target}
                            onChange={handleRateChange1}
                        />

                        <Input
                            type="text"
                            placeholder="Enter Bonus value"
                            className="mb-2"
                            name="bonus"
                            value={deliveryTarget.bonus}
                            onChange={handleRateChange1}
                        />

                        <Input
                            type="select"
                            className="mb-2"
                            name="type"
                            value={deliveryTarget.type}
                            onChange={handleRateChange1}
                        >
                            <option value="">-- Select Type --</option>
                            <option value="Daily">Daily</option>
                            <option value="Monthly">Monthly</option>
                        </Input>

                        <Button color="primary" onClick={handleSubmitDeliveryTarget}>
                            Save Target
                        </Button>
                    </div>
                </Col>
                <Col lg="6" className="d-flex flex-column gap-4">
                {/* Target List Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Delivery Targets</Label>
                        <Table bordered size="sm" className="mt-2">
                            <thead className="custom-table-header">
                            <tr>
                                <th>Target</th>
                                <th>Bonus</th>
                                <th>Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dbtargets.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center">No Data</td>
                                </tr>
                            ) : (
                                dbtargets.map((rate, index) => (
                                    <tr key={index}>
                                        <td>{rate.target}</td>
                                        <td>{rate.bonus}</td>
                                        <td>{rate.type}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddDriverTargets;

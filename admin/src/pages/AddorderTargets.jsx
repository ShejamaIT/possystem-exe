import React, { useState, useEffect } from "react";
import { Container, Row, Col, Label, Input, Button, Table } from "reactstrap";
import '../style/delivery.css';
import { toast } from "react-toastify";

const AddOrderTargets = () => {
    const [orderTarget, setOrderTarget] = useState({ target: "", bonus: "" });
    const [deliveryTarget, setDeliveryTarget] = useState({ target: "", bonus: "" ,type:""});
    const [saleTarget, setSaleTarget] = useState({ target: "", bonus: "" });
    const [dbRates, setDbRates] = useState([]);
    const [dbtargets, setDbtargets] = useState([]);
    const [dbtargets1, setDbtargets1] = useState([]);
    const [salesTeam, setSalesTeam] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedMember1, setSelectedMember1] = useState(null);
    const [editFields, setEditFields] = useState({ totalOrder: "", totalIssued: "" });
    const [editFields1, setEditFields1] = useState({ dailyTarget: "", monthlyTarget: "" });
    const [editIndex, setEditIndex] = useState(null);
    const [editIndex1, setEditIndex1] = useState(null);
    const [editData, setEditData] = useState({ target: "", bonus: "" , id:"" });
    const [editData1, setEditData1] = useState({ targetType: "", bonus: "" , id:"" });
    const handleRateChange = (e) => {
        const { name, value } = e.target;
        setOrderTarget((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleRateChange2 = (e) => {
        const { name, value } = e.target;
        setSaleTarget((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitOrderTarget = async () => {
        const { target, bonus } = orderTarget;

        if (!target || !bonus) {
            toast.error("Please fill in both target and bonus.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/order-targets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ target, bonus })
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Target added successfully!");
                setOrderTarget({ target: "", bonus: "" });
                fetchTargets(); // Refresh list
            } else {
                toast.error("Failed to add target.");
            }
        } catch (err) {
            console.error("Error adding target:", err);
            toast.error("Server error.");
        }
    };
    const handleSubmitSaleTarget = async () => {
        const { target, bonus } = saleTarget;

        if (!target || !bonus) {
            toast.error("Please fill in both target and bonus.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/sale-targets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ target, bonus })
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Target added successfully!");
                setSaleTarget({ target: "", bonus: "" });
                fetchTargets(); // Refresh list
            } else {
                toast.error("Failed to add target.");
            }
        } catch (err) {
            console.error("Error adding target:", err);
            toast.error("Server error.");
        }
    };
    const updateOrderTarget = async () => {
        const { totalOrder, totalIssued } = editFields;

        if (!totalOrder || !totalIssued) {
            toast.error("Please fill in both values.");
            return;
        }

        if (!selectedMember) {
            toast.error("Please select a sales team member.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/update-sales-target", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stID: selectedMember.stID,
                    totalOrder,
                    totalIssued
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Sales target updated successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                // Optional: refresh the sales team data
                fetchSalesTeam();
                setEditFields({ totalOrder: "", totalIssued: "" });
                setSelectedMember(null);
            } else {
                toast.error("Failed to update target.");
            }
        } catch (err) {
            console.error("Error updating target:", err);
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

    const fetchSalesTeam = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/sales-team-targets");
            const data = await response.json();
            if (data.success) setSalesTeam(data.salesTeam || []);
        } catch (err) {
            console.error("Error fetching sales team:", err);
        }
    };

    useEffect(() => {
        fetchTargets();
        fetchTargets1();
        fetchSalesTeam();
    }, []);
    const handleSelectChange = (e) => {
        const stID = e.target.value;
        const member = salesTeam.find((m) => m.stID === stID);
        setSelectedMember(member || null);
        setEditFields({ totalOrder: "", totalIssued: "" });
    };

    const startEditing = (index) => {
        setEditIndex(index);
        setEditData({ target: dbRates[index].target, bonus: dbRates[index].bonus , id:dbRates[index].id});
    };

    const startEditing1 = (index) => {
        setEditIndex1(index);
        setEditData1({ targetType: dbtargets1[index].targetType, bonus: dbtargets1[index].bonus , id:dbtargets1[index].id});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };
    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        setEditData1((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (editIndex !== null) {
            try {
                const res = await fetch(`http://localhost:5001/api/admin/main/target-bonus/${editData.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        target: editData.target,
                        bonus: editData.bonus,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    toast.success("✅ Updated successfully!");
                    fetchTargets();
                    setEditIndex(null); // Exit editing mode
                    // optionally refresh data here
                } else {
                    console.error("❌ Update error:", result.message);
                }
            } catch (error) {
                console.error("❌ Network error:", error.message);
            }
        }
    };

    const handleUpdate1 = async () => {
        if (editIndex1 !== null && editData1?.id) {
            try {
                const response = await fetch(`http://localhost:5001/api/admin/main/targettype-bonus/${editData1.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        target: editData1.targetType,
                        bonus: editData1.bonus,
                    }),
                });

                const text = await response.text(); // safer parsing

                let result;
                try {
                    result = JSON.parse(text);
                } catch (err) {
                    throw new Error("Server returned non-JSON: " + text);
                }

                if (response.ok) {
                    toast.success("✅ Updated successfully!");
                    fetchTargets();
                    setEditIndex1(null);
                } else {
                    console.error("❌ Update error:", result.message);
                    toast.error(result.message || "Update failed");
                }
            } catch (error) {
                console.error("❌ Network error:", error.message);
                toast.error(error.message || "Network error");
            }
        }
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

    const handleDelete1 = async (targetObj) => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/targettype-bonus/${targetObj.id}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("🗑️ Deleted successfully!");
                fetchTargets();
            } else {
                console.error("❌ Delete error:", result.message);
                toast.error(result.message);
            }
        } catch (error) {
            console.error("❌ Network error:", error.message);
            toast.error("Network error");
        }
    };
    return (
        <Container className="add-item-container">
            <Row className="justify-content-center">
                <Label className='text-center'>Sale Team Targets</Label>
                <Col lg="6" className="d-flex flex-column gap-4">
                    
                    {/* Change Target values of sale team */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Change order Target</Label>
                        <Input type="select" onChange={handleSelectChange} className="mb-3">
                            <option value="">-- Select Member --</option>
                            {salesTeam.map((m) => (
                                <option key={m.stID} value={m.stID}>
                                    {m.E_Id} - {m.name}
                                </option>
                            ))}
                        </Input>

                        {selectedMember && (
                            <Table bordered>
                                <tbody>
                                <tr>
                                    <td colSpan="2">
                                        <Label className="fw-bold">Total Orders</Label>
                                        <div className="d-flex gap-2">
                                            <div className="form-control w-50 bg-light fw-bold">
                                                {selectedMember.orderTarget || 0}
                                            </div>
                                            <Input
                                                type="text"
                                                name="totalOrder"
                                                placeholder="Edit Total Orders"
                                                value={editFields.totalOrder}
                                                onChange={(e) =>
                                                    setEditFields({...editFields, totalOrder: e.target.value})
                                                }
                                                className="form-control w-50"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <Label className="fw-bold">Total Issued</Label>
                                        <div className="d-flex gap-2">
                                            <div className="form-control w-50 bg-light fw-bold">
                                                {selectedMember.issuedTarget || 0}
                                            </div>
                                            <Input
                                                type="text"
                                                name="totalIssued"
                                                placeholder="Edit Total Issued"
                                                value={editFields.totalIssued}
                                                onChange={(e) =>
                                                    setEditFields({...editFields, totalIssued: e.target.value})
                                                }
                                                className="form-control w-50"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        )}
                        <Button color="primary" onClick={updateOrderTarget}>Update Sales Target</Button>
                    </div>
                    {/* Add Target Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Add Order Complete Target</Label>
                        <Input
                            type="text"
                            placeholder="Enter Target value"
                            className="mb-2"
                            name="target"
                            value={orderTarget.target}
                            onChange={handleRateChange}
                        />
                        <Input
                            type="text"
                            placeholder="Enter Bonus value"
                            className="mb-2"
                            name="bonus"
                            value={orderTarget.bonus}
                            onChange={handleRateChange}
                        />
                        <Button color="primary" onClick={handleSubmitOrderTarget}>Save Target</Button>
                    </div>
                
                    {/* Add Target type Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Add Target Rates</Label>

                        <select
                            className="form-select mb-2"
                            name="target"
                            value={saleTarget.target}
                            onChange={handleRateChange2}
                        >
                            <option value="">Select Target Type</option>
                            <option value="Highest Target">Highest Target</option>
                            <option value="OrdersIn Target">OrdersIn Target</option>
                        </select>

                        <Input
                            type="text"
                            placeholder="Enter Bonus value"
                            className="mb-2"
                            name="bonus"
                            value={saleTarget.bonus}
                            onChange={handleRateChange2}
                        />
                        <Button color="primary" onClick={handleSubmitSaleTarget}>Save Target</Button>
                    </div>
                </Col>
                <Col lg="6" className="d-flex flex-column gap-4">
                    {/* Target List Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Order Complete Targets</Label>
                        <Table bordered size="sm" className="mt-2">
                            <thead className="custom-table-header">
                                <tr>
                                    <th>Target</th>
                                    <th>Bonus</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dbRates.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center">No Data</td>
                                    </tr>
                                ) : (
                                    dbRates.map((rate, index) => (
                                        <tr key={index}>
                                            {editIndex === index ? (
                                                <>
                                                    <td>
                                                        <Input
                                                            type="text"
                                                            name="target"
                                                            value={editData.target}
                                                            onChange={handleInputChange}
                                                            size="sm"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            type="text"
                                                            name="bonus"
                                                            value={editData.bonus}
                                                            onChange={handleInputChange}
                                                            size="sm"
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="success" onClick={handleUpdate}>Save</Button>
                                                            <Button size="sm" variant="secondary" onClick={handleCancel}>Cancel</Button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{rate.target}</td>
                                                    <td>{rate.bonus}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="warning" onClick={() => startEditing(index)}>Update</Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleDelete(rate)}>Delete</Button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Order Target Rates</Label>
                        <Table bordered size="sm" className="mt-2">
                            <thead className="custom-table-header">
                                <tr>
                                    <th>Target type</th>
                                    <th>Bonus</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dbtargets1.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center">No Data</td>
                                    </tr>
                                ) : (
                                    dbtargets1.map((rate, index) => (
                                        <tr key={index}>
                                            {editIndex1 === index ? (
                                                <>
                                                    <td>{rate.targetType}</td>    
                                                    <td>
                                                        <Input
                                                            type="text"
                                                            name="bonus"
                                                            value={editData1.bonus}
                                                            onChange={handleInputChange1}
                                                            size="sm"
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="success" onClick={handleUpdate1}>Save</Button>
                                                            <Button size="sm" variant="secondary" onClick={handleCancel1}>Cancel</Button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{rate.targetType}</td>
                                                    <td>{rate.bonus}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="warning" onClick={() => startEditing1(index)}>Update</Button>
                                                            <Button size="sm" variant="danger" onClick={() => handleDelete1(rate)}>Delete</Button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
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

export default AddOrderTargets;

import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import {Container, Row, Col, Table, Form, Label, Input, FormGroup, Button,TabContent, TabPane,Nav,NavItem,NavLink} from "reactstrap";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";
import "../style/SaleteamDetail.css";
import PaySheetView from "./PaySheet";

const SalarySheet = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [advancePayments, setAdvancePayments] = useState([]);
    const [loanPayments, setLoanPayments] = useState([]);
    const [leaveDates , setLeaveDates] = useState([]);
    const [monthlyDeliveryTotal , setMonthlyDeliveryTotal] = useState(0);
    const [monthlyHireTotal , setMonthlyHireTotal] = useState(0);
    const [monthlyTargetBouns , setMonthlyTargetBouns] = useState(0);
    const [dailyTargetBouns , setDailyTargetBouns] = useState(0);
    const [monthlyDeptBalance , setMonthlyDeptBalance] = useState(0);
    const [totalInOrders , setMonthlyTotalInOrders] = useState(0);
    const [totalOutOrders , setMonthlyTotalOutOrders] = useState(0);
    const [inOrderBonus , setInOrderBonus] = useState(0);
    const [outOrderBonus , setOutOderBonus] = useState(0);
    const [highestSaleBonus , setHighestSaleBonus] = useState(0);
    const [manualOverrides, setManualOverrides] = useState({});
    const [loanpayment , setLoanPayment] = useState(0);
    const [showPaySheet, setShowPaySheet] = useState(false);
    const [activeTab, setActiveTab] = useState("full");

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const getPreviousMonth = () => {
        const today = new Date();
        today.setMonth(today.getMonth() - 1); // Go back one month
        const year = today.getFullYear();
        const monthName = today.toLocaleString("default", { month: "long" });
        return `${year}-${monthName}`;
    };


    const [formData, setFormData] = useState({
        id: "", name: "",month: getPreviousMonth(), job: "", informedLeave:"", uninformedLeave:"", basic: "", loan: "",advance:"", attendance:"",leaveDeduction:"", saving:"",otherpay:"",total :"",
    });
    // Fetch Employees
    useEffect(() => {
        fetchEmployees();
    }, []);
    useEffect(() => {
        if (!formData.basic) return;

        const basic = Number(formData.basic) || 0;
        const saving = Number(formData.saving) || 0;
        const other = Number(formData.otherpay) || 0;

        const informedLeave = Number(formData.informedLeave) || 0;
        const uninformedLeave = Number(formData.uninformedLeave) || 0;
        const leaveCount = informedLeave + uninformedLeave;

        const legalLeave = formData.job === "Driver" ? 2 : 4;
        const legalLeavePay = legalLeave * 1000;

        // Leave deduction
        const rawDeduction = informedLeave * 1000 + uninformedLeave * 2000;
        const leaveDeduction =  legalLeavePay - rawDeduction ;

        // Attendance bonus
        const attendanceBonus = legalLeavePay;
        // Advance & loan
        const totalAdvance = advancePayments.reduce(
            (sum, a) => sum + (Number(a.amount) || 0),
            0
        );
        const totalLoan = loanPayments ? Number(loanPayments.installment) || 0 : 0;

        // Salary total
        let s_total =
            basic +attendanceBonus -totalAdvance -totalLoan -saving -other - rawDeduction;

        if (formData.job === "Driver") {
            s_total += monthlyTargetBouns + dailyTargetBouns - monthlyDeptBalance;
        }

        if (formData.job === "Sales") {
            s_total += inOrderBonus + outOrderBonus + highestSaleBonus;
        }

        const updatedData = {
            ...formData,
            savings:saving,
            other:other,
            month:getPreviousMonth(),
            attendance: attendanceBonus.toFixed(2),
            leaveDeduction: rawDeduction.toFixed(2),
            total: s_total.toFixed(2),
            informedLeave,
            uninformedLeave,
            advance: totalAdvance.toFixed(2),
            loan: totalLoan.toFixed(2),
        };
        if (loanPayments?.date) updatedData.loanDate = loanPayments.date;
        if (formData.job === "Driver") {
            Object.assign(updatedData, {
            monthlyTargetBouns,
            dailyTargetBouns,
            monthlyDeptBalance,
            });
        }
        if (formData.job === "Sales") {
            Object.assign(updatedData, {
            inOrderBonus,
            outOrderBonus,
            highestSaleBonus,
            });
        }

        if (JSON.stringify(updatedData) !== JSON.stringify(formData)) {
            setFormData(updatedData);
        }
        }, 
        [formData.basic, formData.informedLeave, formData.uninformedLeave,advancePayments, loanPayments, monthlyTargetBouns,dailyTargetBouns,monthlyDeptBalance,
        inOrderBonus,  outOrderBonus, highestSaleBonus,manualOverrides.saving,manualOverrides.otherpay,formData.saving,formData.otherpay,]
    );

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
    const handleEmployeeSelect = async (e) => {
        const selectedId = e.target.value;
        const selectedEmployee = employees.find(emp => emp.E_Id === selectedId);

        if (selectedEmployee) {
            const [advanceList, loanData] = await fetchSalaryPayments(selectedId);
            const leaveData = await fetchLeaveCount(selectedId);

            const totalAdvance = advanceList.reduce((sum, a) => sum + parseFloat(a.amount || 0), 0);
            const totalLoan = loanData ? parseFloat(loanData.installment || 0) : 0;
            const leaveDeduction = parseFloat(leaveData.attendanceDeduction || 0);
            const basic = selectedEmployee.basic || 0;

            const attendanceBonus = leaveData.totalLeave > 4 ? 0: Math.max(0, 4000 - leaveDeduction);

                
            setFormData({
                id: selectedEmployee.E_Id,
                name: selectedEmployee.name,
                job: selectedEmployee.job,
                basic: basic.toFixed(2),
                informedLeave: leaveData.informedLeave?.toString() || "0",
                uninformedLeave: leaveData.uninformedLeave?.toString() || "0",
                attendance: attendanceBonus.toFixed(2),
                leaveDeduction: leaveDeduction.toFixed(2),
                advance: totalAdvance.toFixed(2),
                loan: totalLoan.toFixed(2),
                saving: "",
                otherpay: "",
                total: ""
            });

            if (selectedEmployee.job === 'Driver') {
                fetchDriverHireSummary(selectedId);
            }
            if (selectedEmployee.job === 'Sales') {
                fetchSaleTeamOrderSummary(selectedId);
            }
        }
    };
    const fetchSalaryPayments = async (eid) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/advance&loan?eid=${eid}`);
            const data = await response.json();
            if (data.success) {
                const advances = data.advancePayments || [];
                const loan = data.lastMonthUnpaidInstallment || {}; // Default to empty object
                
                setAdvancePayments(advances);
                setLoanPayments(loan);
                setLoanPayment(parseFloat(loanPayments.installment || 0));
                return [advances, loan];
            } else {
                setAdvancePayments([]);
                setLoanPayments({});
                return [[], {}];
            }
        } catch (err) {
            console.error("Error fetching salary payments:", err);
            setAdvancePayments([]);
            setLoanPayments({});
            return [[], {}];
        }
    };

    const fetchLeaveCount = async (eid) => {
        const fallback = {
            informedLeave: 0,
            uninformedLeave: 0,
            totalLeave: 0,
            attendanceDeduction: 0
        };

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/leave-count?eid=${eid}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            if (!data.success) throw new Error("API returned success = false");

            const {
                informedLeave = 0,
                uninformedLeave = 0,
                totalLeave = 0,
                attendanceDeduction = 0,
                leaveDetails=[]
            } = data;
            
            const leaves = data.leaveDetails || [];
            setLeaveDates(leaves);
            return {
                informedLeave,uninformedLeave,totalLeave,attendanceDeduction,leaveDetails
            };
        } catch (err) {
            console.error("Error fetching leave counts:", err);
            return fallback;
        }
    };

    const fetchDriverHireSummary = async (eid) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/hire-summary?eid=${eid}`);
            const data = await response.json();
            setMonthlyDeliveryTotal(data.lastMonthDeliveryTotal || 0.0);
            setMonthlyHireTotal(data.lastMonthHireTotal || 0.0);
            setMonthlyTargetBouns(data.monthlyBonus?.bonus || 0.0);
            setMonthlyDeptBalance(data.balance|| 0.0);

            // Calculate total daily bonus
            const totalDailyBonus = (data.dailySummary || []).reduce((sum, day) => sum + (day.bonus || 0), 0);
            setDailyTargetBouns(totalDailyBonus);

        } catch (err) {
            console.error("Error fetching salary payments:", err);
        }
    };
    const fetchSaleTeamOrderSummary = async (eid) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/sales-summary?eid=${eid}`);
            const data = await response.json();
            setMonthlyTotalInOrders(data.totalOrder || 0.0);
            setMonthlyTotalOutOrders(data.totalIssued || 0.0);
            setInOrderBonus(data.bonuses.orderBonus || 0.0);
            setOutOderBonus(data.bonuses.issuedBonus || 0.0);
            setHighestSaleBonus(data.bonuses.highestBonus || 0.0);

        } catch (err) {
            console.error("Error fetching salary payments:", err);
        }
    };
    
    const showConfirmToast = (message, onConfirm, onCancel) => {
        toast(
            ({ closeToast }) => (
            <div>
                <p style={{ color: "white", fontWeight: "500", marginBottom: "10px" }}>
                    {message}
                </p>
                <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                <button
                    onClick={() => {
                    onConfirm();
                    closeToast();
                    }}
                    style={{
                    padding: "5px 10px",
                    background: "green",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => {
                    onCancel();
                    closeToast();
                    }}
                    style={{
                    padding: "5px 10px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                    }}
                >
                    No
                </button>
                </div>
            </div>
            ),
            { autoClose: false, closeOnClick: false }
        );
        };

        const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.basic || !formData.total) {
            toast.error("Fill in the salary details before generating the pay sheet.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/pay-salary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success === false && data.message.includes("already paid")) {
            // Salary already exists → ask confirmation via toast
            showConfirmToast(
                `${data.message}. Do you want to view the salary sheet anyway?`,
                () => setShowPaySheet(true),   // ✅ onConfirm
                () => setShowPaySheet(false)   // ❌ onCancel
            );
            } else if (data.success === true) {
            // Salary saved this time → success message
            toast.success("Salary saved successfully!");
            setShowPaySheet(true);
            } else {
            toast.warn("Unexpected response from server.");
            }
        } catch (err) {
            console.error("Error saving salary:", err);
            toast.error("Error saving salary. Please try again.");
        }
        };


   const handleClear = () => {
        setFormData({
            id: "", name: "",job: "",informedLeave: "", uninformedLeave: "", basic: "", loan: "",advance: "",attendance: "",leaveDeduction: "",
            saving: "", otherpay: "", total: ""
        });
    };

    return (
        <Helmet title={`Salary Sheet`}>
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h3 className="text-center">Monthly Salary</h3>
                            <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col lg={9}>
                                    <FormGroup>
                                    <Label for="id">Select Employee</Label>
                                    <Input
                                        type="select"
                                        name="id"
                                        id="id"
                                        value={formData.id}
                                        onChange={handleEmployeeSelect}
                                    >
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
                                </Col>
                                <Col lg={3} className="d-flex align-items-end">
                                    <Button
                                    type="button"
                                    color={isEditMode ? "secondary" : "primary"}
                                    className="mb-3"
                                    onClick={() => setIsEditMode(!isEditMode)}
                                    >
                                    {isEditMode ? "Cancel Edit" : "Edit"}
                                    </Button>
                                </Col>
                            </Row>

                                <div className="salesteam-details">
                                    <Table bordered className="member-table">
                                        <tbody>
                                        <tr>
                                            <td><strong>Employee Name</strong></td>
                                            <td colSpan={3}>{formData.name}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Basic Salary</strong></td>
                                            <td colSpan={3}>Rs. {formData.basic}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Informed Leave</strong></td>
                                            <td>
                                                {isEditMode ? (
                                                <Input
                                                    type="text"
                                                    name="informedLeave"
                                                    value={formData.informedLeave}
                                                    onChange={(e) =>
                                                    setFormData({ ...formData, informedLeave: e.target.value })
                                                    }
                                                />
                                                ) : (
                                                formData.informedLeave
                                                )}
                                            </td>
                                            <td><strong>Uninformed Leave</strong></td>
                                            <td>
                                                {isEditMode ? (
                                                <Input
                                                    type="text"
                                                    name="uninformedLeave"
                                                    value={formData.uninformedLeave}
                                                    onChange={(e) =>
                                                    setFormData({ ...formData, uninformedLeave: e.target.value })
                                                    }
                                                />
                                                ) : (
                                                formData.uninformedLeave
                                                )}
                                            </td>
                                            </tr>

                                        <tr>
                                            <td><strong>Attendance bonus</strong></td>
                                            <td colSpan={1}>Rs. {formData.attendance}</td>
                                            <td><strong>Leave Deduction</strong></td>
                                            <td colSpan={1}>Rs. {formData.leaveDeduction}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="p-3 border rounded shadow-sm bg-light mt-3">
                                    <h5 className="fw-bold mb-4">Leave Dates</h5>
                                    {/* Tabs */}
                                    <Nav tabs>
                                        <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === "full" })}
                                            onClick={() => toggle("full")}
                                            role="button"
                                        >
                                            Full-day
                                        </NavLink>
                                        </NavItem>
                                        <NavItem>
                                        <NavLink
                                            className={classnames({ active: activeTab === "half" })}
                                            onClick={() => toggle("half")}
                                            role="button"
                                        >
                                            Half-day
                                        </NavLink>
                                        </NavItem>
                                    </Nav>

                                    {/* Tab content */}
                                    <TabContent activeTab={activeTab} className="mt-3">
                                        {/* Full-day */}
                                        <TabPane tabId="full">
                                        <Table bordered>
                                            <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {leaveDates.filter((l) => l.duration === "Full-day").length > 0 ? (
                                                leaveDates
                                                .filter((l) => l.duration === "Full-day")
                                                .map((leave, index) => (
                                                    <tr key={index}>
                                                    <td>{new Date(leave.date).toLocaleDateString()}</td>
                                                    <td>{leave.type}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                <td colSpan={2}>No Full-day Leaves</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </Table>
                                        </TabPane>

                                        {/* Half-day */}
                                        <TabPane tabId="half">
                                        <Table bordered>
                                            <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {leaveDates.filter((l) => l.duration === "Half-day").length > 0 ? (
                                                leaveDates
                                                .filter((l) => l.duration === "Half-day")
                                                .map((leave, index) => (
                                                    <tr key={index}>
                                                    <td>{new Date(leave.date).toLocaleDateString()}</td>
                                                    <td>{leave.type}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                <td colSpan={2}>No Half-day Leaves</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </Table>
                                        </TabPane>
                                    </TabContent>
                                </div>
                                {formData.job === "Driver" && (
                                    <div className="p-3 border rounded shadow-sm bg-light mt-3">
                                        <h5 className="fw-bold mb-4">Hire Commission</h5>
                                        <Table bordered className="member-table">
                                            <tbody>
                                            <tr>
                                                <td><strong>Total Delivery Hire</strong></td>
                                                <td>Rs. {(monthlyDeliveryTotal).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total Other Hire</strong></td>
                                                <td>Rs. {(monthlyHireTotal).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Monthly Target Bouns</strong></td>
                                                <td>Rs. {(monthlyTargetBouns).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Daily Target Bouns</strong></td>
                                                <td>Rs. {(dailyTargetBouns).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Monthly Dept Balance</strong></td>
                                                <td>Rs. {(monthlyDeptBalance).toFixed(2)}</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                                {formData.job === "Sales" && (
                                    <div className="p-3 border rounded shadow-sm bg-light mt-3">
                                        <h5 className="fw-bold mb-4">Order Commission</h5>
                                        <Table bordered className="member-table">
                                            <tbody>
                                            <tr>
                                                <td><strong>Total InOrders</strong></td>
                                                <td>Rs. {(totalInOrders).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total OutOrders</strong></td>
                                                <td>Rs. {(totalOutOrders).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>InOrders Target Bouns</strong></td>
                                                <td>Rs. {(inOrderBonus).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>OutOrders Target Bouns</strong></td>
                                                <td>Rs. {(outOrderBonus).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Highest Sale Target</strong></td>
                                                <td>Rs. {(highestSaleBonus).toFixed(2)}</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                )}

                                <div className="p-3 border rounded shadow-sm bg-light mt-3">
                                <h5 className="fw-bold mb-4">Advance Payments</h5>
                                    <Table bordered>
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Payment</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {advancePayments.length > 0 ? (
                                            <>
                                                {advancePayments.map((payment, index) => (
                                                    <tr key={index}>
                                                        <td>{new Date(payment.dateTime).toLocaleDateString()}</td>
                                                        <td>Rs. {payment.amount}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td><strong>Total</strong></td>
                                                    <td>
                                                        <strong>
                                                            Rs.{" "}
                                                            {advancePayments.reduce((total, p) => total + Number(p.amount), 0).toFixed(2)}
                                                        </strong>
                                                    </td>
                                                </tr>
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan={2}>No advance</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="p-3 border rounded shadow-sm bg-light mt-3">
                                    <h5 className="fw-bold mb-4">Loan Payments</h5>

                                    {loanPayments && loanPayments.length > 0 ? (
                                        <div className="d-flex flex-column gap-3">
                                            {loanPayments.map((payment, index) => (
                                                <div
                                                    key={index}
                                                    className="border rounded p-3 shadow-sm d-flex justify-content-between align-items-center"
                                                >
                                                    <div>
                                                        <div><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</div>
                                                        <div><strong>Payment:</strong> Rs. {payment.installment}</div>
                                                        <div><strong>Skip Count:</strong> {payment.skip}</div>
                                                    </div>
                                                    <Button color="success">Pass</Button>
                                                </div>
                                            ))}

                                            {/* Total Section */}
                                            <div className="border-top pt-3 mt-2 d-flex justify-content-between">
                                                <strong>Total</strong>
                                                <strong>
                                                    Rs. {loanPayments.reduce((sum, p) => sum + Number(p.installment), 0).toFixed(2)}
                                                </strong>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted">No loan payments</div>
                                    )}
                                </div>

                                <div className="p-3 border rounded shadow-sm bg-light mt-3">
                                    <h5 className="fw-bold mb-4">Other Payments</h5>
                                    <Table bordered className="member-table">
                                        <tbody>
                                        <tr>
                                            <td><strong>Saving</strong></td>
                                            <td>
                                                <div className="input-cell">
                                                    Rs.
                                                    <Input
                                                        type="text"
                                                        name="saving"
                                                        value={formData.saving}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                saving: e.target.value
                                                            })
                                                        }
                                                        className="form-input"
                                                    />
                                                </div>
                                            </td>
                                            <td><strong>Other</strong></td>
                                            <td>
                                                <div className="input-cell">
                                                    Rs.
                                                    <Input
                                                        type="text"
                                                        name="otherpay"
                                                        value={formData.otherpay}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                otherpay: e.target.value
                                                            })
                                                        }
                                                        className="form-input"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="p-3 border rounded shadow-sm bg-light mt-3">
                                    <h5 className="fw-bold mb-4">Total salary</h5>
                                    <Table bordered className="member-table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Basic Salary (➕)</strong></td>
                                                <td>{formData.basic}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Attendance bonus (➕)</strong></td>
                                                <td>{formData.attendance}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Leave Deduction (➖)</strong></td>
                                                <td>{formData.leaveDeduction}</td>
                                            </tr>
                                            {formData.job === "Driver" && (
                                                <>
                                                    <tr>
                                                        <td><strong>Daily Target Bouns (➕)</strong></td>
                                                        <td>{(dailyTargetBouns).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Monthly Target Bouns (➕)</strong></td>
                                                        <td>{(dailyTargetBouns).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Monthly Dept Balance (➖)</strong></td>
                                                        <td>{(dailyTargetBouns).toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            )}
                                            {formData.job === "Sales" && (
                                                <>
                                                    <tr>
                                                        <td><strong>InOrders Target Bouns (➕)</strong></td>
                                                        <td>{(inOrderBonus).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>OutOrders Target Bouns (➕)</strong></td>
                                                        <td>{(outOrderBonus).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Highest Sale Target (➕)</strong></td>
                                                        <td>{(highestSaleBonus).toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            )}
                                            <tr>
                                                <td><strong>Advance (➖)</strong></td>
                                                <td>             
                                                        {advancePayments.reduce((total, p) => total + Number(p.amount), 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Loan (➖)</strong></td>
                                                <td>                                                        
                                                    {Number(loanpayment).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total salary in hand</strong></td>
                                                <td>{formData.total}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <Row>
                                    <Col md="6">
                                        <Button type="submit" color="primary" block>
                                            Pay
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
                        {showPaySheet && (
                            <PaySheetView 
                                formData={formData} 
                                setShowPaySheet={setShowPaySheet} 
                            />
                        )}
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default SalarySheet;




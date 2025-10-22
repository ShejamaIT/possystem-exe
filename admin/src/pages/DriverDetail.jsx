import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Spinner, Alert } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import "../style/SaleteamDetail.css";

const DriverDetail = ({ driver }) => {
    const [driverDetails, setDriverDetails] = useState(null);
    const [deliveryCharges, setDeliveryCharges] = useState(null);
    const [thisMonthNotes, setThisMonthNotes] = useState([]);
    const [thisMonthHires, setThisMonthHires] = useState([]);
    const [lastMonthHires, setLastMonthHires] = useState([]);
    const [lastMonthNotes, setLastMonthNotes] = useState([]);
    const [advancedetails , setAdanceDetails] = useState([]);
    const [loandetails , setLoanDetails] = useState([]);
    const [dailyditects , setDailyDitects] = useState([]);
    const [monthlyditects , setMonthlyDitects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [thismonthDelValue, setthismothdelValue] = useState(0);
    const [thismonthHireValue, setthismothHireValue] = useState(0);
    const [lastmonthDelValue, setlastmothdelValue] = useState(0);
    const [lastmonthHireValue, setlastmothHireValue] = useState(0);
    const [loanAmount , setLoanAmount] = useState(0);
    const [installment , setInstallment] = useState(0);

    useEffect(() => {
        if (!driver.devID) {
            setError("Driver ID is missing or invalid.");
            setLoading(false);
            return;
        }
        fetchDriverDetails(driver.devID);
    }, [driver.devID]);

    const fetchDriverDetails = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:5001/api/admin/main/drivers/details?devID=${id}`);
            if (!response.ok) throw new Error("Failed to fetch driver details.");

            const data = await response.json();
            setDriverDetails(data.data || {});
            setDeliveryCharges(data.data.deliveryCharges || {});
            setThisMonthNotes(data.data.deliveryNotes.thisMonth || []);
            setThisMonthHires(data.data.hires.thisMonth || []);
            setLastMonthNotes(data.data.deliveryNotes.lastMonth || []);
            setLastMonthHires(data.data.hires.lastMonth || []);
            setAdanceDetails(data.data.advanceDetails  || []);
            setDailyDitects(data.data.deliveryCharges.dailyCharges || []);
            setMonthlyDitects(data.data.deliveryCharges.monthlyCharges || []);
            setthismothdelValue(data.data.deliveryNotes.thisMonthNoteHireTotal || 0);
            setlastmothdelValue(data.data.deliveryNotes.lastMonthNoteHireTotal || 0);
            setthismothHireValue(data.data.hires.thisMonthHireTotal);
            setlastmothHireValue(data.data.hires.lastMonthHireTotal);
            setLoanDetails(data.data.loans || []);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setDriverDetails(null);
            setDeliveryCharges(null);
            setThisMonthNotes([]);
            setLastMonthNotes([]);
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : "N/A";
    };

    return (
        <Helmet title={`Driver Detail`}>
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            {loading && (
                                <div className="text-center">
                                    <Spinner color="primary" />
                                    <p>Loading driver details...</p>
                                </div>
                            )}
                            {error && <Alert color="danger">⚠️ {error}</Alert>}
                            {!loading && !error && (
                                <>
                                    <div className="driver-details">
                                        <h4 className="sub-title">Driver Information</h4>
                                        <Table bordered className="driver-table">
                                            <tbody>
                                            <tr>
                                                <td><strong>Employee ID</strong></td>
                                                <td>{driverDetails.devID}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Employee Name</strong></td>
                                                <td>{driverDetails.name}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Phone</strong></td>
                                                <td>{driverDetails.contact}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>NIC</strong></td>
                                                <td>{driverDetails.nic}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Lincense Date</strong></td>
                                                <td>{formatDate(driverDetails.lincenseDate)}</td>
                                            </tr>
                                            </tbody>
                                        </Table>

                                        <Table bordered className="driver-table">
                                            <tbody>
                                            <tr>
                                                <td><strong>This Month Delivery</strong></td>
                                                <td>Rs. {thismonthDelValue.toFixed(2)}</td>
                                                <td><strong>Dept Balance</strong></td>
                                                <td>Rs. {(driverDetails.balance).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>This month Hire</strong></td>
                                                <td>Rs. {thismonthHireValue.toFixed(2)}</td>
                                                <td><strong>Advance</strong></td>
                                                <td>Rs. {(driverDetails.totalAdvance).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Last Month Delivery</strong></td>
                                                <td>Rs. {lastmonthDelValue.toFixed(2)}</td>
                                                <td><strong>Loan Amount</strong></td>
                                                <td><strong>Loan Amount</strong></td>
                                                {/*<td>Rs. {(loanAmount).toFixed(2) || 0.00}</td>*/}
                                            </tr>
                                            <tr>
                                                <td><strong>Last month Hire</strong></td>
                                                <td>Rs. {lastmonthHireValue.toFixed(2)}</td>
                                                <td><strong>Installment</strong></td>
                                                <td><strong>Installment</strong></td>
                                                {/*<td>Rs. {(installment).toFixed(2) || 0.00}</td>*/}
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="coupon-detail">
                                        <Row>
                                            <Col lg={6}>
                                                <h4 className="sub-title">Monthly Dept</h4>
                                                <Table bordered className="coupon-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Delivery ID</th>
                                                        <th>Direct Amount (Rs.)</th>
                                                        <th>Date</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {monthlyditects.length > 0 ? (
                                                        monthlyditects.map((dd, index) => (
                                                            <tr key={index}>
                                                                <td>{dd.deliveryId}</td>
                                                                <td>Rs. {dd.amount}</td>
                                                                <td>{formatDate(dd.date)}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="no-coupon-text">No Direct Amount.</td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                            {/* Advance Details */}
                                            <Col lg={6}>
                                                <h4 className="sub-title">Advance</h4>
                                                <Table bordered className="coupon-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Advance ID</th>
                                                        <th>Amount (Rs.)</th>
                                                        <th>Date </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {advancedetails.length > 0 ? (
                                                        advancedetails.map((advance, index) => (
                                                            <tr key={index}>
                                                                <td>{advance.advanceId}</td>
                                                                <td>Rs. {advance.amount}</td>
                                                                <td>{advance.date}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="3" className="no-coupon-text">No Advance.</td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="coupon-detail">
                                        <Row>
                                            <Col lg={6}>
                                                <h4 className="sub-title">Delivery Notes - This Month</h4>
                                                <Table striped bordered className="items-table">
                                                <thead>
                                                    <tr>
                                                    <th>D.N ID</th>
                                                    <th>Date</th>
                                                    <th>Bill Numbers</th>
                                                    <th>Hire</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {thisMonthNotes.length > 0 ? (
                                                    thisMonthNotes.map(note => (
                                                        <tr key={note.delNoID}>
                                                        <td>{note.delNoID}</td>
                                                        <td>{note.date}</td>
                                                        <td>
                                                            {note.billNumbers && note.billNumbers.length > 0
                                                            ? note.billNumbers.join(", ")
                                                            : "N/A"}
                                                        </td>
                                                        <td>Rs. {note.hire}</td>
                                                        </tr>
                                                    ))
                                                    ) : (
                                                    <tr>
                                                        <td colSpan="3">No records found</td>
                                                    </tr>
                                                    )}
                                                </tbody>
                                                </Table>

                                            </Col>
                                            <Col lg={6}>
                                                <h4 className="sub-title">Other Hires - This Month</h4>
                                                <Table striped bordered className="items-table">
                                                    <thead>
                                                    <tr>
                                                        <th>Hire ID</th>
                                                        <th>Date</th>
                                                        <th>Hire</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {thisMonthHires.length > 0 ? thisMonthHires.map(note => (
                                                        <tr key={note.id}>
                                                            <td>{note.id}</td>
                                                            <td>{formatDate(note.date)}</td>
                                                            <td>Rs. {note.hire}</td>
                                                        </tr>
                                                    )) : <tr><td colSpan="3">No records found</td></tr>}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>

                                    </div>
                                    <div className="delivery-notes">

                                    </div>
                                </>
                            )}
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default DriverDetail;

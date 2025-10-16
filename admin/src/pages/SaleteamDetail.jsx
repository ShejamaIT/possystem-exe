import React, { useState, useEffect } from "react";
import {Container,Row,Col,Table,Input,Label,Button,Nav,NavItem,NavLink,TabContent,TabPane} from "reactstrap";
import classnames from "classnames";

import Helmet from "../components/Helmet/Helmet";
import "../style/SaleteamDetail.css";

const SaleteamDetail = ({ Saleteam }) => {
    const [salesteamMember, setSalesteamMember] = useState(null);
    const [monthAdvance, setMonthAdvance] = useState(null);
    const [advancedetails, setAdanceDetails] = useState([]);
    const [coupones, setCoupones] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeOrderTab, setActiveOrderTab] = useState("");
    const [totalsByStatus, setTotalsByStatus] = useState({});

    useEffect(() => {
        if (!Saleteam.stID) {
            setError("Sales team ID is missing or invalid.");
            setLoading(false);
            return;
        }
        fetchOrder(Saleteam.stID);
    }, [Saleteam.stID]);

    const fetchOrder = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:5001/api/admin/main/orders/by-sales-team?stID=${id}`);
            if (!response.ok) throw new Error("Failed to fetch order details.");
            const data = await response.json();
            setSalesteamMember(data.data.memberDetails || null);
            setAdanceDetails(data.data.advanceDetails || []);
            setCoupones(data.data.coupons || []);
            setMonthAdvance(data.data.totalAdvance);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchOrdersByDateRange = async () => {
        if (!startDate || !endDate) return;
        try {
            const response = await fetch(
                `http://localhost:5001/api/admin/main/orders/by-sales-team/daterange?stID=${Saleteam.stID}&startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) throw new Error("Failed to fetch filtered orders.");
            const data = await response.json();
            // Keep only statuses with non-empty orders
            const nonEmptyOrders = Object.fromEntries(
                Object.entries(data.data || {}).filter(([_, orders]) => orders.length > 0)
            );

            setFilteredOrders(nonEmptyOrders);
            setTotalsByStatus(data.totalSalePriceByStatus || {});

            // Set active tab to the first available status
            const firstStatus = Object.keys(nonEmptyOrders)[0] || "";
            setActiveOrderTab(firstStatus);
        } catch (error) {
            console.error("Error fetching filtered orders:", error);
            setFilteredOrders({});
            setTotalsByStatus({});
        }
};
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : "N/A";
    };

    useEffect(() => {
        const statuses = Object.keys(filteredOrders);
        if (statuses.length > 0 && !activeOrderTab) {
            setActiveOrderTab(statuses[0]);
        }
    }, [filteredOrders]);


    if (loading) return <p className="loading-text">Loading team details...</p>;
    if (error) return <p className="error-text">Something went wrong: {error}</p>;

    return (
        <Helmet title={`Sales Team Detail`}>
            <section>
                <Container>
                    <Row>
                        <Col lg="12">

                            {/* Sales Team Member Details */}
                            <div className="salesteam-details">
                                <Table bordered className="member-table">
                                    <tbody>
                                        <tr><td><strong>Employee Name</strong></td><td>{salesteamMember?.employeeName}</td></tr>
                                        <tr><td><strong>Employee ID</strong></td><td>{salesteamMember?.stID}</td></tr>
                                        <tr><td><strong>Phone</strong></td><td>{salesteamMember?.employeeContact}</td></tr>
                                        <tr><td><strong>Nic</strong></td><td>{salesteamMember?.employeeNic}</td></tr>
                                        <tr><td><strong>Advance</strong></td><td>Rs. {monthAdvance ?? '0.00'}</td></tr>
                                    </tbody>
                                </Table>
                            </div>

                            {/* Coupon & Advance Details */}
                            <div className="coupon-detail">
                                <Row>
                                    {/* Coupons */}
                                    <Col lg={6}>
                                        <h4 className="sub-title">Coupon Details</h4>
                                        <Table bordered className="coupon-table">
                                            <thead>
                                                <tr>
                                                    <th>Coupon ID</th>
                                                    <th>Discount (Rs.)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {coupones.length > 0 ? (
                                                    coupones.map((coupon, index) => (
                                                        <tr key={index}>
                                                            <td>{coupon.couponId}</td>
                                                            <td>Rs. {coupon.couponDiscount}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="2" className="no-coupon-text">No coupons available.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>

                                    {/* Advance */}
                                    <Col lg={6}>
                                        <h4 className="sub-title">Advance</h4>
                                        <Table bordered className="coupon-table">
                                            <thead>
                                                <tr>
                                                    <th>Advance ID</th>
                                                    <th>Amount (Rs.)</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {advancedetails.length > 0 ? (
                                                    advancedetails.map((advance, index) => (
                                                        <tr key={index}>
                                                            <td>{advance.advanceId}</td>
                                                            <td>Rs. {advance.amount}</td>
                                                            <td>{formatDate(advance.dateTime)}</td>
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

                            {/* Order Summary */}
                            <div className="order-details">
                                <h4 className="sub-title">This Month Orders Summary</h4>
                                <Table bordered className="orders-table">
                                    <tbody>
                                        <tr>
                                            <td><strong>Received Orders Count</strong></td>
                                            <td>{salesteamMember.totalCount}</td>
                                            <td>{salesteamMember.issuedCount}</td>
                                            <td><strong>Issued Orders Count</strong></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Order Received</strong></td>
                                            <td>Rs. {salesteamMember.totalOrder}</td>
                                            <td>Rs. {salesteamMember.orderTarget}</td>
                                            <td><strong>Order Received Target</strong></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Order Issued</strong></td>
                                            <td>Rs. {salesteamMember.totalIssued}</td>
                                            <td>Rs. {salesteamMember.issuedTarget}</td>
                                            <td><strong>Order Issued Target</strong></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>

                            {/* Date Range Filter */}
                            <div className="order-details date-range-filter mt-5">
                                <h4 className="sub-title">Orders in Selected Date Range</h4> 
                                <Row className="mb-4 align-items-end"> 
                                    <Col lg="4" md="6" sm="12" className="mb-2"> 
                                        <Label for="startDate"><strong>Start Date</strong></Label> 
                                    <   Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /> 
                                    </Col> 
                                    <Col lg="4" md="6" sm="12" className="mb-2"> 
                                        <Label for="endDate"><strong>End Date</strong></Label> 
                                        <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /> 
                                    </Col> 
                                    <Col lg="4" className="mb-2 d-flex align-items-end">
                                        <Button color="primary" block onClick={fetchOrdersByDateRange}> Fetch Orders </Button> 
                                    </Col> 
                                </Row>
                                {Object.keys(filteredOrders).length > 0 && (
                                    <div className="filtered-orders-tabs mt-5">
                                        
                                        <Nav tabs>
                                            {Object.keys(filteredOrders).map((status) => (
                                                <NavItem key={status}>
                                                    <NavLink
                                                        className={classnames({ active: activeOrderTab === status })}
                                                        onClick={() => setActiveOrderTab(status)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {status} Orders — Rs. {totalsByStatus[status]?.toLocaleString() || 0}
                                                    </NavLink>
                                                </NavItem>
                                            ))}
                                        </Nav>

                                        <TabContent activeTab={activeOrderTab}>
                                            {Object.entries(filteredOrders).map(([status, orders]) => (
                                                <TabPane key={status} tabId={status}>
                                                    <Table bordered className="orders-table mt-3">
                                                        <thead>
                                                            <tr>
                                                                <th>Order ID</th>
                                                                <th>Total Bill (Rs.)</th>
                                                                <th>Sale Price (Rs.)</th>
                                                                <th>Date</th>
                                                                <th>Advance (Rs.)</th>
                                                                <th>Balance (Rs.)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {orders.map((order, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{order.orderId}</td>
                                                                    <td>Rs. {order.totalBill}</td>
                                                                    <td>Rs. {order.salePrice}</td>
                                                                    <td>{formatDate(order.orderDate)}</td>
                                                                    <td>Rs. {order.advance ?? 0}</td>
                                                                    <td>Rs. {order.balance ?? 0}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="2"><strong>Total Sale Price</strong></td>
                                                                <td colSpan="4"><strong>Rs. {totalsByStatus[status]?.toLocaleString() || 0}</strong></td>
                                                            </tr>
                                                        </tfoot>
                                                    </Table>
                                                </TabPane>
                                            ))}
                                        </TabContent>
                                    </div>
                                )}
                            </div>

                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default SaleteamDetail;

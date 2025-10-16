import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import AddCustomer from "./AddCustomer";
import TableAllCustomer from "../components/tables/TableAllCustomer";
import TableCustomer from "../components/tables/TableCustomer";
import TableCreditCustomer from "../components/tables/TableCreditCustomer";

const AllCustomer = () => {
    const [activeTab, setActiveTab] = useState("Add Customer"); // Manage active tab name
    const location = useLocation();
    const navigate = useNavigate();

    // List of tab names
    const tabNames = [
        "Add Customer",
        "All Customers",
        "Credit Customer",
        "Cash Customer",
        "Loyal Customer",
        "Blacklisted Customer",
        "Issued Credit Customer"
    ];

    // Read the active tab from the URL query parameter (using `tab`)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get("tab");
        if (tab && tabNames.includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    // Update the URL when the active tab changes
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        navigate(`?tab=${tabName}`); // Update the URL with the tab query param
    };

    return (
        <Helmet title={'All-Customers'}>
            <section>
                <Container className="dashboard">
                    {/* Tab Navigation */}
                    <Nav tabs>
                        {tabNames.map((label, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={activeTab === label ? "active" : ""}
                                    onClick={() => handleTabChange(label)}
                                >
                                    {label}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>

                    {/* Tab Content */}
                    <TabContent activeTab={activeTab}>
                        {/* Add Customer Tab */}
                        <TabPane tabId="Add Customer">
                            <Row>
                                <Col>
                                    <AddCustomer />
                                </Col>
                            </Row>
                        </TabPane>

                        {/* All Customers Tab */}
                        <TabPane tabId="All Customers">
                            <Row>
                                <Col>
                                    <TableAllCustomer />
                                </Col>
                            </Row>
                        </TabPane>

                        {/* Credit Customers Tab */}
                        <TabPane tabId="Credit Customer">
                            <Row>
                                <Col>
                                    <TableCustomer filter="Credit" title="Credit Customers" />
                                </Col>
                            </Row>
                        </TabPane>

                        {/* Cash Customers Tab */}
                        <TabPane tabId="Cash Customer">
                            <Row>
                                <Col>
                                    <TableCustomer filter="Cash" title="Cash Customers" />
                                </Col>
                            </Row>
                        </TabPane>

                        {/* Loyal Customers Tab */}
                        <TabPane tabId="Loyal Customer">
                            <Row>
                                <Col>
                                    <TableCustomer filter="Loyal" title="Loyal Customers" />
                                </Col>
                            </Row>
                        </TabPane>

                        {/* Blacklisted Customers Tab */}
                        <TabPane tabId="Blacklisted Customer">
                            <Row>
                                <Col>
                                    {/* You can add a table or other component here */}
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="Issued Credit Customer">
                            <Row>
                                <Col>
                                    <TableCreditCustomer />
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllCustomer;

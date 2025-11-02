import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import TableAllItem from "../components/tables/TableAllItem";
import Tableforproduction from "../components/tables/Tableforproduction";
import TableInProduction from "../components/tables/TableInProduction";
import AddProduct from "./AddProducts";
import AddOtherDetails from "./AddOtherDetails";
import AddCategory from "./AddCategory";
import DamageStock from "./DamageStock";
import PurchaseDetails from "./purchaseitem";
import SupplierPayment from "./SupplierPayments";
import classnames from "classnames";
import TablePurchaseNote from "../components/tables/TablePurchaseNote";
import BarcodeSearchView from "./BarcodeSearchView";
import UpdateItem from "./updateItem";


const AllProducts = () => {
    const [activeTab, setActiveTab] = useState("Add Item"); // Main tab state
    const [nestedActiveTab, setNestedActiveTab] = useState("1"); // Nested tab state
    const location = useLocation();
    const navigate = useNavigate();

    // List of tab names
    const tabNames = [
        "Add Item",
        "All Products",
        "For Production",
        "In Production",
        "Damage Stock",
        "Add Categories",
        "Item Purchase",
        "QrChecker",
        "Update Items",
    ];

    // Read the active tab from the URL
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
        navigate(`?tab=${tabName}`);
    };

    return (
        <Helmet title={'All-Products'}>
            <section>
                <Container className="dashboard">
                    {/* Main Tabs */}
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
                        <TabPane tabId="Add Item">
                            <Row>
                                <Col>
                                    <AddProduct />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="All Products">
                            <Row>
                                <TableAllItem />
                            </Row>
                        </TabPane>

                        <TabPane tabId="For Production">
                            <Row>
                                <Col>
                                    <Tableforproduction />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="In Production">
                            <Row>
                                <Col>
                                    <TableInProduction />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="Damage Stock">
                            <Row>
                                <Col>
                                    <DamageStock />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="Add Categories">
                            <Row>
                                <Col>
                                    <AddCategory />
                                </Col>
                            </Row>
                        </TabPane>

                        {/* Purchase Item Tab with Nested Tabs */}
                        <TabPane tabId="Item Purchase">
                            <Nav tabs className="mb-3">
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "1" })}
                                        onClick={() => setNestedActiveTab("1")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Create Purchase Note
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "2" })}
                                        onClick={() => setNestedActiveTab("2")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        All Purchase Notes
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "3" })}
                                        onClick={() => setNestedActiveTab("3")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Supplier Payments
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            {/* Nested Tab Content */}
                            <TabContent activeTab={nestedActiveTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <PurchaseDetails />
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Row>
                                        <TablePurchaseNote />
                                    </Row>
                                </TabPane>
                                <TabPane tabId="3">
                                    <Row>
                                        <SupplierPayment />
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </TabPane>
                        <TabPane tabId="QrChecker">
                            <Row>
                                <Col>
                                    <BarcodeSearchView />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="Update Items">
                            <Row>
                                <Col>
                                    <UpdateItem />
                                </Col>
                            </Row>
                        </TabPane>

                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllProducts;

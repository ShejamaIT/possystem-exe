const AllOrders = () => {
    const navigate = useNavigate();

    const handleTabChange = (newTabId) => {
        setActiveTab(newTabId);

        // Example of programmatic navigation to a different route
        if (newTabId === "5") { // If the "Delivery Notes" tab is clicked
            navigate("/delivery-notes");
        }
    };

    return (
        <Helmet title={"Dashboard"}>
            <section>
                <Row>
                    <NavBar />
                </Row>
                <Container className="dashboard">
                    <Nav tabs className="mb-3">
                        {["Place Order", "Pending Orders", "Accepted Orders", "Production", "Completed Orders", "Delivery Notes", "Issued Orders", "Returned Orders", "Cancel Orders"].map((label, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({ active: activeTab === index.toString() })}
                                    onClick={() => handleTabChange(index.toString())}
                                    style={{ cursor: "pointer" }}
                                >
                                    {label}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>

                    <TabContent activeTab={activeTab}>
                        {/* Delivery Notes Tab */}
                        <TabPane tabId="5" key={refreshKey}>
                            <Nav tabs className="mb-3">
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "1" })}
                                        onClick={() => setNestedActiveTab("1")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Create Delivery Note
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "2" })}
                                        onClick={() => setNestedActiveTab("2")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        All delivery notes
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: nestedActiveTab === "3" })}
                                        onClick={() => setNestedActiveTab("3")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Add Scheduled Dates
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={nestedActiveTab}>
                                <TabPane tabId="1" key={refreshKey}>
                                    <Row>
                                        <DeliveryNotes />
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2" key={refreshKey}>
                                    <Row>
                                        <TableAllDeliveryNotes />
                                    </Row>
                                </TabPane>
                                <TabPane tabId="3" key={refreshKey}>
                                    <Row>
                                        <AddDeliveryShedule />
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </TabPane>
                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllOrders;

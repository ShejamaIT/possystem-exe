import React, { useState, useEffect } from "react";
import {Container, Row, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";

import AddVehicle from "./AddVehicle";
import TableAllVehicles from "../components/tables/TableAllVehicles";

const AllGraphs = () => {
    const [activeTab, setActiveTab] = useState("add-new-vehicle");
    const location = useLocation();
    const navigate = useNavigate();

    // Slug-based tab names
    const tabNames = [
        "add-new-vehicle",
        "all-vehicles",
    ];

    const tabLabels = {
        "add-new-vehicle": "Add New Vehicle",
        "all-vehicles": "All Vehicles",
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get("tab");
        if (tab && tabNames.includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        navigate(`?tab=${tabName}`);
    };

    return (
        <Helmet title={"Graphs"}>
            <section>
                <Container className="dashboard">
                    {/* Nav Tabs */}
                    <Nav tabs className="mb-3">
                        {tabNames.map((name, index) => (
                            <NavItem key={index}>
                                <NavLink
                                    className={classnames({ active: activeTab === name })}
                                    onClick={() => handleTabChange(name)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {tabLabels[name]}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>

                    {/* Tab Content */}
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="add-new-vehicle">
                            <Row>
                                <AddVehicle />
                            </Row>
                        </TabPane>

                        <TabPane tabId="all-vehicles">
                            <Row>
                                <TableAllVehicles />
                            </Row>
                        </TabPane>
                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllGraphs;

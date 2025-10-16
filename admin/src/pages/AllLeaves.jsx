import React, { useState, useEffect } from "react";
import {Container, Row, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";

import TableUserLeaves from "../components/tables/TableUserLeaves";
import Leaveform from "../pages/Leaveform";

const AllGraphs = () => {
    const [activeTab, setActiveTab] = useState("apply-leave");
    const location = useLocation();
    const navigate = useNavigate();

    // Slug-based tab names
    const tabNames = [
        "apply-leave",
        "monthly-leaves",
    ];

    const tabLabels = {
        "apply-leave": "Apply Leave",
        "monthly-leaves": "Monthly leaves",
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
        <Helmet title={"Leaves"}>
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
                        <TabPane tabId="apply-leave">
                            <Row>
                                <Leaveform />
                            </Row>
                        </TabPane>

                        <TabPane tabId="monthly-leaves">
                            <Row>
                                <TableUserLeaves />
                            </Row>
                        </TabPane>

                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllGraphs;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";

import MonthlyIncomeGraphs from "./graphs/IncomeGraphs"; // Monthly/Daily will be controlled inside
import DailyIncomeGraphs from "./graphs/IncomeDailyGraphs";
import ItemGraphs from "./graphs/ItemGraphs";
import SaleTeamGraphs from "./graphs/SaleTeamGraphs";

const AllGraphs = () => {
  const [activeTab, setActiveTab] = useState("income-performance");
  const [incomeSubTab, setIncomeSubTab] = useState("monthly"); // NEW: subtab for income
  const location = useLocation();
  const navigate = useNavigate();

  // Slug-based tab names
  const tabNames = [
    "income-performance",
    "item-selling-performance",
    "sale-team-performance",
  ];

  const tabLabels = {
    "income-performance": "Income Performance",
    "item-selling-performance": "Item Selling Performance",
    "sale-team-performance": "Sale Team Performance",
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab && tabNames.includes(tab)) {
      setActiveTab(tab);
    }
    const sub = searchParams.get("sub");
    if (sub && ["monthly", "daily"].includes(sub)) {
      setIncomeSubTab(sub);
    }
  }, [location]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`?tab=${tabName}&sub=${incomeSubTab}`);
  };

  const handleIncomeSubTabChange = (subTab) => {
    setIncomeSubTab(subTab);
    navigate(`?tab=income-performance&sub=${subTab}`);
  };

  return (
    <Helmet title={"Graphs"}>
      <section>
        <Container className="dashboard">
          {/* Main Nav Tabs */}
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
            <TabPane tabId="income-performance">
              {/* Sub Tabs for Income */}
              <Nav tabs className="mb-3">
                <NavItem>
                  <NavLink
                    className={classnames({ active: incomeSubTab === "monthly" })}
                    onClick={() => handleIncomeSubTabChange("monthly")}
                    style={{ cursor: "pointer" }}
                  >
                    Monthly
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: incomeSubTab === "daily" })}
                    onClick={() => handleIncomeSubTabChange("daily")}
                    style={{ cursor: "pointer" }}
                  >
                    Daily
                  </NavLink>
                </NavItem>
              </Nav>

              {/* Sub Tab Content */}
              <TabContent activeTab={incomeSubTab}>
                <TabPane tabId="monthly">
                  <Row>
                    <MonthlyIncomeGraphs type="monthly" />
                  </Row>
                </TabPane>
                <TabPane tabId="daily">
                  <Row>
                    <DailyIncomeGraphs type="daily" />
                  </Row>
                </TabPane>
              </TabContent>
            </TabPane>

            <TabPane tabId="item-selling-performance">
              <Row>
                <ItemGraphs />
              </Row>
            </TabPane>

            <TabPane tabId="sale-team-performance">
              <Row>
                <SaleTeamGraphs />
              </Row>
            </TabPane>
          </TabContent>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllGraphs;

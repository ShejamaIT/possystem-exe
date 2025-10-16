import React, { useState, useEffect } from "react";
import {
    Container, Row, Nav, NavItem, NavLink, TabContent, TabPane
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import classnames from "classnames";
import Helmet from "../components/Helmet/Helmet";
import ReceivedCheques from "./Payments/ReceivedCheques";
// import ClearedCheques from "./Payments/ClearedCheques";
// import BouncedCheques from "./Payments/BouncedCheques";
import CashBalanceInput from "./Payments/CashPayment";
import CashToday from "./Payments/CashToday";
import CashWeekly from "./Payments/CashWeekly";
// import CashMonthly from "./Payments/CashMonthly";
import BankDeposits from "./Payments/BankDeposits";
import BankDetails from "./Payments/BankDetails";
// import PaymentsPending from "./Payments/PaymentsPending";
// import PaymentsCompleted from "./Payments/PaymentsCompleted";
// import PaymentsOverdue from "./Payments/PaymentsOverdue";
import OrderPayment from "./OrderPayment";
import CustomerPayment from "./CustomerPayment";

const AllPayments = () => {
    const [activeTab, setActiveTab] = useState("invoice-payments");
    const [subTabs, setSubTabs] = useState({
        "invoice-payments": "orderby",
        "cash-balance": "today",
        "cheque-details": "received",
        "bank-details": "deposits",
        "customer-payments": "pending"
    });

    const location = useLocation();
    const navigate = useNavigate();

    const tabNames = [
        "invoice-payments",
        "cash-balance",
        "cheque-details",
        "bank-details",
        "customer-payments",
        
    ];

    const tabLabels = {
        "invoice-payments" : "Invoice Payments",
        "cash-balance": "Cash Balance",
        "cheque-details": "Cheque Details",
        "bank-details": "Bank Details",
        "customer-payments": "Customer Payments",
        
    };

    const subTabOptions = {
        "invoice-payments":["orderby","customerby"],
        "cash-balance": ["today", "weekly", "monthly" , "payments"],
        "cheque-details": ["received", "cleared", "bounced"],
        "bank-details": ["deposits&withdrawals","add&update"],
        "customer-payments": ["pending", "completed", "overdue"],
        
    };

    const subTabLabels = {
        "today": "Today",
        "weekly": "Weekly",
        "monthly": "Monthly",
        "received": "Received",
        "cleared": "Cleared",
        "bounced": "Bounced",
        "deposits&withdrawals": "Deposits & Withdrawals",
        "add&update" :" Add & Update",
        "pending": "Pending",
        "completed": "Completed",
        "overdue": "Overdue",
        "orderby":"OrderBy",
        "customerby": "CustomerBy",
        "payments" : "Cash Payments"
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

    const handleSubTabChange = (mainTab, subTab) => {
        setSubTabs((prev) => ({ ...prev, [mainTab]: subTab }));
    };

    const renderSubTabContent = (mainTab, subTab) => {
        if (mainTab === "cash-balance") {
             if (subTab === "today") return <CashToday />;
            if (subTab === "weekly") return <CashWeekly />;
            // if (subTab === "monthly") return <CashMonthly />;
            if (subTab === "payments") return <CashBalanceInput />;
        }
        if (mainTab === "cheque-details") {
            if (subTab === "received") return <ReceivedCheques />;
            // if (subTab === "cleared") return <ClearedCheques />;
            // if (subTab === "bounced") return <BouncedCheques />;
        }
        if (mainTab === "bank-details") {
            if (subTab === "deposits&withdrawals") return <BankDeposits />;
             if (subTab === "add&update") return <BankDetails />;
        }
        if (mainTab === "customer-payments") {
            // if (subTab === "pending") return <PaymentsPending />;
            // if (subTab === "completed") return <PaymentsCompleted />;
            // if (subTab === "overdue") return <PaymentsOverdue />;
        }
        if(mainTab === "invoice-payments"){
            if (subTab === "orderby") return <OrderPayment />;
             if (subTab === "customerby") return <CustomerPayment />;
            // return <OrderPayment />
        }
        return <p>No content available.</p>;
    };

    return (
        <Helmet title="All Payments">
            <section>
                <Container className="dashboard">
                    <Nav tabs className="mb-3">
                        {tabNames.map((name) => (
                            <NavItem key={name}>
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

                    <TabContent activeTab={activeTab}>
                        {tabNames.map((name) => (
                            <TabPane tabId={name} key={name}>
                                <Nav tabs className="mb-3">
                                    {subTabOptions[name].map((sub) => (
                                        <NavItem key={sub}>
                                            <NavLink
                                                className={classnames({ active: subTabs[name] === sub })}
                                                onClick={() => handleSubTabChange(name, sub)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {subTabLabels[sub]}
                                            </NavLink>
                                        </NavItem>
                                    ))}
                                </Nav>

                                <Row>
                                    <div className="p-3 border rounded bg-light w-100">
                                        {renderSubTabContent(name, subTabs[name])}
                                    </div>
                                </Row>
                            </TabPane>
                        ))}
                    </TabContent>
                </Container>
            </section>
        </Helmet>
    );
};

export default AllPayments;

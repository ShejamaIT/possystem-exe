import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Helmet from "../../components/Helmet/Helmet";
import NavBar from "../NavBar/Navbar";
import SaleTeamSidebar from "../SideBar/SaleTeamSidebar";
import "../../style/Dashboard.css";
import { Container } from "reactstrap";
import useAuth from "../../router/useAuth";

const SaleTeamDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useAuth();
    return (
        <Helmet title="User Dashboard">
            <div className="dashboard-container">
                <SaleTeamSidebar onNavigate={navigate} activePage={location.pathname} />
                <div className="main-content">
                    <NavBar onNavigate={navigate} />
                    <div className="page-content">
                        <Container fluid>
                            <Outlet />
                        </Container>
                    </div>
                </div>
            </div>
        </Helmet>
    );
};

export default SaleTeamDashboard;

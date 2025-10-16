import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Helmet from "../../components/Helmet/Helmet";
import NavBar from "../NavBar/Navbar";
import ItSidebar from "../SideBar/itSidebar";
import "../../style/Dashboard.css";
import { Container } from "reactstrap";
import useAuth from "../../router/useAuth";

const ItDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useAuth();
    return (
        <Helmet title="It Dashboard">
            <div className="dashboard-container">
                <ItSidebar onNavigate={navigate} activePage={location.pathname} />
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

export default ItDashboard;

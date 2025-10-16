import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Helmet from "../../components/Helmet/Helmet";
import NavBar from "../NavBar/Navbar";
import AdminSidebar from "../SideBar/AdminSidebar";
import "../../style/Dashboard.css";
import { Container } from "reactstrap";
import useAuth from "../../router/useAuth";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    useAuth();
    return (
        <Helmet title="Admin Dashboard">
            <div className="dashboard-container">
                <AdminSidebar onNavigate={navigate} activePage={location.pathname} />
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

export default AdminDashboard;

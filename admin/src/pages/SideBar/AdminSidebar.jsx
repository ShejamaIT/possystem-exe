import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/Sidebar.css';
import Swal from "sweetalert2";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTachometerAlt,faTags,faChartLine, faBox, faCartShopping, faList, faTruck,faUsers,faUserTie,faCoins,faBus,faMoneyBill,faRightFromBracket} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ onNavigate }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Do you want to logout?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#0a1d37',
            cancelButtonColor: '#D3D3D3',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-popup',
            },
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/SignIn');
                    return;
                }

                const response = await fetch('http://localhost:5001/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                localStorage.clear();

                if (response.ok) {
                    navigate('/SignIn');
                } else {
                    const data = await response.json();
                    console.error(data);
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }
    };

    const menuItems = [
        { id: "dashboard", icon: faTachometerAlt, label: "Dashboard", path: "/admin-dashboard" },
        { id: "price_list", icon: faTags, label: "Item Price List", path: "/admin-dashboard/item_prices" },
        { id: "stock", icon: faChartLine, label: "Graphs", path: "/admin-dashboard/graphs" },
        { id: "products", icon: faBox, label: "Products", path: "/admin-dashboard/products" },
        { id: "orders", icon: faCartShopping, label: "Invoice", path: "/admin-dashboard/orders" },
        { id: "product_list", icon: faList, label: "Orders", path: "/admin-dashboard/product_list" },
        { id: "payments", icon: faMoneyBill, label: "Payments", path: "/admin-dashboard/payments" },
        { id: "deliveries", icon: faTruck, label: "Issuals", path: "/admin-dashboard/delivery" },
        { id: "customers", icon: faUsers, label: "Customers", path: "/admin-dashboard/customers" },
        { id: "employees", icon: faUserTie, label: "Employees", path: "/admin-dashboard/employees" },
        { id: "suppliers", icon: faCoins, label: "Suppliers", path: "/admin-dashboard/suppliers" },
        { id: "vehicles", icon: faBus, label: "Vehicles", path: "/admin-dashboard/vehicles" },
        
    ];

    return (
        <div className="sidebar">
            <div className="logo-details">
                <span className="logo_name">Shejama - V1.1</span>
            </div>
            <ul className="nav-links">
                {menuItems.map(item => (
                    <li key={item.id}>
                        <a
                            href="#"
                            className={location.pathname === item.path ? "active" : ""}
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate(item.path);
                            }}
                        >
                            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                            <span className="links_name">{item.label}</span>
                        </a>
                    </li>
                ))}
                <li className="log_out">
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="sidebar-icon" />
                        <span className="links_name">Log out</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;

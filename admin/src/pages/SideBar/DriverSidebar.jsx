import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../style/Sidebar.css';
import Swal from "sweetalert2";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTachometerAlt,faTruckMoving,faCalendarPlus, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';

const DriverSidebar = ({ onNavigate }) => {
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
        { id: "dashboard", icon: faTachometerAlt, label: "Dashboard", path: "/driver-dashboard" },
        { id: "deliveries", icon: faTruckMoving, label: "Deliveries", path: "/driver-dashboard/delivery" },
        { id: "leave", icon: faCalendarPlus, label: "Leaves", path: "/driver-dashboard/leave" },
    ];

    return (
        <div className="sidebar">
            <div className="logo-details">
                <span className="logo_name">Shejama - V1.0 </span>
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

export default DriverSidebar;

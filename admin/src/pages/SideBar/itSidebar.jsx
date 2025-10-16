import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import '../../style/Sidebar.css';
import Swal from "sweetalert2";

const ItSidebar = ({ onNavigate, activePage }) => {
    const location = useLocation();
    const navigate = useNavigate()
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
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }
    };

    const menuItems = [
        {id: "dashboard", icon: "bx-grid-alt", label: "Dashboard", path: "/it-dashboard"},
        {id: "leave", icon: "bx-calendar-plus", label: "Leaves", path: "/it-dashboard/leave"},
    ];
    return (
        <div className="sidebar">
            <div className="logo-details">
                <i className='bx bx-code-alt'></i>
                <span className="logo_name">Shejama</span>
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
                            <i className={`bx ${item.icon}`}></i>
                            <span className="links_name">{item.label}</span>
                        </a>
                    </li>
                ))}
                <li className="log_out">
                    <a href="/admin/public" onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        handleLogout();     // Call your logout function
                    }}>
                        <i className='bx bx-log-out'></i>
                        <span className="links_name">Log out</span>
                    </a>
                </li>

            </ul>
        </div>
    );
};

export default ItSidebar;

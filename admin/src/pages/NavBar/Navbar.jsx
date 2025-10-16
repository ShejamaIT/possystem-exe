import React, { useEffect, useState } from 'react';
import '../../style/Navbar.css';
import { BiMenu } from 'react-icons/bi';
import userIcon from '../../assets/images/user-icon.png';

const Navbar = () => {
    const [empName, setEmpName] = useState('');
    const [appliedLeaves, setAppliedLeaves] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const totalNotifications =
        appliedLeaves.length + pendingRequests.length + pendingOrders.length;

    useEffect(() => {
        const eid = localStorage.getItem('EID');
        const type = localStorage.getItem('type');

        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/main/employees');
                const data = await response.json();
                if (data.success && Array.isArray(data.employees)) {
                    const currentEmp = data.employees.find(emp => emp.E_Id.toString() === eid);
                    if (currentEmp) setEmpName(currentEmp.name);
                }
            } catch (err) {
                console.error('Error fetching employees:', err);
            }
        };

        const fetchAllNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/main/applied_leaves-and-requests-and-ordercounts');
                const data = await response.json();
                if (data.success) {
                    setAppliedLeaves(data.data.appliedLeaves || []);
                    setPendingRequests(data.data.pendingRequests || []);
                    setPendingOrders(data.data.pendingOnsiteOrders || []);
                }
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };

        fetchEmployees();
        if (type === 'ADMIN') fetchAllNotifications();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    return (
        <nav className="navbar">
            <div className="sidebar-button">
                <BiMenu className="sidebarBtn" />
                <span className="dashboard">Dashboard</span>
            </div>

            <div className="profile-details">
                <div className="notification-icon" onClick={toggleDropdown} style={{ cursor: 'pointer', position: 'relative' }}>
                    <i className='bx bx-bell'></i>
                    {totalNotifications > 0 && (
                        <span className="notification-badge">{totalNotifications}</span>
                    )}

                    {dropdownOpen && (
                        <div className="notification-dropdown">
                            <strong>Applied Leaves</strong>
                            {appliedLeaves.length > 0 ? (
                                appliedLeaves.map((leave, idx) => (
                                    <div key={idx} className="notification-item">
                                        <p><strong>{leave.name}</strong> ({formatDate(leave.date)})</p>
                                    </div>
                                ))
                            ) : (
                                <div className="notification-item">No applied leaves</div>
                            )}

                            <strong>Pending Requests</strong>
                            {pendingRequests.length > 0 ? (
                                pendingRequests.map((req, idx) => (
                                    <div key={idx} className="notification-item">
                                        <p><strong>{req.name}</strong> - {req.reason}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="notification-item">No pending requests</div>
                            )}

                            <strong>Pending On-site Orders</strong>
                            {pendingOrders.length > 0 ? (
                                pendingOrders.map((order, idx) => (
                                    <div key={idx} className="notification-item">
                                        <p><strong>{order.sales_team_name}</strong>({order.stID}): {order.pendingOrderCount}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="notification-item">No pending on-site orders</div>
                            )}
                        </div>
                    )}
                </div>

                <img src={userIcon} alt="Profile" />
                <span className="admin_name">{empName || "User"}</span>
            </div>
        </nav>
    );
};

export default Navbar;

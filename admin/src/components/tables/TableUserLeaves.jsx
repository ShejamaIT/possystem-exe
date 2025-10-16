import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/TableThree.css";

const TableLeave = ({ refreshKey }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaves();
    }, [refreshKey]);

    const fetchLeaves = async () => {
        const id = localStorage.getItem('EID');
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/monthly-leaves/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch leaves");

            setLeaves(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };


    return (
        <div className="table-container">
            <h4 className="table-title">Monthly Leaves</h4>
            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Applied Date</th>
                        <th>Leave Type</th>
                        <th>Duration Type</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="8" className="text-center">Loading leaves...</td></tr>
                    ) : error ? (
                        <tr><td colSpan="8" className="text-center text-error">{error}</td></tr>
                    ) : leaves.length === 0 ? (
                        <tr><td colSpan="8" className="text-center">No applied leaves found</td></tr>
                    ) : (
                        leaves.map((leave) => (
                            <tr key={leave.id}>
                                <td>{leave.id}</td>
                                <td>{leave.name || leave.E_Id}</td>
                                <td>{formatDate(leave.date)}</td>
                                <td>{leave.leave_type}</td>
                                <td>{leave.duration_type}</td>
                                <td>{leave.reason}</td>
                                <td>{leave.status}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableLeave;

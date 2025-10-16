import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/TableThree.css";
import { toast } from "react-toastify";

const TableLeave = ({ refreshKey }) => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
         fetchLeaves();
    }, [refreshKey]);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/applied-leaves");
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

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/approve-leave/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to approve leave");

            toast.success("Leave approved successfully");
            fetchLeaves();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (err) {
            alert("Error approving leave: " + err.message);
        }
    };

    const handleRejected = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/reject-leave/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to approve leave");

            toast.warning("Leave Rejected successfully");
            fetchLeaves();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            alert("Error approving leave: " + err.message);
        }
    };


    return (
        <div className="table-container">
            <h4 className="table-title">All Applied Leaves</h4>
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
                        <th>Action</th>
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
                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => handleApprove(leave.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleRejected(leave.id)}
                                    >
                                        Rejected
                                    </button>
                                </td>
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

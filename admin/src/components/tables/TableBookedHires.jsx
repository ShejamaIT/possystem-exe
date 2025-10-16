import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/TableThree.css";
import ChangeQty from "../../pages/changeQty";
import HirePayment from "../../pages/hirePayment";

const TableBookedHires = ({ refreshKey }) => {
    const [hires, setHires] = useState([]);
    const [filteredHires, setFilteredHires] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedHire, setSelectedHire] = useState(null);
    const type = localStorage.getItem("type");
    const Eid = localStorage.getItem("EID");

    useEffect(() => {
        fetchHires();
    }, [refreshKey]);

    const fetchHires = async () => {
        try {
            const endpoint = type === "ADMIN"
                ? "http://localhost:5001/api/admin/main/other-hires"
                : `http://localhost:5001/api/admin/main/other-hires-stid?eid=${Eid}`;

            const response = await fetch(endpoint);

            const data = await response.json(); // ✅ FIX: Parse response first
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch hires");
            }

            setHires(data.booked);
            setFilteredHires(data.booked);
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

    const handleView = (hire) => {
        setSelectedHire(hire);
        setShowModal(true);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = hires.filter((hire) =>
            hire.custname?.toLowerCase().includes(query) ||
            hire.id?.toString().includes(query) ||
            hire.phoneNumber?.toLowerCase().includes(query)
        );

        setFilteredHires(filteredData);
    };
    const handleSubmit2 = async (formData) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/other-hire/payment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer: formData.customer,
                    customerPayment: Number(formData.customerPayment),
                    customerBalance: Number(formData.customerBalance),
                    driver: formData.driver,
                    driverHandover: Number(formData.driverHandover),
                    driverBalance: Number(formData.driverBalance),
                    profitOrLoss: Number(formData.profitOrLoss),
                    lossBy: formData.lossBy || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                fetchHires(); // Refresh data if applicable
                alert("Payment processed successfully!");
            } else {
                alert(`❌ Failed to update payment: ${data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("❌ Error during payment update:", error);
            alert(`Error updating payment: ${error.message}`);
        }
    };



    return (
        <div className="table-container">
            <h4 className="table-title">All Booked Hires</h4>
            <input
                type="text"
                placeholder="Search by Customer Name, ID, or Phone..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Pickup</th>
                        <th>Destination</th>
                        <th>Hire</th>
                        <th>Date</th>
                        <th>Driver</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        {type === "ADMIN" && (
                            <th>Actions</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="10" className="text-center">Loading hires...</td></tr>
                    ) : error ? (
                        <tr><td colSpan="10" className="text-center text-error">{error}</td></tr>
                    ) : filteredHires.length === 0 ? (
                        <tr><td colSpan="10" className="text-center">No hires found</td></tr>
                    ) : (
                        filteredHires.map((hire) => (
                            <tr key={hire.id}>
                                <td>{hire.id}</td>
                                <td>{hire.custname}</td>
                                <td>{hire.phoneNumber}</td>
                                <td>{hire.pickup}</td>
                                <td>{hire.destination}</td>
                                <td>{hire.hire}</td>
                                <td>{formatDate(hire.date)}</td>
                                <td>{hire.driverName }</td>
                                <td>{hire.registration_no }</td>
                                <td>{hire.status}</td>
                                {type === "ADMIN" && (
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => handleView(hire)}
                                        >
                                            👁️
                                        </button>
                                    </td>
                                )}

                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                {showModal && selectedHire && (
                    <HirePayment
                        selectedHire={selectedHire}
                        setShowModal={setShowModal}
                        handleSubmit2={handleSubmit2}
                    />
                )}

            </div>
        </div>
    );
};

export default TableBookedHires;

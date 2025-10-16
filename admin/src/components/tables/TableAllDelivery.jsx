import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css"; // Import the stylesheet
import { useNavigate } from "react-router-dom";

const TableAllDelivery= () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        fetchItems();
    }, []);

    // Fetch all items from API
    const fetchItems = async () => {
        setLoading(true); // Start loading state

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/alldeliveries");
            const data = await response.json();

            if (data.length > 0) {
                setDeliveries(data); // Store fetched items
            } else {
                setDeliveries([]); // Set empty array
                setError("No deliveries available."); // Show "No items" message
            }
        } catch (error) {
            setDeliveries([]); // Ensure items array is empty on error
            setError("Error fetching deliveries.");
            console.error("Error fetching deliveries:", error);
        } finally {
            setLoading(false); // Stop loading state
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
            <h4 className="table-title">All Deliveries</h4>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Delivery Id</th>
                        <th>Order Id</th>
                        <th>District</th>
                        <th>Status</th>
                        <th>Schedule Date</th>
                        <th>Delivery Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="loading-text text-center">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="8" className="error-text text-center">{error}</td>
                        </tr>
                    ) : deliveries.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="no-items-message text-center">No items found</td>
                        </tr>
                    ) : (
                        deliveries.map((delivery) => (
                            <tr key={delivery.dv_id}>
                                <td>{delivery.dv_id}</td>
                                <td>{delivery.orID}</td>
                                <td>{delivery.district}</td>
                                <td>{delivery.status}</td>
                                <td>{formatDate(delivery.schedule_Date)}</td>
                                <td>{formatDate(delivery.delivery_Date)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableAllDelivery;

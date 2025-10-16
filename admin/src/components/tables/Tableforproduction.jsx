import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css"; // Import the stylesheet
import { useNavigate } from "react-router-dom";

const TableForProduction = ({ refreshKey }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        fetchItems();
    }, [refreshKey]);

    // Fetch all items from API
    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitemslessone"); // Adjust API URL if needed
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch items.");
            }

            setItems(data); // Assuming `data` contains the array of items
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSuppliers = (itemId) => {
        navigate(`/supplier-detail/${itemId}`); // Navigate to Supplier Details page
    };

    return (
        <div className="table-container">
            <h4 className="table-title">For Production Items</h4>

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="loading-text text-center">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="6" className="error-text text-center">{error}</td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="no-items-message text-center">No items for production</td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr key={item.I_Id}>
                                <td>{item.I_name}</td>
                                <td>Rs.{item.price}</td>
                                <td>{item.availableQty}</td>
                                <td>{item.descrip}</td>
                                <td className="action-buttons">
                                    <button
                                        className="view-btn"
                                        onClick={() => handleViewSuppliers(item.I_Id)}
                                    >
                                        👁️ Get Suppliers
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

export default TableForProduction;

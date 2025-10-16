import React, { useState, useEffect } from "react";
import "../../style/TableTwo.css"; // Import the stylesheet
import { useNavigate } from "react-router-dom";

const TableCustomer = ({ filter, title }) => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]); // Stores search results
    const [searchQuery, setSearchQuery] = useState(""); // Search input state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, [filter]); // Re-fetch when filter changes

    // Fetch customers from API with the provided filter
    const fetchCustomers = async () => {
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5001/api/admin/main/allcustomers?filter=${filter}`);
        const data = await response.json();

        const customersArray = Array.isArray(data) ? data : [];

        if (response.ok) {
            setCustomers(customersArray);
            setFilteredCustomers(customersArray); // ✅ always an array
        } else {
            setCustomers([]);
            setFilteredCustomers([]);
            setError(data.message || "No customers available.");
        }
    } catch (error) {
        setCustomers([]);
        setFilteredCustomers([]);
        setError("Error fetching customers.");
        console.error("Error fetching customers:", error);
    } finally {
        setLoading(false);
    }
};


    // Handle search filter (Only by Name, NIC (ID), and Contact)
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = customers.filter((customer) => {
            return (
                (customer.FtName && customer.FtName.toLowerCase().includes(query)) ||
                (customer.SrName && customer.SrName.toLowerCase().includes(query)) ||
                (customer.id && customer.id.toLowerCase().includes(query)) ||
                (customer.contact1 && customer.contact1.toLowerCase().includes(query)) ||
                (customer.contact2 && customer.contact2.toLowerCase().includes(query))
            );
        });

        setFilteredCustomers(filteredData);
    };
    const handleViewCustomer = (c_ID) => {
        navigate(`/customer-details/${c_ID}`);
    };

    return (
        <div className="table-container">
            <h4 className="table-title">{title}</h4>

            {/* 🔍 Search Box */}
            <input
                type="text"
                placeholder="Search by Name, NIC, or Contact..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Customer Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>NIC</th>
                        <th>Contact</th>
                        <th>Optional</th>
                        <th>Balance</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="loading-text text-center">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="7" className="error-text text-center">{error}</td>
                        </tr>
                    ) : filteredCustomers.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="no-items-message text-center">No customers found</td>
                        </tr>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <tr key={customer.c_ID}>
                                <td>{customer.c_ID}</td>
                                <td>{customer.FtName}</td>
                                <td>{customer.SrName}</td>
                                <td>{customer.id}</td>
                                <td>{customer.contact1}</td>
                                <td>{customer.contact2}</td>
                                <td className={customer.balance < 0 ? "negative-balance" : ""}>
                                    {customer.balance}
                                </td>
                                <td>{customer.type}</td>
                                <td className="action-buttons">
                                    <button
                                        className="view-btn"
                                         onClick={() => handleViewCustomer(customer.c_ID)}
                                    >
                                        👁️
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

export default TableCustomer;

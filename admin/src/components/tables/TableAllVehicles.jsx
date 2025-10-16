import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/TableThree.css";
const TableVehicle = ({ refreshKey }) => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicles();
    }, [refreshKey]);

    const fetchVehicles = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/vehicles");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch vehicles");
            }

            setVehicles(data.data);
            setFilteredVehicles(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };

    const handleView = (id) => {
        navigate(`/vehicle-view/${id}`);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = vehicles.filter((v) =>
            v.registration_no.toLowerCase().includes(query)
        );

        setFilteredVehicles(filteredData);
    };

    return (
        <div className="table-container">
            <h4 className="table-title">All Vehicles</h4>

            <input
                type="text"
                placeholder="Search by Registration Number..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Registration No</th>
                        <th>Fuel</th>
                        <th>License Date</th>
                        <th>Insurance Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="11" className="loading-text text-center">Loading vehicles...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="11" className="error-text text-center">{error}</td>
                        </tr>
                    ) : filteredVehicles.length === 0 ? (
                        <tr>
                            <td colSpan="11" className="no-data text-center">No Vehicles found</td>
                        </tr>
                    ) : (
                        filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.registration_no}</td>
                                <td>{vehicle.fuel_type}</td>
                                <td>{formatDate(vehicle.license_Date)}</td>
                                <td>{formatDate(vehicle.insurance_Date)}</td>
                                <td>{vehicle.status}</td>
                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => handleView(vehicle.id)}
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

export default TableVehicle;


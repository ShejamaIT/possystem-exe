import React, { useState, useEffect } from "react";
import "../style/deleiverynote.css";
import { toast } from "react-toastify";

const MakeDeliveryNoteNow = ({ selectedOrders, setShowModal, handleDeliveryUpdate }) => {
    // Ensure selectedOrders is a single object (in case passed as array)
    const order = Array.isArray(selectedOrders) ? selectedOrders[0] : selectedOrders;
    const [vehicleId, setVehicleId] = useState("");
    const [driverName, setDriverName] = useState("");
    const [driverId, setDriverId] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [dnNumber, setDnNumber] = useState("");
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [hire, setHire] = useState("");
    const [balanceToCollect, setBalanceToCollect] = useState(0);
    const [filteredDriver, setFilteredDriver] = useState([]);
    const [filteredVehicle, setFilteredVehicle] = useState([]);

    useEffect(() => {
        setBalanceToCollect(order.totalPrice - order.advance);
    }, [order]);

    useEffect(() => {
        setHire(order.deliveryCharge?.toString() || "0");
    }, [order]);

    const fetchDrivers = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/drivers");
            const data = await response.json();
            setDrivers(data.data || []);
        } catch (error) {
            toast.error("Error fetching drivers.");
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/vehicles");
            const data = await response.json();
            setVehicles(data.data || []);
        } catch (error) {
            toast.error("Error fetching vehicles.");
        }
    };

    useEffect(() => {
        fetchVehicles();
        fetchDrivers();
    }, []);

    const handlePrintAndSubmit = () => {
        if (balanceToCollect > 0 && (vehicleId === "" || hire === "" || !driverId)) {
            toast.error("Please provide vehicle ID, hire value, and select a driver before submitting.");
            return;
        }
        handleDeliveryUpdate({
            orders: [order], // still sent as an array for backend compatibility
            vehicleId,
            driverName,
            driverId,
            hire,
            dnNumber,
            balanceToCollect,
        });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setDriverName(value);
        if (!value.trim()) {
            setFilteredDriver([]);
        } else {
            const filtered = drivers.filter((driver) =>
                driver.devID.toString().includes(value) ||
                driver.employeeName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredDriver(filtered);
        }
    };

    const handleSearchChange1 = (e) => {
        const value = e.target.value;
        setVehicleId(value);
        if (!value.trim()) {
            setFilteredVehicle([]);
        } else {
            const filtered = vehicles.filter((vehicle) =>
                vehicle.registration_no?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredVehicle(filtered);
        }
    };

    const handleSelectDriver = (driver) => {
        setDriverId(driver.devID);
        setDriverName(driver.employeeName);
        setFilteredDriver([]);
    };

   const handleSelectVehicle = (vehicle) => {
        setVehicle(vehicle.registration_no); // for displaying in input
        setVehicleId(vehicle.registration_no); // for saving actual value
        setFilteredVehicle([]);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content make-delivery-note">
                <h2 className="invoice-title">Make Delivery Note Now</h2>
                <div className="invoice-section">
                    <table className="receipt-table">
                        <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Total</th>
                            <th>Advance</th>
                            <th>Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr >
                            <td>{order.orderId}</td>
                            <td>{order.customerName}</td>
                            <td>Rs.{order.totalPrice}</td>
                            <td>Rs.{order.advance}</td>
                            <td>Rs.{balanceToCollect}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Balance Summary */}
                <div className="balance-to-collect">
                    <p><strong>Total Balance to Collect:</strong> Rs.{balanceToCollect}</p>
                </div>

                {/* Vehicle and Driver Info */}
                <div className="delivery-details">
                    <div className="input-group">
                        {/* Vehicle ID */}
                        <div className="vehicle-info">
                            <label><strong>Vehicle ID:</strong></label>
                            <input
                                type="text"
                                placeholder="Search vehicle ID"
                                value={vehicle}
                                onChange={handleSearchChange1}
                            />
                            {vehicleId && filteredVehicle.length > 0 && (
                                <div className="dropdown">
                                    {filteredVehicle.map((vehicle) => (
                                        <div
                                            key={vehicle.registration_no}
                                            onClick={() => handleSelectVehicle(vehicle)}
                                            className="dropdown-item"
                                        >
                                            {vehicle.registration_no} - {vehicle.brand} {vehicle.model}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Driver Selection */}
                        <div className="driver-info">
                            <label><strong>Driver Name:</strong></label>
                            <input
                                type="text"
                                placeholder="Search driver"
                                value={driverName}
                                onChange={handleSearchChange}
                            />
                            {vehicleId && filteredDriver.length > 0 && (
                                <div className="dropdown">
                                    {filteredDriver.map((driver) => (
                                        <div
                                            key={driver.devID}
                                            onClick={() => handleSelectDriver(driver)}
                                            className="dropdown-item"
                                        >
                                            {driver.employeeName} ({driver.devID})
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="input-group">
                        {/* Dn Number */}
                        <div className="hire-info">
                            <label><strong>Dn Number:</strong></label>
                            <input
                                type="text"
                                value={dnNumber}
                                onChange={(e) => setDnNumber(e.target.value)}
                                placeholder="Enter Dn Number"
                            />
                        </div>
                        {/* Hire Fee */}
                        <div className="hire-info">
                            <label><strong>Hire:</strong></label>
                            <input
                                type="text"
                                value={hire}
                                onChange={(e) => setHire(e.target.value)}
                                placeholder="Enter hire value"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-buttons">
                    <button className="print-btn" onClick={handlePrintAndSubmit}>Save</button>
                    <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MakeDeliveryNoteNow;

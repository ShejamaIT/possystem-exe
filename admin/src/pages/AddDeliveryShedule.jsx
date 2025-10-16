import React, { useState, useEffect } from "react";
import { Container, Row, Col, Label, Input, Button, Table } from "reactstrap";
import '../style/delivery.css';
import {toast} from "react-toastify";
const AddDeliverySchedule = () => {
    const [deliveryRates, setDeliveryRates] = useState({ District: "", rate: "" });
    const [scheduledDates, setScheduledDates] = useState({ District: "", dates: [] });
    const [dateInput, setDateInput] = useState(""); // Temporary input for a single date
    const [dbRates, setDbRates] = useState([]); // Store the fetched delivery rates
    const [dbDates, setDbDates] = useState([]); // Store the fetched delivery Dates
    const [selectedDistrict, setSelectedDistrict] = useState(""); // Store selected district
    // Fetch delivery rates from the DB on component mount
    useEffect(() => {
        fetchDeliveryRates();
    }, []);
    const fetchDeliveryRates = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/delivery-rates"); // Replace with your API endpoint
            const data = await response.json();
            if (data.success) {
                setDbRates(data.data); // If data is available, store it in the dbRates state

            } else {
                setDbRates([]); // If no data is found, set it to an empty array
            }
        } catch (error) {
            console.error("Error fetching delivery rates:", error);
            setDbRates([]); // Set empty array if there's an error
        }
    };
    // Fetch delivery dates based on selected district
    const fetchDeliveryDates = async (district) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/delivery-schedule?district=${district}`);
            const data = await response.json();

            if (response.ok) {
                setDbDates(data.upcomingDates || []); // Set fetched dates
            } else {
                setDbDates([]); // Set empty if no dates are found
                console.warn("No upcoming delivery dates found.");
            }
        } catch (error) {
            console.error("Error fetching delivery schedule:", error);
            setDbDates([]); // Handle error
        }
    };
    // Handle district selection from dropdown
    const handleDistrictSelect = (e) => {
        const selectedDistrict = e.target.value;
        setSelectedDistrict(selectedDistrict);
        if (selectedDistrict) {
            fetchDeliveryDates(selectedDistrict); // Fetch dates for selected district
        }
    };
    // Handle Input Changes for delivery rates
    const handleRateChange = (e) => {
        const { name, value } = e.target;
        setDeliveryRates((prev) => ({ ...prev, [name]: value }));
    };
    // Handle Input Changes for district name
    const handleDistrictChange = (e) => {
        const { name, value } = e.target;
        setScheduledDates((prev) => ({ ...prev, [name]: value }));
    };
    // Handle Date Selection and Add to List
    const handleAddDate = () => {
        if (dateInput && !scheduledDates.dates.includes(dateInput)) {
            setScheduledDates((prev) => ({
                ...prev,
                dates: [...prev.dates, dateInput]
            }));
            setDateInput(""); // Reset input field
        }
    };
    // Remove Selected Date from List
    const handleRemoveDate = (dateToRemove) => {
        setScheduledDates((prev) => ({
            ...prev,
            dates: prev.dates.filter(date => date !== dateToRemove)
        }));
    };
    // Handle Form Submission for Delivery Rates
    const handleSubmitRate = async () => {
        if (!deliveryRates.District || !deliveryRates.rate) {
            alert("Please enter both District and Rate.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/delivery-rates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deliveryRates),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Delivery rate added successfully!")
                // Optionally, reset the form after submission
                setDeliveryRates({ District: "", rate: "" });
                await fetchDeliveryRates();
            } else {
                toast.error("Failed to add rate: " + data.message)
            }
        } catch (error) {
            console.error("Error adding delivery rate:", error);
            toast.success("An error occurred while adding the delivery rate.")
        }
    };
    // Handle Form Submission for Scheduled Dates
    const handleSubmitDates = async () => {
        if (!scheduledDates.District || scheduledDates.dates.length === 0) {
            alert("Please enter a district and at least one date.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/delivery-dates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(scheduledDates),
            });
            const data = await response.json();

            if (data.success) {
                toast.success("Delivery dates added successfully!")
                setScheduledDates({ District: "", dates: [] }); // Reset form after success
                await fetchDeliveryDates();
            } else {
                toast.error("Failed to add delivery dates: " + data.message)
            }
        } catch (error) {
            console.error("Error submitting delivery dates:", error);
            toast.error("Error submitting delivery dates. Please try again.")
        }
    };
    return (
        <Container className="add-item-container">
            <Row className="justify-content-center">
                <Col lg="6" className="d-flex flex-column gap-4">
                    {/* Add Delivery Rates Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Add Delivery Rates</Label>
                        <Input
                            type="text"
                            placeholder="Enter district name"
                            className="mb-2"
                            name="District" value={deliveryRates.District} onChange={handleRateChange}
                        />
                        <Input
                            type="number" placeholder="Enter district rate" className="mb-2" name="rate" value={deliveryRates.rate} onChange={handleRateChange}
                        />
                        <Button color="primary" onClick={handleSubmitRate}>Add Rate</Button>
                    </div>

                    {/* Add Delivery Scheduled Dates Section */}
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Add Delivery Scheduled Dates</Label>
                        <Input
                            type="text"
                            placeholder="Enter district name"
                            className="mb-2"
                            name="District"
                            value={scheduledDates.District}
                            onChange={handleDistrictChange}
                        />
                        {/*<Input*/}
                        {/*    type="select"*/}
                        {/*    className="mb-2"*/}
                        {/*    value={selectedDistrict}*/}
                        {/*    onChange={handleDistrictSelect}*/}
                        {/*>*/}
                        {/*    <option value="">Select District</option>*/}
                        {/*    {dbRates.map((rate, index) => (*/}
                        {/*        <option key={index} value={rate.District}>*/}
                        {/*            {rate.district}*/}
                        {/*        </option>*/}
                        {/*    ))}*/}
                        {/*</Input>*/}
                        <Row className="align-items-center">
                            <Col xs="8">
                                <Input
                                    type="date" className="mb-2" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                                />
                            </Col>
                            <Col xs="4">
                                <Button color="info" onClick={handleAddDate}>Add Date</Button>
                            </Col>
                        </Row>
                        {/* Display Selected Dates in a Table */}
                        {scheduledDates.dates.length > 0 && (
                            <Table bordered size="sm" className="mt-3 ">
                                <thead className="custom-table-header">
                                <tr>
                                    <th>#</th>
                                    <th>Selected Date</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {scheduledDates.dates.map((date, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{date}</td>
                                        <td>
                                            <Button color="danger" size="sm" onClick={() => handleRemoveDate(date)}>
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        )}

                        <Button color="success" className="mt-2" onClick={handleSubmitDates}>Submit Dates</Button>
                    </div>

                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Select District for Delivery Schedule</Label>

                        {/* Dropdown for Selecting District */}
                        <Input
                            type="select" className="mb-2" value={selectedDistrict} onChange={handleDistrictSelect}
                        >
                            <option value="">Select District</option>
                            {dbRates.map((rate, index) => (
                                <option key={index} value={rate.district}>
                                    {rate.district}
                                </option>
                            ))}
                        </Input>

                        {/* Table to display delivery dates for selected district */}
                        <Table bordered size="sm" className="mt-2">
                            <thead className="custom-table-header">
                            <tr>
                                <th>District</th>
                                <th>Upcoming Delivery Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dbDates.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center">No Data</td>
                                </tr>
                            ) : (
                                dbDates.map((date, index) => (
                                    <tr key={index}>
                                        <td>{selectedDistrict}</td>
                                        <td>{date}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Col>
                <Col lg="6" className="d-flex flex-column gap-4">
                    <div className="p-3 border rounded shadow-sm">
                        <Label className="fw-bold">Delivery Rates</Label>
                        {/* Table to display delivery rates from DB */}
                        <Table bordered size="sm" className="mt-2">
                            <thead className="custom-table-header">
                            <tr>
                                <th>District</th>
                                <th>Rate</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dbRates.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center">No Data</td>
                                </tr>
                            ) : (
                                dbRates.map((rate, index) => (
                                    <tr key={index}>
                                        <td>{rate.district}</td>
                                        <td>{rate.amount}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AddDeliverySchedule;

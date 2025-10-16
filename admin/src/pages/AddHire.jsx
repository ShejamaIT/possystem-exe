import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";
import "../style/addProduct.css";

const AddVehicle = () => {
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        title:"",FtName: "",SrName:"", phoneNumber: "", otherNumber: "", date: "", pickup: "", destination: "", distance: "", hire: "", driverId: "", vehicleID: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchDrivers();
        fetchVehicles();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const hireDate = {
                title: formData.title,
                FtName: formData.FtName,
                SrName:formData.SrName,
                phoneNumber: formData.phoneNumber,
                otherNumber: formData.otherNumber,
                date: formData.date,
                // bookingDate: formData.bookingDate,
                pickup: formData.pickup,
                destination: formData.destination,
                distance: formData.distance,
                hire: formData.hire,
                driverId: formData.driverId,
                vehicleID: formData.vehicleID,
            };
            const response = await fetch("http://localhost:5001/api/admin/main/other-hire", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(hireDate),
            });

            const textResponse = await response.text();
            const result = JSON.parse(textResponse);

            if (!response.ok) {
                throw new Error(result.message || "Failed to add hire.");
            }

            toast.success(result.message);
            handleClear();
        } catch (error) {
            console.error("Error submitting hire data:", error);
            toast.error(error.message);
        }
    };

    const handleClear = () => {
        setFormData({
            title: "",
            FtName: "",
            SrName: "",
            phoneNumber: "",
            otherNumber: "",
            date: "",
            bookingDate: "",
            pickup: "",
            destination: "",
            distance: "",
            hire: "",
            driverId: "",
            vehicleID: "",
        });
    };

    return (
        <Container className="add-item-container">
            <Row>
                <Col lg="8" className="mx-auto">
                    <h3 className="text-center">Add New Hire</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={4}>
                                <FormGroup className="mt-2">
                                    <Label for="type" className="fw-bold">Title</Label>
                                    <Input type="select" name="title" id="title" value={formData.title}
                                           onChange={handleChange} required>
                                        <option value="">Title</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Dr">Dr</option>
                                        <option value="Rev">Rev</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label className="fw-bold">First Name</Label>
                                    <Input type="text" name="FtName" value={formData.FtName} onChange={handleChange}
                                           required/>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label className="fw-bold">Last Name</Label>
                                    <Input type="text" name="SrName" value={formData.SrName} onChange={handleChange}
                                           required/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="phoneNumber">Phone Number</Label>
                                    <Input type="text" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="otherNumber">Other Number</Label>
                                    <Input type="text" name="otherNumber" id="otherNumber" value={formData.otherNumber} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="date">Hire Date</Label>
                            <Input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required />
                        </FormGroup>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="pickup">Pickup Location</Label>
                                    <Input type="text" name="pickup" id="pickup" value={formData.pickup} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="destination">Destination</Label>
                                    <Input type="text" name="destination" id="destination" value={formData.destination} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <Label for="distance">Distance (KM)</Label>
                            <Input type="text" name="distance" id="distance" value={formData.distance} onChange={handleChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="hire">Hire Amount (Rs)</Label>
                            <Input type="text" name="hire" id="hire" value={formData.hire} onChange={handleChange} />
                        </FormGroup>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="driverId">Select Driver</Label>
                                    <Input type="select" name="driverId" id="driverId" value={formData.driverId} onChange={handleChange} required>
                                        <option value="">-- Select Driver --</option>
                                        {drivers.map((driver) => (
                                            <option key={driver.devID} value={driver.devID}>
                                                {driver.devID} - {driver.employeeName || "No Name"}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="vehicleID">Select Vehicle</Label>
                                    <Input type="select" name="vehicleID" id="vehicleID" value={formData.vehicleID} onChange={handleChange} required>
                                        <option value="">-- Select Vehicle --</option>
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.id} - {vehicle.registration_no || "No Reg No"}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <Button type="submit" color="primary" block>
                                    Add Hire
                                </Button>
                            </Col>
                            <Col md="6">
                                <Button type="button" color="danger" block onClick={handleClear}>
                                    Clear
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AddVehicle;

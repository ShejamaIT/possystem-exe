import React, {useEffect, useState} from "react";
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col
} from "reactstrap";
import "../style/invoice.css";

const AddNewCoupone = ({ setShowModal1, handleSubmit2 }) => {
    const [couponCode, setCouponCode] = useState("");
    const [saleteamCode, setSaleteamCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [salesteamMembers, setSalesteamMembers] = useState([]);

    useEffect(() => {
        fetchSalesTeamMembers();
    }, []);
    const fetchSalesTeamMembers = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/salesteam");
            const data = await response.json();
            if (data.data) {
                setSalesteamMembers(data.data);
            }
        } catch (error) {
            console.error("Error fetching sales team members:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmit2({ couponCode, saleteamCode, discount });
        setShowModal1(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="invoice-title">Add New Coupon</h2>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Coupon Code</Label>
                        <Input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Sale Team ID</Label>
                        <Input
                            type="select"
                            value={saleteamCode}
                            onChange={(e) => setSaleteamCode(e.target.value)}
                            required
                        >
                            <option value="">Select Sale Team</option>
                            {salesteamMembers.map((member) => (
                                <option key={member.stID} value={member.stID}>
                                    {member.stID} - ({member.employeeName})
                                </option>
                            ))}
                        </Input>
                    </FormGroup>

                    <FormGroup>
                        <Label>Discount Price</Label>
                        <Input
                            type="text"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="Enter discount amount"
                            required
                        />
                    </FormGroup>

                    <Row>
                        <Col md="6">
                            <Button type="submit" color="primary" block>
                                Add Coupon
                            </Button>
                        </Col>
                        <Col md="6">
                            <Button
                                type="button"
                                color="danger"
                                block
                                onClick={() => setShowModal1(false)}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default AddNewCoupone;

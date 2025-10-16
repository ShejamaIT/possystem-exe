import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import "../style/invoice.css";

const AddNewAccountNumber = ({ setShowAccountNumber, handleSubmitAccountNumber }) => {
    const [accountNumber, setAccountNumber] = useState("");
    const [selectedBankId, setSelectedBankId] = useState("");
    const [Banks, setBanks] = useState([]);

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const fetchBankDetails = async () => {
        try {
            const banksResponse = await fetch("http://localhost:5001/api/admin/main/shop-banks");
            const banksData = await banksResponse.json();
            setBanks(banksData || []);
        } catch (error) {
            console.error("Error fetching bank details:", error);
            // Optionally toast or alert
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedBankId || !accountNumber) return;

        handleSubmitAccountNumber({
            sbID: parseInt(selectedBankId),
            number: accountNumber,
        });

        setShowAccountNumber(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="invoice-title">Add New Account Number</h2>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Select Bank</Label>
                        <select
                            className="form-control"
                            value={selectedBankId}
                            onChange={(e) => setSelectedBankId(e.target.value)}
                            required
                        >
                            <option value="">-- Select Bank --</option>
                            {Banks.map((bank) => (
                                <option key={bank.sbID} value={bank.sbID}>
                                    {bank.Bank} - {bank.branch}
                                </option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup>
                        <Label>Account Number</Label>
                        <Input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter Account Number"
                            required
                        />
                    </FormGroup>

                    <Row>
                        <Col md="6">
                            <Button type="submit" color="primary" block>
                                Add Account
                            </Button>
                        </Col>
                        <Col md="6">
                            <Button
                                type="button"
                                color="danger"
                                block
                                onClick={() => setShowAccountNumber(false)}
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

export default AddNewAccountNumber;

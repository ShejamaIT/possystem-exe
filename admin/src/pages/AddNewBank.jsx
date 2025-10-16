import React, {useEffect, useState} from "react";
import {  Form, FormGroup, Label, Input, Button, Row, Col} from "reactstrap";
import "../style/invoice.css";

const AddNewBank = ({ setShowBank, handleSubmitBank }) => {
    const [bank, setBank] = useState("");
    const [branch, setBranch] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitBank({ bank, branch });
        setShowBank(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="invoice-title">Add New Bank</h2>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Bank</Label>
                        <Input
                            type="text"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            placeholder="Enter Bank"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Branch</Label>
                        <Input
                            type="text"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            placeholder="Enter Branch"
                            required
                        />
                    </FormGroup>

                    <Row>
                        <Col md="6">
                            <Button type="submit" color="primary" block>
                                Add Bank
                            </Button>
                        </Col>
                        <Col md="6">
                            <Button
                                type="button"
                                color="danger"
                                block
                                onClick={() => setShowBank(false)}
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

export default AddNewBank;

import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Label, Row, Col } from "reactstrap";
import Swal from "sweetalert2";

const BankDetails = () => {
    const [banks, setBanks] = useState([]);
    const [bankForm, setBankForm] = useState({ bank: "", branch: "" });
    const [selectedBank, setSelectedBank] = useState(null);
    const [accountNumber, setAccountNumber] = useState("");

    const fetchBanks = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/account-numbers/grouped");
            const data = await res.json();
            setBanks(data || []);
        } catch (err) {
            console.error("Error fetching banks:", err);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const handleBankChange = (e) => {
        setBankForm({ ...bankForm, [e.target.name]: e.target.value });
    };

    const addBank = async () => {
        if (!bankForm.bank || !bankForm.branch) return Swal.fire("Error", "Bank and Branch are required", "error");
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/shop-banks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bankForm),
            });
            const result = await res.json();
            if (res.ok) {
                Swal.fire("Success", result.message, "success");
                setBankForm({ bank: "", branch: "" });
                fetchBanks();
            } else {
                Swal.fire("Error", result.error || "Failed to add bank", "error");
            }
        } catch (err) {
            console.error("Add bank error:", err);
        }
    };

    const addAccount = async (sbID) => {
        if (!accountNumber) return Swal.fire("Error", "Enter account number", "error");
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/account-numbers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sbID, number: accountNumber }),
            });
            const result = await res.json();
            if (res.ok) {
                Swal.fire("Success", result.message, "success");
                setAccountNumber("");
                fetchBanks();
            } else {
                Swal.fire("Error", result.error || "Failed to add account", "error");
            }
        } catch (err) {
            console.error("Add account error:", err);
        }
    };

    return (
        <div className="p-3">
            <h5>Manage Bank Details</h5>
            <Form className="mb-4">
                <Row>
                    <Col md={4}>
                        <Label>Bank</Label>
                        <Input
                            name="bank"
                            value={bankForm.bank}
                            onChange={handleBankChange}
                            placeholder="Bank name"
                        />
                    </Col>
                    <Col md={4}>
                        <Label>Branch</Label>
                        <Input
                            name="branch"
                            value={bankForm.branch}
                            onChange={handleBankChange}
                            placeholder="Branch name"
                        />
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                        <Button color="primary" onClick={addBank}>Add Bank</Button>
                    </Col>
                </Row>
            </Form>

            <Table bordered responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Bank</th>
                    <th>Branch</th>
                    <th>Account Numbers</th>
                    <th>Add Account</th>
                </tr>
                </thead>
                <tbody>
                {banks.length ? banks.map((b, i) => (
                    <tr key={b.sbID}>
                        <td>{i + 1}</td>
                        <td>{b.Bank}</td>
                        <td>{b.branch}</td>
                        <td>
                            {b.accountNumbers.length > 0 ? (
                                b.accountNumbers.map((acc, idx) => (
                                    <div key={acc.acnID}>{idx + 1}. {acc.number}</div>
                                ))
                            ) : (
                                <em>No accounts</em>
                            )}
                        </td>
                        <td>
                            <Input
                                placeholder="Add Account"
                                value={selectedBank === b.sbID ? accountNumber : ""}
                                onChange={(e) => {
                                    setSelectedBank(b.sbID);
                                    setAccountNumber(e.target.value);
                                }}
                            />
                            <Button
                                size="sm"
                                color="success"
                                className="mt-1"
                                onClick={() => addAccount(b.sbID)}
                            >
                                Add
                            </Button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="5" className="text-center">No banks found</td></tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default BankDetails;

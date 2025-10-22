import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Table,
    Form,
    Label,
    Input,
    FormGroup,
    Button,
} from "reactstrap";
import Helmet from "../../components/Helmet/Helmet";
import { toast } from "react-toastify";

const BankDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        optId: "",
        acnID: "",
        amount: "",
        remark: "",
    });

    const fetchAll = async () => {
        try {
            const [accountRes, transferRes] = await Promise.all([
                fetch("http://localhost:5001/api/admin/main/account-numbers/grouped"),
                fetch("http://localhost:5001/api/admin/main/bank-deposit-withdrawals"),
            ]);

            const accountData = await accountRes.json();
            const transferData = await transferRes.json();
            const flattenedAccounts = accountData.map(bank =>
                bank.accountNumbers.map(account => ({
                    acnID: account.acnID,
                    number: account.number,
                    bank: bank.Bank,
                    branch: bank.branch,
                }))
            ).flat();

            if (accountData) setAccounts(flattenedAccounts);

            if (transferData.success) {
                const allTransfers = transferData.transfers;
                setDeposits(allTransfers.filter(t => t.type === "Deposit"));
                setWithdrawals(allTransfers.filter(t => t.type === "Withdrawal"));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data.");
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { optId, acnID, amount, remark } = formData;

        if (!optId || !acnID || !amount) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5001/api/admin/main/deposit&withdrawals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ optId, acnID, amount, remark }),
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Transfer recorded.");
                setFormData({ optId: "", acnID: "", amount: "", remark: "" });
                fetchAll();
            } else {
                toast.error(result.message || "Failed to add transfer.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error. Try again later.");
        }
    };

    return (
        <Helmet title="Bank Deposits">
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h3 className="text-center">Bank Deposits & Withdrawals</h3>

                            {/* Form */}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md="3">
                                        <FormGroup>
                                            <Label for="optId">Sub Type</Label>
                                            <Input
                                                type="select"
                                                id="optId"
                                                value={formData.optId}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, optId: e.target.value })
                                                }
                                            >
                                                <option value="">-- Select SubType --</option>
                                                <option value="Deposit">Deposit</option>
                                                <option value="Withdrawal">Withdrawal</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>

                                    <Col md="3">
                                        <FormGroup>
                                            <Label for="acnID">Bank Account</Label>
                                            <Input
                                                type="select"
                                                id="acnID"
                                                value={formData.acnID}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, acnID: e.target.value })
                                                }
                                            >
                                                <option value="">-- Select Account --</option>
                                                {accounts.map((a) => (
                                                    <option key={a.acnID} value={a.acnID}>
                                                        {a.number} ({a.bank} - {a.branch})
                                                    </option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </Col>

                                    <Col md="3">
                                        <FormGroup>
                                            <Label for="amount">Amount</Label>
                                            <Input
                                                type="number"
                                                id="amount"
                                                value={formData.amount}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, amount: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md="3">
                                        <FormGroup>
                                            <Label for="remark">Remark</Label>
                                            <Input
                                                type="text"
                                                id="remark"
                                                value={formData.remark}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, remark: e.target.value })
                                                }
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md="6">
                                        <Button color="primary" block type="submit">
                                            Add Transfer
                                        </Button>
                                    </Col>
                                    <Col md="6">
                                        <Button
                                            color="danger"
                                            block
                                            type="button"
                                            onClick={() =>
                                                setFormData({ optId: "", acnID: "", amount: "", remark: "" })
                                            }
                                        >
                                            Clear
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>

                            <hr />

                            {/* Deposit History */}
                            <h5 className="mt-4">Deposit History</h5>
                            <Table bordered responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Bank</th>
                                    <th>Branch</th>
                                    <th>Account</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Remark</th>
                                </tr>
                                </thead>
                                <tbody>
                                {deposits.length > 0 ? (
                                    deposits.map((t, i) => (
                                        <tr key={t.id}>
                                            <td>{i + 1}</td>
                                            <td>{t.bank}</td>
                                            <td>{t.branch}</td>
                                            <td>{t.accountNumber}</td>
                                            <td>{t.amount}</td>
                                            <td>{t.dwdate}</td>
                                            <td>{t.remark}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No deposit records found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>

                            {/* Withdrawal History */}
                            <h5 className="mt-4">Withdrawal History</h5>
                            <Table bordered responsive>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Bank</th>
                                    <th>Branch</th>
                                    <th>Account</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Remark</th>
                                </tr>
                                </thead>
                                <tbody>
                                {withdrawals.length > 0 ? (
                                    withdrawals.map((t, i) => (
                                        <tr key={t.id}>
                                            <td>{i + 1}</td>
                                            <td>{t.bank}</td>
                                            <td>{t.branch}</td>
                                            <td>{t.accountNumber}</td>
                                            <td>{Math.abs(t.amount)}</td>
                                            <td>{t.dwdate}</td>
                                            <td>{t.remark}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No withdrawal records found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default BankDeposits;

import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";

const CashToday = () => {
    const [cashRecords, setCashRecords] = useState([]);

    const fetchCashToday = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/cash/today");
            const data = await res.json();

            if (data.success) {
                setCashRecords(data.data);
            } else {
                console.error("Failed to load cash records");
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchCashToday();
    }, []);

    // 🧮 Calculate Totals
    const totalIn = cashRecords
        .filter(r => r.amount > 0)
        .reduce((sum, r) => sum + r.amount, 0);

    const totalOut = cashRecords
        .filter(r => r.amount < 0)
        .reduce((sum, r) => sum + r.amount, 0);

    const cashInHand = totalIn + totalOut;

    return (
        <div className="p-3">
            <h5>Today's Cash Transactions</h5>
            <Table bordered responsive hover>
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Reason</th>
                        <th>Ref</th>
                        <th>Ref Type</th>
                        <th>Date & Time</th>
                        <th className="text-end">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {cashRecords.length > 0 ? (
                        cashRecords.map((record, index) => (
                            <tr key={record.Id}>
                                <td>{index + 1}</td>
                                <td>{record.reason || "-"}</td>
                                <td>{record.ref || "-"}</td>
                                <td>{record.ref_type}</td>
                                <td>{new Date(record.dateTime).toLocaleString()}</td>
                                <td className="text-end" style={{ color: record.amount < 0 ? "red" : "green" }}>
                                    {record.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No transactions for today.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Totals Section */}
            <div className="mt-3">
                <h6>Summary</h6>
                <Table bordered>
                    <tbody>
                        <tr>
                            <th>Total In</th>
                            <td className="text-success fw-bold text-end">{totalIn.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Total Out</th>
                            <td className="text-danger fw-bold text-end">{Math.abs(totalOut).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <th>Cash in Hand</th>
                            <td className={`fw-bold text-end ${cashInHand < 0 ? "text-danger" : "text-success"}`}>
                                {cashInHand.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default CashToday;

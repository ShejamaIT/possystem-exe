import React, { useRef } from "react";
import "../style/receiptView.css"; // Use same style for modal overlay/background

const PaySheetView = ({ formData, setShowPaySheet }) => {
    console.log(formData);
    const receiptRef = useRef(null);
    const currentDateTime = new Date().toLocaleString();

    const {
        id, name, month,job, basic = 0, attendance = 0, advance = 0, loan = 0, loanDate,
        leaveDeduction = 0, saving = 0, otherpay = 0,
        monthlyTargetBouns = 0, dailyTargetBouns = 0, monthlyDeptBalance = 0,
        inOrderBonus = 0, outOrderBonus = 0, highestSaleBonus = 0,
        total = 0
    } = formData;

    const printReceipt = () => {
        const styles = `
            @media print {
                body {
                    width: 80mm;
                    font-family: monospace;
                    font-size: 14px;
                    color: #000;
                }
                h3, h5 {
                    text-align: center;
                    margin: 4px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px dashed #000;
                    padding: 6px;
                    text-align: center;
                }
                hr {
                    border-top: 1px dashed #000;
                    margin: 4px 0;
                }
                .footer-note {
                    text-align: center;
                    margin-top: 10px;
                    font-size: 12px;
                }
            }
        `;

        const content = receiptRef.current.innerHTML;

        const printWindow = window.open("", "_blank", "width=1000,height=1000");
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Pay Sheet</title>
                        <style>${styles}</style>
                    </head>
                    <body onload="window.print(); window.close();">
                        ${content}
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="receipt-modal" ref={receiptRef}>
                    <h3 className="underline">Employee Pay Sheet</h3>
                    <h3>Shejama Group</h3>
                    <h5>No.75, Sri Premarathana Mw, Moratumulla</h5>
                    <h5>071 3 608 108 / 077 3 608 108</h5>
                    <hr />
                    <p><strong>Employee ID:</strong> {id}</p>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Job:</strong> {job}</p>
                    <p><strong>Date:</strong> {currentDateTime}</p>
                    <p><strong>Month:</strong> {month}</p>
                    <hr />

                    <table>
                        <tbody>
                            <tr><th>Basic Salary</th><td>Rs. {Number(basic).toFixed(2)}</td></tr>
                            <tr><th>Attendance Bonus</th><td>Rs. {Number(attendance).toFixed(2)}</td></tr>
                            <tr><th>Advance</th><td>- Rs. {Number(advance).toFixed(2)}</td></tr>
                            <tr><th>Loan</th><td>- Rs. {Number(loan).toFixed(2)}</td></tr>
                            {loanDate && <tr><th>Loan Date</th><td>{new Date(loanDate).toLocaleDateString()}</td></tr>}
                            <tr><th>Leave Deduction</th><td>- Rs. {Number(leaveDeduction).toFixed(2)}</td></tr>
                            <tr><th>Saving</th><td>- Rs. {Number(saving).toFixed(2)}</td></tr>
                            <tr><th>Other Pay</th><td>- Rs. {Number(otherpay).toFixed(2)}</td></tr>

                            {job === "Driver" && (
                                <>
                                    <tr><th>Monthly Target Bonus</th><td>Rs. {Number(monthlyTargetBouns).toFixed(2)}</td></tr>
                                    <tr><th>Daily Target Bonus</th><td>Rs. {Number(dailyTargetBouns).toFixed(2)}</td></tr>
                                    <tr><th>Dept Balance</th><td>- Rs. {Number(monthlyDeptBalance).toFixed(2)}</td></tr>
                                </>
                            )}

                            {job === "Sales" && (
                                <>
                                    <tr><th>In Order Bonus</th><td>Rs. {Number(inOrderBonus).toFixed(2)}</td></tr>
                                    <tr><th>Out Order Bonus</th><td>Rs. {Number(outOrderBonus).toFixed(2)}</td></tr>
                                    <tr><th>Top Sale Bonus</th><td>Rs. {Number(highestSaleBonus).toFixed(2)}</td></tr>
                                </>
                            )}

                            <tr className="table-success">
                                <th>Total</th>
                                <td><strong>Rs. {Number(total).toFixed(2)}</strong></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="footer-note">
                        <p>--- Shejama Group ---</p>
                    </div>
                </div>

                <div className="modal-buttons">
                    <button className="print-btn" onClick={printReceipt}>Print Pay Sheet</button>
                    <button className="close-btn" onClick={() => setShowPaySheet(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default PaySheetView;

import React, { useRef,useEffect } from "react";
import "../style/receiptView.css";
import { useState } from "react";

const PaymentReceiptView = ({ receiptData, setShowReceiptView }) => {
    console.log(receiptData);
    const currentDateTime = new Date().toLocaleString();
    const receiptRef = useRef(null);
    const fullInvoiceRef = useRef(null);
    const [empName, setEmpName] = useState('');
    const [chashier , setChashier] = useState('');
    const [payStatus , setPayStatus] = useState(receiptData.payStatus);

    useEffect(() => {
        const eid = localStorage.getItem('EID');
        setChashier(eid);
        const type = localStorage.getItem('type');
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/main/employees');
                const data = await response.json();
                if (data.success && Array.isArray(data.employees)) {
                    const currentEmp = data.employees.find(emp => emp.E_Id.toString() === eid);
                    if (currentEmp) setEmpName(currentEmp.name);
                }
            } catch (err) {
                console.error('Error fetching employees:', err);
            }
        };
        fetchEmployees();

    }, []);
    useEffect(() => {
        const balance1 = Number(receiptData.advance) - Number(receiptData.paymentAmount);
        if (balance1 === 0) {
            setPayStatus('Settled');
        }
    }, [receiptData]);

    const formatDateOnly = (dateString) => {
        if (dateString.includes("/") && dateString.split("/")[0].length === 2) {
            const [day, month, year] = dateString.split("/");
            return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
        }

        const date = new Date(dateString);
        if (!isNaN(date)) {
            return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
        }

        return "Invalid Date";
    };

    const formatDateTime = (dateInput) => {
        const date = new Date(dateInput);
        if (isNaN(date)) return "Invalid Date";

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour format

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };

    const getHeading = () => {
        const balance1 = Number(receiptData.total || 0) - Number(receiptData.paymentAmount || 0);
        return balance1 <= 0 ? "Cash Bill" : "Invoice";
    };

    const printContentInWindow = (content, styles, title = "Print") => {
        const printWindow = window.open('', '_blank', 'width=800,height=1000');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${title}</title>
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

    const printReceiptView = async() => {
       // Send request to the "update-invoice" API
        const response = await fetch("http://localhost:5001/api/admin/main/addReceipt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({repId:receiptData.recepitId, orID:receiptData.orID, repType:"Original", chashier:chashier, repstatus:"Payment"}),
        });

        //Handle the response
        const data = await response.json();
        if (response.ok) {
            const styles = `
                @media print {
                    body {
                        width: 80mm;
                        margin: 0;
                        font-family: monospace;
                        font-size: 15px;
                        color: #000;
                    }
                    h3, h5 {
                        text-align: center;
                        margin: 2px 0;
                        font-size: 17px;
                    }
                    h3.underline {
                        border-bottom: 1px solid #000;
                        padding-bottom: 3px;
                        margin-bottom: 6px;
                    }
                    p {
                        margin: 2px 0;
                        font-size: 15px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 8px;
                    }
                    th, td {
                        border: 1px dashed #000;
                        padding: 6px;
                        text-align: center;
                    }
                    .receipt-summary {
                        margin-top: 8px;
                        border-top: 1px dashed #000;
                        padding-top: 8px;
                    }
                    .receipt-summary p {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px !important;
                        margin: 2px 0 !important;
                    }
                    hr {
                        border: none;
                        border-top: 1px dashed #000;
                        margin: 6px 0;
                    }
                    .footer-note {
                        text-align: center;
                        margin-top: 10px;
                        font-size: 13px;
                    }
                }
            `;
            printContentInWindow(receiptRef.current.innerHTML, styles, `Receipt - ${receiptData.orID}`);
            
        }else {
            alert(data.error || "Failed to update invoice.");
        }
        
    };

    const printFullInvoice = () => {
        const styles = `
            @media print {
                body {
                    margin: 30px;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    color: #333;
                }
                h2 {
                    color: #007bff;
                    text-align: center;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 15px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #999;
                    padding: 8px;
                    text-align: left;
                }
                .totals {
                    margin-top: 15px;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                }
                .totals p {
                    display: flex;
                    justify-content: space-between;
                }
                .footer-note {
                    margin-top: 20px;
                    text-align: center;
                    font-style: italic;
                    color: #666;
                }
            }
        `;
        printContentInWindow(fullInvoiceRef.current.innerHTML, styles, `Invoice - ${receiptData.orID}`);
    };

    const renderBalanceLine = () => {
        const balance1 = Number(receiptData.total) - (Number(receiptData.paymentAmount) + Number(receiptData.advance));
        if (balance1 < 0) {
            return <p style={{ color: 'green' }}><strong>Advance/Credit:</strong> Rs. +{Math.abs(balance1).toFixed(2)}</p>;
        } else if (balance1 > 0) {
            return <p style={{ color: 'red' }}><strong>Balance Due:</strong> Rs. -{balance1.toFixed(2)}</p>;
        } else {
            return <p><strong>Balance:</strong> No</p>;
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Receipt View */}
                <div className="receipt-modal" ref={receiptRef} style={{ fontSize: "15px", fontFamily: "monospace" }}>
                    <h3 className="underline" style={{ fontSize: "19px" }}>{'Cash Recepit - Original'}</h3>
                    <h3 style={{ fontSize: "19px" }}>Shejama Group</h3>
                    <h5 style={{ fontSize: "15px" }}>No.75, Sri Premarathana Mw, Moratumulla</h5>
                    <h5 style={{ fontSize: "15px" }}>071 3 608 108 / 077 3 608 108</h5>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p><strong>Cashier:</strong> {empName}</p>
                        <p><strong>Receipt Number:</strong> {receiptData.recepitId || '-'}</p>
                    </div>
                    <hr/>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p><strong>Order ID:</strong> #{receiptData.orID}</p>
                        <p><strong>Bill Number:</strong> {receiptData.billNumber || '-'}</p>
                    </div>
                    <p><strong>Customer Name:</strong> {receiptData.customerName}</p>
                    <p><strong>Contact Numbers:</strong> {receiptData.contact1}{receiptData.contact2 ? ` / ${receiptData.contact2}` : ""}</p>
                    <p><strong>Address:</strong> {receiptData.address}</p>
                    <p><strong>Order Date:</strong> {formatDateOnly(receiptData.orderDate)}</p>
                    <p><strong>Print Date:</strong> {formatDateTime(new Date())}</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p><strong>Salesperson:</strong> {receiptData.salesperson}</p>
                        <p><strong>Delivery:</strong> {receiptData.delStatus}</p>
                        <p><strong>Payment:</strong> {payStatus}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Rate (Rs.)</th>
                                <th>Discount (Rs.)</th>
                                <th>Qty</th>
                                <th>Total (Rs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptData.items?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.itemName}</td>
                                    <td>{item.unitPrice.toFixed(2)}</td>
                                    <td>{item.discount.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.quantity * (item.unitPrice - item.discount)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="receipt-summary">
                        <p><span><strong>Gross Total:</strong></span><span>Rs. {receiptData.subtotal.toFixed(2)}</span></p>
                         <p><span><strong>Delivery Price:</strong></span><span>{receiptData.delPrice === 0 && receiptData.delStatus ==='Delivery'? "Free" : `Rs. ${receiptData.delPrice.toFixed(2)}`}</span></p>
                        <p><span><strong>Special Discount:</strong></span><span>Rs. {receiptData.specialdiscount.toFixed(2)}</span></p>
                        <p><span><strong>Coupone Discount:</strong></span><span>Rs. {receiptData.discount.toFixed(2)}</span></p>
                        <p><span><strong>Net Total:</strong></span><span>Rs. {receiptData.total.toFixed(2)}</span></p>
                        <p><strong>Previous Advance:</strong> Rs. {receiptData.advance.toFixed(2)}</p>
                        <p><strong>Payment Amount:</strong> Rs. {receiptData.paymentAmount.toFixed(2)}</p>
                        {renderBalanceLine()}
                    </div>
                    <div className="footer-note">
                        <p>Thank you for your business!</p>
                        <p>--- Shejama Group ---</p>
                    </div>
                </div>

                {/* Full Invoice */}
                <div ref={fullInvoiceRef} style={{ display: "none" }}>
                    <div className="invoice-header">
                        <h2>{getHeading()}</h2>
                        <p><strong>Shejama Group</strong><br />
                            No.75, Sri Premarathana Mw, Moratumulla<br />
                            071 3 608 108 / 077 3 608 108</p>
                        <p><strong>Order ID:</strong> #{receiptData.orID}</p>
                        <p><strong>Customer:</strong> {receiptData.customerName}</p>
                        <p><strong>Phone:</strong> {receiptData.contact1}{receiptData.contact2 ? ` / ${receiptData.contact2}` : ""}</p>
                        <p><strong>Address:</strong> {receiptData.address}</p>
                        <p><strong>Date:</strong> {formatDateOnly(receiptData.orderDate)}</p>
                        <p><strong>Salesperson:</strong> {receiptData.salesperson}</p>
                        <p><strong>Delivery:</strong> {receiptData.delStatus}</p>
                        <p><strong>Payment:</strong> {receiptData.payStatus}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Rate (Rs.)</th>
                                <th>Discount (Rs.)</th>
                                <th>Qty</th>
                                <th>Total (Rs.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptData.items?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.itemName}</td>
                                    <td>{item.unitPrice.toFixed(2)}</td>
                                    <td>{item.discount.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(item.quantity * (item.unitPrice - item.discount)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="totals">
                        <p><strong>Gross Total:</strong> Rs. {receiptData.subtotal.toFixed(2)}</p>
                        <p><strong>Delivery Price:</strong> {receiptData.delPrice === 0 && receiptData.delStatus ==='Delivery' ? "Free" : `Rs. ${receiptData.delPrice.toFixed(2)}`}</p>
                        <p><strong>Special Discount:</strong> Rs. {receiptData.discount.toFixed(2)}</p>
                        <p><strong>Net Total:</strong> Rs. {receiptData.total.toFixed(2)}</p>
                        <p><strong>Previous Advance:</strong> Rs. {receiptData.advance.toFixed(2)}</p>
                        <p><strong>Payment Amount:</strong> Rs. {receiptData.paymentAmount.toFixed(2)}</p>
                        {renderBalanceLine()}
                    </div>
                    <div>
                        <p><strong>Special Note:</strong> {receiptData.specialNote || '-'}</p>
                    </div>
                    <div className="footer-note">
                        <p>Thank you for your business!</p>
                        <p>--- Shejama Group ---</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="modal-buttons">
                    <button onClick={printReceiptView} className="print-btn">Print Receipt View</button>
                    <button onClick={printFullInvoice} className="print-btn">Print Full Invoice</button>
                    <button
                        onClick={() => {
                            setShowReceiptView(false);
                        }}
                        className="close-btn"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceiptView;

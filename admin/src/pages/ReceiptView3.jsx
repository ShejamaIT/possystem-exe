import React, { useRef, useEffect, useState } from "react";
import "../style/receiptView.css";
import { toast } from "react-toastify";

const RegenarateReceiptView = ({ receiptData, setShowReceiptView }) => {
    const receiptRef = useRef(null);
    const fullInvoiceRef = useRef(null);

    const [empName, setEmpName] = useState("");
    const [cashier, setCashier] = useState("");
    const [payStatus, setPayStatus] = useState(receiptData.payStatus);

    // 🔑 Admin modal state
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminContact, setAdminContact] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [pendingPrint, setPendingPrint] = useState(null); // "receipt" | "invoice"

    useEffect(() => {
        const eid = localStorage.getItem("EID");
        setCashier(eid);

        const fetchEmployees = async () => {
            try {
                const res = await fetch("http://localhost:5001/api/admin/main/employees");
                const data = await res.json();
                if (data.success && Array.isArray(data.employees)) {
                    const currentEmp = data.employees.find(emp => emp.E_Id.toString() === eid);
                    if (currentEmp) setEmpName(currentEmp.name);
                }
            } catch (err) {
                console.error("Error fetching employees:", err);
            }
        };
        fetchEmployees();
    }, []);

    // ✅ Shared print function
    const printContentInWindow = (content, styles, title = "Print") => {
        const printWindow = window.open("", "_blank", "width=800,height=1000");
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

    const renderBalanceLine = () => {
        const balance1 = Number(receiptData.total) - Number(receiptData.paymentAmount);
        console.log(balance1);
        if (balance1 < 0) {
            return <p style={{ color: 'green' }}><strong>Advance/Credit:</strong> Rs. +{Math.abs(balance1).toFixed(2)}</p>;
        } else if (balance1 > 0) {
            return <p style={{ color: 'red' }}><strong>Balance Due:</strong> Rs. -{balance1.toFixed(2)}</p>;
        } else {
            return <p><strong>Balance:</strong> No</p>;
        }
    };

    // 🔑 Check if original or reprint
    const handlePrintCheck = async (type) => {
        const checkUrl =
            type === "receipt"
                ? `http://localhost:5001/api/admin/main/checkReceipt/${receiptData.recepitId}`
                : `http://localhost:5001/api/admin/main/checkInvoice/${receiptData.invoiceId}`;

        try {
            const res = await fetch(checkUrl);
            const data = await res.json();

            if (data.alreadyPrinted) {
                // require admin login
                setPendingPrint(type);
                setShowAdminModal(true);
            } else {
                // first print, save normally
                if (type === "receipt") doPrintReceipt("Original");
                else doPrintInvoice("Original");
            }
        } catch (err) {
            console.error("Error checking print:", err);
            toast.error("Failed to check print status.");
        }
    };

    const doPrintReceipt = async (repType, adminId = null) => {
        if (repType === "Original") {
            // Save in recepitLog
            const response = await fetch("http://localhost:5001/api/admin/main/addReceipt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repId: receiptData.recepitId,
                    orID: receiptData.orID,
                    repType,
                    chashier:cashier,
                    repstatus: "Payment"
                }),
            });
            console.log(response);
            if (response.ok) {
                printContentInWindow(receiptRef.current.innerHTML, "", `Receipt - ${receiptData.orID}`);
            } else {
                alert("Failed to save receipt");
            }
        } else {
            // Save in repetLog
            const response = await fetch("http://localhost:5001/api/admin/main/addReprint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: receiptData.recepitId,
                    orID: receiptData.orID,
                    repType,
                    cashier:cashier,
                    admin: adminId
                }),
            });
            console.log(response);
            if (response.ok) {
                printContentInWindow(receiptRef.current.innerHTML, "", `Receipt Reprint - ${receiptData.orID}`);
            } else {
                alert("Failed to save receipt reprint");
            }
        }
    };

    const doPrintInvoice = async (repType, adminId = null) => {
        if (repType === "Original") {
            // Save in invoiceLog
            const response = await fetch("http://localhost:5001/api/admin/main/addInvoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invId: receiptData.invoiceId,
                    orID: receiptData.orID,
                    repType,
                    cashier:cashier,
                    status: "Payment"
                }),
            });
            console.log(response);
            if (response.ok) {
                printContentInWindow(fullInvoiceRef.current.innerHTML, "", `Invoice - ${receiptData.orID}`);
            } else {
                alert("Failed to save invoice");
            }
        } else {
            // Save in repetLog
            const response = await fetch("http://localhost:5001/api/admin/main/addReprint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: receiptData.invoiceId,
                    orID: receiptData.orID,
                    repType,
                    cashier:cashier,
                    admin: adminId
                }),
            });
            if (response.ok) {
                printContentInWindow(fullInvoiceRef.current.innerHTML, "", `Invoice Reprint - ${receiptData.orID}`);
            } else {
                alert("Failed to save invoice reprint");
            }
        }
    };

    // 🔑 Admin login for reprint
    const handleAdminLogin = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/admin-pass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contact: adminContact, password: adminPassword }),
            });
            const data = await res.json();

            if (data.success) {
                if (pendingPrint === "receipt") doPrintReceipt("Reprint", data.admin.id);
                if (pendingPrint === "invoice") doPrintInvoice("Reprint", data.admin.id);

                setShowAdminModal(false);
                setAdminContact("");
                setAdminPassword("");
            } else {
                toast.error("Invalid admin credentials");
            }
        } catch (err) {
            console.error(err);
            toast.error("Admin login failed");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* Receipt View */}
                <div className="receipt-modal" ref={receiptRef} style={{ fontSize: "15px", fontFamily: "monospace" }}>
                    <h3 className="underline" style={{ fontSize: "19px" }}>{getHeading()}</h3>
                    <h3 style={{ fontSize: "19px" }}>Shejama Group</h3>
                    <h5 style={{ fontSize: "17px" }}>No.75, Sri Premarathana Mw, Moratumulla</h5>
                    <h5 style={{ fontSize: "17px" }}>071 3 608 108 / 077 3 608 108</h5>
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
                         <p><span><strong>Delivery Price:</strong></span><span>{receiptData.delPrice === 0 && receiptData.delStatus ==='Delivery' ? "Free" : `Rs. ${receiptData.delPrice.toFixed(2)}`}</span></p>
                        <p><span><strong>Special Discount:</strong></span><span>Rs. {receiptData.specialdiscount.toFixed(2)}</span></p>
                        <p><span><strong>Coupone Discount:</strong></span><span>Rs. {receiptData.discount.toFixed(2)}</span></p>
                        <p><span><strong>Net Total:</strong></span><span>Rs. {receiptData.total.toFixed(2)}</span></p>
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
                <div className="modal-buttons">
                    <button onClick={() => handlePrintCheck("receipt")} className="print-btn">
                        Print Receipt
                    </button>
                    <button onClick={() => handlePrintCheck("invoice")} className="print-btn">
                        Print Invoice
                    </button>
                    <button onClick={() => setShowReceiptView(false)} className="close-btn">
                        Close
                    </button>
                </div>
            </div>

            {showAdminModal && (
                <div className="modal-overlay" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                    <div className="modal-container" style={{ 
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                            width: "350px"
                        }}>
                        <h3>Admin Authentication Required</h3>
                        <label>Admin Contact</label>
                        <input
                            type="text"
                            placeholder="Admin Contact"
                            value={adminContact}
                            onChange={(e) => setAdminContact(e.target.value)}
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleAdminLogin} className="print-btn">
                                Confirm
                            </button>
                            <button onClick={() => setShowAdminModal(false)} className="close-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegenarateReceiptView;






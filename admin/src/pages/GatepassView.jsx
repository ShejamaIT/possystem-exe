import React, { useRef } from "react";
import "../style/deliveryRecipt.css";

const GatePassView = ({ receiptData, setShowDeliveryView }) => {
    const { order, vehicleId } = receiptData;
    const receiptRef = useRef(null);
    const currentDateTime = new Date().toLocaleString();

    const printDeliveryNote = () => {
        if (!receiptRef.current) return;

        const printContent = receiptRef.current.innerHTML;
        const printWindow = window.open("", "_blank", "width=400,height=600");

        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
                <html>
                <head>
                    <title>Gate Pass - ${order.orderId}</title>
                    <style>
                        @media print {
                            body {
                                width: 80mm;
                                margin: 0;
                                font-family: monospace;
                                font-size: 15px;
                                color: #000;
                            }
                            h3 {
                                text-align: center;
                                margin: 4px 0;
                                font-size: 17px;
                                border-bottom: 1px solid #000;
                                padding-bottom: 4px;
                            }
                            p {
                                margin: 2px 0;
                                font-size: 15px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 8px;
                                font-size: 15px;
                            }
                            th {
                                background-color: #f0f0f0;
                            }
                            th, td {
                                border: 1px dashed #000;
                                padding: 6px;
                                text-align: center;
                            }
                            hr {
                                border: none;
                                border-top: 1px dashed #000;
                                margin: 6px 0;
                            }
                            .footer-note {
                                text-align: center;
                                font-size: 13px;
                                margin-top: 10px;
                            }
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    ${printContent}
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const handleClose = () => {
        setShowDeliveryView(false);
        
    };

    return (
        <div className="modal-overlay">
            <div className="receipt-modal" ref={receiptRef}>
                <h3>Shejama Group - Gate Pass</h3>
                <hr />

                <p><strong>Date & Time:</strong> {currentDateTime}</p>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.contact1}{order.contact2 ? ` / ${order.contact2}` : ""}</p>
                <p><strong>Vehicle ID:</strong> {vehicleId || "N/A"}</p>
                <hr />

                <table>
                    <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Stock ID</th>
                        <th>Batch ID</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(order.selectedItem) &&
                        order.selectedItem.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.I_Id}</td>
                                <td>{item.stock_Id}</td>
                                <td>{item.pc_Id}</td>
                                <td>Rs. {Number(item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <table>
                    <thead>
                    <tr>
                        <th>Address</th>
                        <th>Contact 1</th>
                        <th>Contact 2</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{order.address}</td>
                        <td>{order.contact1}</td>
                        <td>{order.contact2}</td>
                    </tr>
                    </tbody>
                </table>

                <hr />

                <div className="footer-note">
                    <p>Thank you for your business!</p>
                    <p>--- Shejama Group ---</p>
                </div>
            </div>

            <div className="modal-buttons no-print">
                <button onClick={printDeliveryNote} className="print-btn">Print</button>
                <button onClick={handleClose} className="close-btn">Close</button>
            </div>
        </div>
    );
};

export default GatePassView;

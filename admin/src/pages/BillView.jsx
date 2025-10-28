import React, { useRef, useState, useEffect, useMemo } from "react";
import "../style/receiptView.css";

const BillView = ({ receiptData, setShowReceiptView }) => {
  console.log(receiptData);
  const receiptRef = useRef(null);
  const fullInvoiceRef = useRef(null);
  const [empName, setEmpName] = useState('');
  const [cashier, setCashier] = useState('');
  const [payStatus, setPayStatus] = useState(receiptData.payStatus);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminContact, setAdminContact] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [pendingPrint, setPendingPrint] = useState(null);
  

  useEffect(() => {
    const eid = localStorage.getItem('EID');
    setCashier(eid);

    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/main/employees');
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

  const calculatedSubtotal = useMemo(() => {
    if (!receiptData.items?.length) return 0;
    return receiptData.items.reduce((sum, item) => {
      return sum + (item.sellprice) * item.quantity;
    }, 0);
  }, [receiptData.items]);

  const calculatedTotal = useMemo(() => {
    return calculatedSubtotal - (receiptData.discount || 0) - (receiptData.specialdiscount || 0) + (receiptData.delPrice || 0);
  }, [calculatedSubtotal, receiptData]);
  const CalculateBalance = useMemo(() => {
    return (receiptData.total || 0) - (receiptData.advance || 0);
  }, [receiptData]);

  const balance = useMemo(() => {
    return calculatedTotal - (receiptData.paymentAmount || receiptData.advance);
  }, [calculatedTotal, receiptData]);

  useEffect(() => {
    if (balance <= 0) setPayStatus("Settled");
  }, [balance]);

  const formatDateOnly = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getFullYear()}`;
  };
  const formatDateTime = (dateInput) => {
    const date = new Date(dateInput);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${date.getDate().toString().padStart(2,"0")}-${(date.getMonth()+1).toString().padStart(2,"0")}-${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
  };

  const getHeading = () => (balance <= 0 ? "Cash Bill" : "Invoice");

  const printContentInWindow = (content, styles, title) => {
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

  const doPrintReceipt = async (repType, adminId = null) => {
    if (repType === "Original") {
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
      if (response.ok) {
        printReceiptView();
      } else {
        alert("Failed to save receipt");
      }
    } else {
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
      if (response.ok) {
        printContentInWindow(receiptRef.current.innerHTML, "", `Receipt Reprint - ${receiptData.orID}`);
      } else {
        alert("Failed to save receipt reprint");
      }
    }
  };

  const doPrintInvoice = async (repType, adminId = null) => {
    if (repType === "Original") {
      const response = await fetch("http://localhost:5001/api/admin/main/addInvoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invId: receiptData.invoiceId,
          orID: receiptData.orID,
          repType,
          cashier,
          status: "Payment"
        }),
      });
      if (response.ok) {
        printFullInvoice();
      } else {
        alert("Failed to save invoice");
      }
    } else {
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

  const printReceiptView = () => {
    const styles = `
      @media print {
        body { width: 80mm; margin:0; font-family: monospace; font-size:14px; color:#000; }
        h2 { text-align:center; margin:4px 0; font-size:16px; }
        p { margin:2px 0; font-size:13px; }
        .receipt-summary { margin-top:8px; border-top:1px dashed #000; padding-top:8px; }
        .receipt-summary p { display:flex; justify-content:space-between; font-size:13px; margin:2px 0; }
      }
    `;

    const content = `
    <div style="text-align:center; margin-top:6px;">
      <h2>Shejama Homes</h2>
      <p style="font-style:italic">"From Birth to Wedding"</p>
      <p>75, Sri Premarathana Mawatha,<br/>Moratumulla, Moratuwa.</p>
      <p>Tel: 011 265 4444 / 011 265 3577 / 070 3 608 108 / 077 3 608 108</p>
    </div>

    <!-- small gap -->
    <div style="margin-top:10px;"></div>

    <!-- Receipt No + Cashier -->
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <p><strong>Receipt No:</strong> ${receiptData.recepitId || "-"}</p>
      <p><strong>Cashier:</strong> ${empName}</p>
    </div>

    <!-- Bill No + Order ID -->
    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
      <p><strong>Bill No:</strong> ${receiptData.billNumber || "-"}</p>
      <p><strong>Order ID:</strong> #${receiptData.orID}</p>
    </div>

    <!-- Customer Info -->
    <div style="margin-bottom:8px;">
      <p><strong>Customer:</strong> ${receiptData.customerName}</p>
      <p><strong>Contact:</strong> ${receiptData.contact1}${receiptData.contact2 ? ` / ${receiptData.contact2}` : ""}</p>
    </div>

    <!-- Summary -->
    <div class="receipt-summary">
      <p><span>Gross Total:</span><span>Rs. ${calculatedSubtotal.toFixed(2)}</span></p>
      <p><span>Delivery:</span><span>${receiptData.delPrice === 0 && receiptData.delStatus === 'Delivery' ? "Free" : `Rs. ${receiptData.delPrice.toFixed(2)}`}</span></p>
      <p><span>Special Discount:</span><span>Rs. ${receiptData.specialdiscount.toFixed(2)}</span></p>
      <p><span>Net Total:</span><span>Rs. ${calculatedTotal.toFixed(2)}</span></p>
      <p><span>Payment:</span><span>Rs. ${receiptData.advance.toFixed(2)}</span></p>
      <p><span>Balance:</span><span>Rs. ${balance.toFixed(2)}</span></p>
    </div>
  `;

  printContentInWindow(content, styles, `Receipt - ${receiptData.orID}`);
  };
  const printFullInvoice = () => {
    const styles = `
      @media print {
        @page {
          size: A4 landscape;
          margin: 3mm; /* Small margin so borders are visible */
        }

        * {
          text-shadow: none !important;
          -webkit-font-smoothing: none !important;
          -webkit-text-stroke: 0 !important;
          color: #000 !important;
          font-weight: normal !important;
        }

        body {
          width: 297mm;
          height: 210mm;
          margin: 0;
          padding: 0;
          font-family: "Arial", sans-serif;
          color: #000;
          display: flex;
          justify-content: flex-start; /* Align left side of page */
          align-items: flex-start;
          box-sizing: border-box;
        }

        .invoice-wrapper {
          width: 148mm;
          height: 200mm;
          padding: 4mm;
          box-sizing: border-box;
          border: 2px solid #000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-bottom: 10mm;          /* gap between invoices */
          page-break-inside: avoid;     /* don’t split an invoice */
        }

        h2 {
          color: #000;
          text-align: center;
          margin-bottom: 6px;
          font-size: 16px;
        }

        p {
          margin: 2px 0;
          font-size: 12px;
          line-height: 1.4;
        }

        .invoice-header {
          text-align: center;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #000;
        }

        .invoice-items {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
          font-size: 11px;
          flex-grow: 1;
        }

        .invoice-items th,
        .invoice-items td {
          border: 1px solid #444;
          padding: 4px;
          text-align: left;
          height: 18px;
        }

        .invoice-items th {
          background-color: #f0f0f0;
          text-align: center;
        }

        .totals {
          margin-top: 10px;
          padding-top: 5px;
          border-top: 2px solid #000;
          font-size: 12px;
        }

        .totals p {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
        }

        .sign-section {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 12px;
        }

        .footer-note {
          margin-top: 10px;
          text-align: center;
          font-style: italic;
          color: #555;
          font-size: 11px;
        }
      }
    `;
    const invoiceHTML = fullInvoiceRef.current.innerHTML;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${receiptData.orID}</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="invoice-wrapper">
            ${invoiceHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  const handlePrintCheck = async (type) => {
    const checkUrl = type === "receipt" 
      ? `http://localhost:5001/api/admin/main/checkReceipt/${receiptData.recepitId}`
      : `http://localhost:5001/api/admin/main/checkInvoice/${receiptData.invoiceId}`;

    const res = await fetch(checkUrl);
    const data = await res.json();

    if (data.alreadyPrinted) {
      setPendingPrint(type);
      setShowAdminModal(true);
    } else {
      if (type === "receipt") doPrintReceipt("Original");
      if (type === "invoice") doPrintInvoice("Original");
    }
  };

  const handleAdminLogin = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/admin/main/admin-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: adminContact, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        if (pendingPrint === "receipt") printReceiptView();
        if (pendingPrint === "invoice") printFullInvoice();
        setShowAdminModal(false);
        setAdminContact("");
        setAdminPassword("");
      } else alert("Invalid admin credentials");
    } catch (err) {
      console.error(err);
      alert("Admin login failed");
    }
  };

  const renderBalanceLine = () => {
    if (balance < 0) return <p><strong>Advance/Credit:</strong> Rs. +{Math.abs(balance).toFixed(2)}</p>;
    if (balance > 0) return <p><strong>Balance Due:</strong> Rs. -{balance.toFixed(2)}</p>;
    return <p><strong>Balance:</strong> No</p>;
  };

  return (
    <div className="modal-overlay">
      <div className="receipt-modal">

        {/* Receipt View */}
        <div ref={receiptRef}>
          <div style={{ textAlign: "center" }}>
            <h2>Shejama Homes</h2>
            <p style={{ fontStyle: "italic" }}>"From Birth to Wedding"</p>
            <p>75, Sri Premarathana Mawatha,<br/> Moratumulla, Moratuwa.</p>
            <p>Tel: 011 265 4444 / 011 265 3577 / 070 3 608 108 / 077 3 608 108</p>
            <p>Email: info.shejamahomes@gmail.com</p>
            <p>Facebook: FB/ShejamaHomes</p>
            
          </div>
          <div style={{ textAlign: "right" }}>
            <p> {formatDateTime(new Date())}</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ textAlign: "left" }}>
              <p><strong>Cashier:</strong>{empName}</p>
              <p><strong>Order ID:</strong>#{receiptData.orID}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p><strong>Receipt Number:</strong> {receiptData.recepitId || '-'}</p>
              <p><strong>Bill Number:</strong>{receiptData.billNumber || '-'}</p>
            </div>
          </div>
          
          <div style={{ display: "flex",justifyContent: "space-between",  alignItems: "flex-start" }}>
            <div style={{ textAlign: "left" }}>
              <p><strong>Customer:</strong> {receiptData.customerName}</p>
              <p><strong>Contact:</strong> {receiptData.contact1}{receiptData.contact2 ? ` / ${receiptData.contact2}` : ""}</p>
              <p><strong>Address:</strong> {receiptData.address}</p>
              <p><strong>Order Date:</strong> {formatDateOnly(receiptData.orderDate)}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Qty</th>
                <th>Item</th>
                {/* <th>Rate</th> */}
                {/* <th>Discount</th> */}
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.quantity}</td>
                  <td>{item.itemName}</td>
                  {/* <td>{item.unitPrice.toFixed(2)}</td> */}
                  {/* <td>{item.discount.toFixed(2)}</td> */}
                  <td>{item.sellprice.toFixed(2)}</td>
                  <td>{(item.quantity * (item.sellprice)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-summary">
            <p><strong>Gross Total:</strong> Rs. {calculatedSubtotal.toFixed(2)}</p>
            <p><strong>Delivery:</strong> {receiptData.delPrice === 0 && receiptData.delStatus === 'Delivery' ? "Free" : `Rs. ${receiptData.delPrice.toFixed(2)}`}</p>
            {/* <p><strong>Special Discount:</strong> Rs. {receiptData.specialdiscount.toFixed(2)}</p>
            <p><strong>Coupon Discount:</strong> Rs. {receiptData.couponediscount.toFixed(2)}</p> */}
            <p><strong>Net Total:</strong> Rs. {calculatedTotal.toFixed(2)}</p>
            <p><strong>Payment:</strong> Rs. {receiptData.advance.toFixed(2)}</p>
            {renderBalanceLine()}
          </div>
        </div>

        {/* Buttons */}
        <div className="modal-buttons">
          <button onClick={() => handlePrintCheck("receipt")} className="print-btn">Print Receipt</button>
          <button onClick={() => handlePrintCheck("invoice")} className="print-btn">Print Invoice</button>
          <button onClick={() => setShowReceiptView(false)} className="close-btn">Close</button>
        </div>

        {/* Admin Login Modal */}
        {showAdminModal && (
          <div className="modal-overlay">
            <div className="receipt-modal" style={{ width: 350, padding: 20 }}>
              <h3>Admin Authentication Required</h3>
              <input placeholder="Admin Contact" value={adminContact} onChange={e => setAdminContact(e.target.value)} />
              <input placeholder="Password" type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
              <div className="modal-buttons">
                <button onClick={handleAdminLogin} className="print-btn">Confirm</button>
                <button onClick={() => setShowAdminModal(false)} className="close-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Full Invoice (hidden) */}
        <div ref={fullInvoiceRef} style={{ display: "none" }}>
          <div className="invoice-header">
            <h2>Shejama Homes</h2>
            <p style={{ fontStyle: "italic" }}>"From Birth to Wedding"</p>
            <p>
              75, Sri Premarathana Mawatha, Moratumulla, Moratuwa.<br />
              Tel: 011 265 4444 / 011 265 3577 / 070 3 608 108 / 077 3 608 108 <br />
              Email: info.shejamahomes@gmail.com <br />
              Facebook: FB/ShejamaHomes
            </p>
          </div>
          <table
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "12px",
              lineHeight: "1.4",
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <tbody>
              {/* Row 1 */}
              <tr>
                <td style={{ textAlign: "left", width: "50px", paddingRight: "5px" }}>Name</td>
                <td style={{ width: "300px" }}>
                  <span>:</span>
                  <span style={{ marginLeft: "6px" }}>{receiptData.customerName}</span>
                </td>
                <td style={{ textAlign: "left", width: "50px", paddingRight: "5px" }}>Date</td>
                <td style={{ width: "120px" }}>
                  <span>:</span>
                  <span style={{ marginLeft: "6px" }}>{formatDateOnly(receiptData.orderDate)}</span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td style={{ textAlign: "left", paddingRight: "5px" }}>Address</td>
                <td>
                  <span>:</span>
                  <span style={{ marginLeft: "6px" }}>{receiptData.address}</span>
                </td>
                <td style={{ textAlign: "left", paddingRight: "5px" }}>Bill No</td>
                <td>
                  <span>:</span>
                  <span style={{ marginLeft: "6px" }}>{receiptData.billNumber || "-"}</span>
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td style={{ textAlign: "left", paddingRight: "5px" }}>Tel</td>
                <td>
                  <span>:</span>
                  <span style={{ marginLeft: "6px" }}>
                    {receiptData.contact1}
                    {receiptData.contact2 ? ` / ${receiptData.contact2}` : ""}
                  </span>
                </td>
                <td style={{ textAlign: "left", paddingRight: "5px" }}>Order ID</td>
                <td>
                  <span>:</span>
                  <span style={{ marginLeft: "6px" }}>#{receiptData.orID}</span>
                </td>
              </tr>
            </tbody>
          </table>


          {/* Items Table with fixed 15 rows and index column */}
          <table className="invoice-items">
            <thead>
              <tr>
                <th style={{ width: "5%", textAlign: "center" }}>#</th>
                <th style={{ width: "45%" }}>Description</th>
                <th style={{ width: "8%", textAlign: "center" }}>Qty</th>
                <th style={{ width: "20%", textAlign: "center" }}>Rate (Rs.)</th>
                <th style={{ width: "22%", textAlign: "right" }}>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...receiptData.items,
                ...Array.from({ length: Math.max(0, 15 - receiptData.items.length) }, () => ({}))
              ].map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>
                    {item.itemName ? index + 1 : ""}
                  </td>
                  <td>{item.itemName || ""}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity || ""}</td>
                  <td style={{ textAlign: "center" }}>
                    {item.sellprice ? item.sellprice.toFixed(2) : ""}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {item.quantity && item.sellprice
                      ? (item.quantity * item.sellprice).toFixed(2)
                      : ""}
                  </td>
                </tr>
              ))}

              {/* Totals section */}
              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ textAlign: "right" }}><strong>Delivery</strong></td>
                <td style={{ textAlign: "right" }}>{(receiptData.delPrice || 0).toFixed(2)}</td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ textAlign: "right" }}><strong>Total</strong></td>
                <td style={{ textAlign: "right" }}>{(receiptData.total || 0).toFixed(2)}</td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ textAlign: "right" }}><strong>Advance</strong></td>
                <td style={{ textAlign: "right" }}>{(receiptData.advance || 0).toFixed(2)}</td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ textAlign: "right" }}><strong>Balance</strong></td>
                <td style={{ textAlign: "right" }}>{CalculateBalance.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>


          {/* Footer stays near bottom */}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>Sale by   : {receiptData.salesperson}</p>
              <p>Issued by : {empName}</p>
            </div>
            
            <p>
              I certify that the goods were received in good condition.<br />
              Please turnover for more details. Cash not refundable.
            </p>
          </div>

          <div className="sign-section">
            <p>
              <strong>Vehicle No :</strong> {receiptData.vehicleNo || "_____________"}
            </p>
            <p>
              <strong>Customer Sign :</strong>
              <span
                style={{
                  display: "inline-block",
                  borderBottom: "1px dotted #000",
                  width: "200px", // increased width
                  marginLeft: "8px",
                }}
              ></span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BillView;

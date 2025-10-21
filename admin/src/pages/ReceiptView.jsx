import React, { useRef, useState, useEffect, useMemo } from "react";
import "../style/receiptView.css";

const ReceiptView = ({ receiptData, setShowReceiptView }) => {
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
      return sum + (item.unitPrice - (item.discount || 0)) * item.quantity;
    }, 0);
  }, [receiptData.items]);

  const calculatedTotal = useMemo(() => {
    return calculatedSubtotal - (receiptData.discount || 0) - (receiptData.specialdiscount || 0) + (receiptData.delPrice || 0);
  }, [calculatedSubtotal, receiptData]);

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
          size: A5 portrait; /* Half of A4 in portrait */
          margin: 10mm;
        }

        body {
          width: 148mm;
          height: 210mm;
          margin: 0 auto;
          padding-top: 8mm; /* ✅ Prevent top cutoff */
          padding-bottom: 6mm;
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #333;
        }

        h2 {
          color: #000;
          text-align: center;
          margin-bottom: 5px;
          font-size: 16px;
        }

        p { 
          margin: 2px 0; 
          font-size: 12px; 
        }

        .invoice-header { 
          text-align: center; 
          margin-bottom: 10px; 
          margin-top: 10px; 
        }

        /* Borderless info section */
        .invoice-info table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 12px;
        }

        .invoice-info td {
          border: none;
          vertical-align: top;
          padding: 2px 0;
        }

        /* ✅ Items table with borders */
        .invoice-items {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 12px;
        }

        .invoice-items th,
        .invoice-items td {
          border: 1px solid #999;
          padding: 4px;
          text-align: left;
        }

        .invoice-items th {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        .totals {
          margin-top: 10px;
          border-top: 1px solid #ccc;
          padding-top: 8px;
          font-size: 12px;
        }

        .totals p {
          display: flex;
          justify-content: space-between;
        }

        .footer-note {
          margin-top: 15px;
          text-align: center;
          font-style: italic;
          color: #666;
          font-size: 11px;
        }
      }
    `;

    // ✅ Apply styles to print window
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${receiptData.orID}</title>
          <style>${styles}</style>
        </head>
        <body>
          ${fullInvoiceRef.current.innerHTML}
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
                <th>Rate</th>
                <th>Discount</th>
                <th>Sell Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.quantity}</td>
                  <td>{item.itemName}</td>
                  <td>{item.unitPrice.toFixed(2)}</td>
                  <td>{item.discount.toFixed(2)}</td>
                  <td>{(item.unitPrice - item.discount).toFixed(2)}</td>
                  <td>{(item.quantity * (item.unitPrice - item.discount)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-summary">
            <p><strong>Gross Total:</strong> Rs. {calculatedSubtotal.toFixed(2)}</p>
            <p><strong>Delivery:</strong> {receiptData.delPrice === 0 && receiptData.delStatus === 'Delivery' ? "Free" : `Rs. ${receiptData.delPrice.toFixed(2)}`}</p>
            <p><strong>Special Discount:</strong> Rs. {receiptData.specialdiscount.toFixed(2)}</p>
            <p><strong>Coupon Discount:</strong> Rs. {receiptData.couponediscount.toFixed(2)}</p>
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
          <div className="invoice-header" style={{ textAlign: "center" }}>
            <h2>Shejama Homes</h2>
            <p style={{ fontStyle: "italic" }}>"From Birth to Wedding"</p>
            <p>
              75, Sri Premarathana Mawatha, Moratumulla, Moratuwa.<br />
              Tel: 011 265 4444 / 011 265 3577 / 070 3 608 108 / 077 3 608 108 <br />
              Email: info.shejamahomes@gmail.com <br />
              Facebook: FB/ShejamaHomes
            </p>
          </div>

          {/* Customer left start - Date right start */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
            <div style={{ textAlign: "left" }}>
              <p><strong>Name :</strong> {receiptData.customerName}</p>
              <p><strong>Address :</strong> {receiptData.address}</p>
              <p><strong>Tel :</strong> {receiptData.contact1}{receiptData.contact2 ? ` / ${receiptData.contact2}` : ""}</p>
            </div>
            <div style={{ textAlign: "right" ,alignItems: "flex-start"}}>
              <p><strong>Date :</strong> {formatDateOnly(receiptData.orderDate)}</p>
              <p><strong>Bill No :</strong> {receiptData.billNumber || "-"}</p>
              <p><strong>Order ID:</strong> #{receiptData.orID}</p>
            </div>
          </div>

          {/* Items + Totals */}
          <table className="invoice-items">
            <thead>
              <tr>
                <th>Qty</th>
                <th>Description</th>
                <th>Rate (Rs.)</th>
                <th>Discount (Rs.)</th>
                <th>Sell price (Rs.)</th>
                <th>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontSize: "10px" }}>{item.quantity}</td>
                  <td style={{ fontSize: "10px" }}>{item.itemName}</td>
                  <td style={{ fontSize: "10px" , textAlign: "center"}}>{item.unitPrice.toFixed(2)}</td>
                  <td style={{ fontSize: "10px" , textAlign: "center"}}>{item.discount.toFixed(2)}</td>
                  <td style={{ fontSize: "10px" , textAlign: "center"}}>{(item.unitPrice-item.discount).toFixed(2)}</td>
                  <td style={{ fontSize: "10px", textAlign: "right"}}>{(item.quantity * (item.unitPrice - item.discount)).toFixed(2)}</td>
                </tr>
              ))}

              {/* Totals section: border only for col 4 and 5 */}
              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  <strong>Gross Total</strong>
                </td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  {(receiptData.subtotal || 0).toFixed(2)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  <strong>Delivery Price</strong>
                </td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  {(receiptData.delPrice || 0).toFixed(2)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  <strong>Special Discount</strong>
                </td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  {(receiptData.specialdiscount || 0).toFixed(2)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  <strong>Coupon Discount</strong>
                </td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  {(receiptData.couponediscount || 0).toFixed(2)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  <strong>Net Total</strong>
                </td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  {(receiptData.total || 0).toFixed(2)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  <strong>Payment</strong>
                </td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  {(receiptData.advance || 0).toFixed(2)}
                </td>
              </tr>

              <tr>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "none" }}></td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  <strong>Balance</strong>
                </td>
                <td style={{ border: "1px solid #999", textAlign: "right", fontSize: "10px" }}>
                  {(receiptData.balance || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>

          </table>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <p><strong>Sale by :</strong> {receiptData.salesperson}</p>
            <p>I certify that the goods were received<br/>
               in good condition.Please turnover for <br/>more details. Cash not refundable.</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
            <p><strong>Vehicle No :</strong> {receiptData.vehicleNo || "_____________"}</p>
            <p><strong>Issued by :</strong> {empName}</p>
            <p><strong>Customer Sign :</strong>_____________</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;

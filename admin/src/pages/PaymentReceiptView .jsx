import React, { useRef, useEffect } from "react";
import "../style/receiptView.css";

const PaymentReceiptView = ({ receiptData, setShowReceiptView }) => {
    console.log(receiptData);
  const receiptRef = useRef(null);
  const currentDateTime = new Date().toLocaleString();

  const { orders = [], paymentMethod = {}, customerData = {} } = receiptData;
  const {
    customerName,
    contact1,
    contact2,
    address,
  } = customerData;

  const {
    method,
    submethod,
    fullTotal = 0,
    balance = 0,
    cashAmount = 0,
    cardAmount = 0,
    interstValue = 0,
    TransferpaymentAmount = 0,
    CashpaymentAmount = 0,
    bank = "",
    cheques = [],
  } = paymentMethod;

  const printReceipt = () => {
    const styles = `
      @media print {
        body {
          width: 80mm;
          font-family: monospace;
          font-size: 15px;
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
        .receipt-summary {
          border-top: 1px dashed #000;
          margin-top: 8px;
          padding-top: 8px;
        }
        hr {
          border-top: 1px dashed #000;
        }
        .footer-note {
          text-align: center;
          margin-top: 10px;
        }
      }
    `;

    const content = receiptRef.current.innerHTML;

    const printWindow = window.open("", "_blank", "width=800,height=1000");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt</title>
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
          <h3 className="underline">Payment Receipt</h3>
          <h3>Shejama Group</h3>
          <h5>No.75, Sri Premarathana Mw, Moratumulla</h5>
          <h5>071 3 608 108 / 077 3 608 108</h5>
          <hr />
          <p><strong>Customer Name:</strong> {customerName || "-"}</p>
          <p><strong>Contact:</strong> {contact1}{contact2 ? ` / ${contact2}` : ""}</p>
          <p><strong>Address:</strong> {address || "-"}</p>
          <p><strong>Date:</strong> {currentDateTime}</p>
          <hr />

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total (Rs.)</th>
                <th>Advance (Rs.)</th>
                <th>Outstanding Balance (Rs.)</th>
                <th>Current Payment (Rs.)</th>
                <th>Balance (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, index) => (
                <tr key={index}>
                  <td>{o.orderId}</td>
                  <td>{Number(o.billTotal).toFixed(2)}</td>
                  <td>{Number(o.advance).toFixed(2)}</td>
                  <td>{Number(o.balance).toFixed(2)}</td>
                  <td>{Number(o.payAmount).toFixed(2)}</td>
                  <td>{(Number(o.balance).toFixed(2)-Number(o.payAmount).toFixed(2))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-summary">
            <p><strong>Payment Method:</strong> {method}{submethod && submethod !== method ? ` - ${submethod}` : ""}</p>

            {method === "Cash" && submethod === "Cash" && (
                <p><strong>Cash Paid:</strong> Rs. {Number(CashpaymentAmount).toFixed(2)}</p>
            )}

            {method === "Cash" && submethod === "Transfer" && (
                <p><strong>Bank Transfer:</strong> Rs. {Number(TransferpaymentAmount).toFixed(2)}</p>
            )}

            {method === "Card" && (
            <>
                <p><strong>Card Paid:</strong> Rs. {Number(cardAmount).toFixed(2)}</p>
                {interstValue > 0 && (
                <p><strong>Card Interest:</strong> {interstValue}%</p>
                )}
            </>
            )}

            {method === "Cheque" && cheques.length > 0 && (
            <>
                <p><strong>Cheque Count:</strong> {cheques.length}</p>
                {cheques.map((chq, idx) => (
                <p key={idx}>
                    Cheque {idx + 1}: Rs. {Number(chq.amount).toFixed(2)} / {chq.bank}, {chq.chequeNumber}
                </p>
                ))}
            </>
            )}

            {method === "Combined" && submethod === "Cash & Transfer" && (
            <>
                <p><strong>Cash Paid:</strong> Rs. {Number(paymentMethod.cashPart).toFixed(2)}</p>
                <p><strong>Transfer Paid:</strong> Rs. {Number(paymentMethod.trasferPart).toFixed(2)}</p>
                <p><strong>Bank:</strong> {bank}</p>
            </>
            )}

            {method === "Combined" && submethod === "Cash & Card" && (
            <>
                <p><strong>Cash Paid:</strong> Rs. {Number(cashAmount).toFixed(2)}</p>
                <p><strong>Card Paid:</strong> Rs. {Number(cardAmount).toFixed(2)}</p>
                {interstValue > 0 && (
                <p><strong>Card Interest:</strong> {interstValue}%</p>
                )}
            </>
            )}

            {method === "Combined" && submethod === "Cash & Cheque" && (
            <>
                <p><strong>Cash Paid:</strong> Rs. {Number(cashAmount).toFixed(2)}</p>
                <p><strong>Cheque Count:</strong> {cheques.length}</p>
                {cheques.map((chq, idx) => (
                <p key={idx}>
                    Cheque {idx + 1}: Rs. {Number(chq.amount).toFixed(2)} / {chq.bank}, {chq.chequeNumber}
                </p>
                ))}
            </>
            )}

            <p><strong>Total Paid:</strong> Rs. {Number(fullTotal).toFixed(2)}</p>
            <p><strong>Remaining Balance:</strong> Rs. {Number(balance).toFixed(2)}</p>

          </div>

          <div className="footer-note">
            <p>Thank you for your payment!</p>
            <p>--- Shejama Group ---</p>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="print-btn" onClick={printReceipt}>Print Receipt</button>
          <button
            className="close-btn"
            onClick={() => {
              setShowReceiptView(false);
              window.location.reload();
            }}
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptView;

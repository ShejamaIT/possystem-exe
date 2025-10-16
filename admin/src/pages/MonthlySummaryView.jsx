import React, { useEffect, useState, useRef } from "react";
import { Button } from "reactstrap";

const MonthlySummaryView = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const printRef = useRef();
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/admin/main/month-summary");
        const data = await response.json();
        console.log("API Response:", data);

        if (data.success) {
          const s = data.summary || {};

          setSummary({
            // Orders totals
            walkInIn: s.orders?.in?.walking || 0,
            onlineIn: s.orders?.in?.online || 0,
            walkInOut: s.orders?.out?.walking || 0,
            onlineOut: s.orders?.out?.online || 0,

            // Hire total
            hireTotal: s.hire || 0,

            // Materials
            furnitureSale: s.materials?.Furniture || 0,
            mmSale: s.materials?.MM || 0,
            mdfSale: s.materials?.MDF || 0,
            mattressSale: s.materials?.Mattress || 0,

            // Sales team performance (with breakdown)
            salesTeam: (s.salesTeam || []).map(member => ({
              name: member.employeeName,
              inWalking: member.in?.walking || 0,
              inOnline: member.in?.onsite || 0,   // API returns "onsite" for online
              outWalking: member.out?.walking || 0,
              outOnline: member.out?.onsite || 0
            }))
          });

          setDate(data.period || "N/A");
        } else {
          setSummary({});
          setDate("N/A");
        }
      } catch (error) {
        console.error("Error fetching monthly summary:", error);
        setSummary({});
        setDate("N/A");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatCurrency = (val) =>
    `Rs. ${parseFloat(val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");
    win.document.write(`
      <html>
        <head>
          <title>Monthly Summary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 10px; }
            p { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Monthly Summary</h1>
          <p>Month: ${date}</p>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-center">Monthly Summary</h1>
      <p className="mb-6 text-center">Month: {date}</p>

      <div ref={printRef} className="space-y-6">
        {/* Orders Summary */}
        <table>
          <thead>
            <tr>
              <th colSpan="2">Orders (Net Totals)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Walking In Orders</td>
              <td>{formatCurrency(summary.walkInIn)}</td>
            </tr>
            <tr>
              <td>Total Online In Orders</td>
              <td>{formatCurrency(summary.onlineIn)}</td>
            </tr>
            <tr>
              <td>Total Walking Out Orders</td>
              <td>{formatCurrency(summary.walkInOut)}</td>
            </tr>
            <tr>
              <td>Total Online Out Orders</td>
              <td>{formatCurrency(summary.onlineOut)}</td>
            </tr>
          </tbody>
        </table>

        {/* Monthly Hire */}
        <table>
          <thead>
            <tr>
              <th>Monthly Hire</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Hire</td>
              <td>{formatCurrency(summary.hireTotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Sales by Category */}
        <table>
          <thead>
            <tr>
              <th colSpan="2">Sales by Item Category</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Furniture Sale</td>
              <td>{formatCurrency(summary.furnitureSale)}</td>
            </tr>
            <tr>
              <td>MM Sale</td>
              <td>{formatCurrency(summary.mmSale)}</td>
            </tr>
            <tr>
              <td>MDF Sale</td>
              <td>{formatCurrency(summary.mdfSale)}</td>
            </tr>
            <tr>
              <td>Mattress Sale</td>
              <td>{formatCurrency(summary.mattressSale)}</td>
            </tr>
          </tbody>
        </table>

        {/* Sales Team Performance */}
        <table>
          <thead>
            <tr>
              <th>Sales Team Member</th>
              <th>In Walking</th>
              <th>In Online</th>
              <th>Out Walking</th>
              <th>Out Online</th>
            </tr>
          </thead>
          <tbody>
            {summary.salesTeam.length > 0 ? (
              summary.salesTeam.map((member, idx) => (
                <tr key={idx}>
                  <td>{member.name}</td>
                  <td>{formatCurrency(member.inWalking)}</td>
                  <td>{formatCurrency(member.inOnline)}</td>
                  <td>{formatCurrency(member.outWalking)}</td>
                  <td>{formatCurrency(member.outOnline)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No sales data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Print Button */}
      <div className="flex justify-center mt-6">
        <Button onClick={handlePrint} color="primary">Print Summary</Button>
      </div>
    </div>
  );
};

export default MonthlySummaryView;

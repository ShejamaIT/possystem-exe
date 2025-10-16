import React, { useEffect, useState, useRef } from "react";
import { Button, Input, Label } from "reactstrap";

const DailyItemSummaryView = () => {
  const [inItems, setInItems] = useState([]);
  const [outItems, setOutItems] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const printRef = useRef();

  // Fetch daily summary
  const fetchSummary = async (date) => {
    if (!date) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/main/today-item-summary/${date}`
      );
      const data = await response.json();

      if (data.success) {
        setInItems(data.inItems || []);
        setOutItems(data.outItems || []);
        setReturnItems(data.returnItems || []);
      } else {
        setInItems([]);
        setOutItems([]);
        setReturnItems([]);
      }
    } catch (error) {
      console.error("Error fetching daily summary:", error);
      setInItems([]);
      setOutItems([]);
      setReturnItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Print handler
  const handlePrint = () => {
    if (!selectedDate) {
      alert("Please select a date before printing!");
      return;
    }

    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=1000,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Daily Item Summary</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 15px; 
              font-size: 11px;
            }
            h1 { text-align: center; margin-bottom: 6px; font-size: 16px; }
            p { text-align: center; margin-bottom: 12px; font-size: 12px; }
            .grid { display: flex; gap: 10px; justify-content: space-between; }
            .grid > div { flex: 1; min-width: 0; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 4px; 
              text-align: left; 
            }
            th { 
              background: #f0f0f0; 
              font-weight: bold; 
              text-align: center;
            }
            td { 
              text-align: center;
            }
            @media print {
              body { margin: 0; }
              table { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Daily Item Summary</h1>
          <p>Date: ${selectedDate}</p>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-center">Daily Item Summary</h1>

      {/* Date Picker */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-2">
          <Label for="summaryDate" className="font-medium">
            Select Date:
          </Label>
          <Input
            id="summaryDate"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const selected = e.target.value;
              setSelectedDate(selected);
              fetchSummary(selected);
            }}
            style={{ width: "200px" }}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading summary...</p>
      ) : (
        <>
          <div ref={printRef}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* In Items */}
              <div>
                <h2 className="text-base font-semibold mb-2 text-center">In Items</h2>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>In Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inItems.length > 0 ? (
                      inItems.map((item) => (
                        <tr key={item.I_Id}>
                          <td>{item.I_Id}</td>
                          <td>{item.I_name}</td>
                          <td>{item.inCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500">
                          No in items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Out Items */}
              <div>
                <h2 className="text-base font-semibold mb-2 text-center">Out Items</h2>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Out Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outItems.length > 0 ? (
                      outItems.map((item) => (
                        <tr key={item.I_Id}>
                          <td>{item.I_Id}</td>
                          <td>{item.I_name}</td>
                          <td>{item.outCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500">
                          No out items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Return Items */}
              <div>
                <h2 className="text-base font-semibold mb-2 text-center">Return Items</h2>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Return Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnItems.length > 0 ? (
                      returnItems.map((item) => (
                        <tr key={item.I_Id}>
                          <td>{item.I_Id}</td>
                          <td>{item.I_name}</td>
                          <td>{item.returnCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-gray-500">
                          No return items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-center mt-4">
            <Button onClick={handlePrint} color="primary" disabled={!selectedDate}>
              Print Summary
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyItemSummaryView;

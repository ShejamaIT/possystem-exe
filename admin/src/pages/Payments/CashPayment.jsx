import React, { useState } from "react";
import { toast } from "react-toastify";

const CashBalanceInput = () => {
  const [formData, setFormData] = useState({
    reason: "",
    ref: "",
    ref_type: "other",
    dateTime: new Date().toISOString().slice(0, 16), // ISO datetime-local format
    amount: "",
  });

  const refTypes = [
    "order",
    "advance",
    "loss",
    "other",
    "supplier",
    "Loan",
    "hire",
    "Deposit",
    "Withdrawl",
    "Payments",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    console.log(payload);
    console.log(JSON.stringify(payload));

    try {
      const res = await fetch("http://localhost:5001/api/admin/main/cash-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + data.message);
        return;
      }
      toast.success("Cash balance entry saved.");
      setFormData({
        reason: "",
        ref: "",
        ref_type: "other",
        dateTime: new Date().toISOString().slice(0, 16),
        amount: "",
      });
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-4">Cash Balance Entry</h2>

      <input
        type="text"
        name="reason"
        placeholder="Reason"
        value={formData.reason}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        name="ref"
        placeholder="Reference"
        value={formData.ref}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select
        name="ref_type"
        value={formData.ref_type}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        {refTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        name="dateTime"
        value={formData.dateTime}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="w-full border rounded p-2"
        step="0.01"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default CashBalanceInput;

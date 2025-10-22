import React, { useState, useEffect } from "react";
import { Container, Table, Spinner } from "reactstrap";
import { toast } from "react-toastify";

const DamageStock = () => {
  const [damagedItems, setDamagedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDamageStock();
  }, []);

  const fetchDamageStock = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/admin/main/damaged-items");
      const data = await response.json();

      if (response.ok && data.success) {
        setDamagedItems(data.damagedItems);
      } else {
        toast.warn(data.message || "No damaged items found.");
        setDamagedItems([]);
      }
    } catch (err) {
      console.error("Error fetching damaged stock:", err);
      toast.error("Failed to load damaged stock items.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: format date nicely
  const formatDateForInput = (dateStr) => {
      if (!dateStr) return "";
      const parts = dateStr.split("/");
      if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return dateStr; // already in correct format
  };


  return (
    <Container className="mt-5">
      <h4 className="mb-4 text-center">📦 Damaged Stock Items</h4>

      {loading ? (
        <div className="text-center my-5">
          <Spinner color="primary" /> <span>Loading damaged stock...</span>
        </div>
      ) : (
        <div className="p-3 border rounded bg-light shadow-sm">
          <Table bordered hover responsive className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Stock ID</th>
                <th>Purchase Note</th>
                <th>Supplier Name</th>
                <th>Damage Date</th>
              </tr>
            </thead>
            <tbody>
              {damagedItems.length > 0 ? (
                damagedItems.map((item, index) => (
                  <tr key={item.pid_Id}>
                    <td>{index + 1}</td>
                    <td>{item.item_name}</td>
                    <td>{item.stock_Id}</td>
                    <td>{item.purchase_note}</td>
                    <td>{item.supplier_name}</td>
                    <td>{formatDateForInput(item.damage_date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-muted text-center">
                    No damaged items found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default DamageStock;

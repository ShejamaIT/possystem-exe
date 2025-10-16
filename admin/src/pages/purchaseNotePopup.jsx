import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from "reactstrap";
import "../style/popup.css";

const PurchaseNotePopup = ({ isOpen, toggle, order }) => {
  const [totalItemAmount, setTotalItemAmount] = useState(0);

  useEffect(() => {
    if (!order || !order.items) return;

    const total = order.items.reduce((sum, item) => sum + (item.unitPrice * item.receivedQty), 0);
    setTotalItemAmount(total);
  }, [order]);

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Purchase Note Details - {order.purchaseId}
      </ModalHeader>
      <ModalBody>
        {/* Purchase Info */}
        <h5 className="underline">Purchase Note Info</h5>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><strong>Purchase ID:</strong> {order.purchaseId}</p>
          <p><strong>Receive Date:</strong> {order.receiveDate}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><strong>Invoice ID:</strong> {order.invoiceId || '-'}</p>
          <p><strong>Delivery Charge:</strong> {order.deliveryCharge}</p>
        </div>

        {/* Purchase Summary Table */}
        <Table bordered style={{ marginTop: "10px" }}>
          <tbody>
            <tr>
              <td><strong>Total Item Value:</strong></td>
              <td>{totalItemAmount}</td>
            </tr>
            <tr>
              <td><strong>Delivery Charge:</strong></td>
              <td>{order.deliveryCharge}</td>
            </tr>
            <tr>
              <td><strong>Invoice Total:</strong></td>
              <td>{order.total}</td>
            </tr>
            <tr>
              <td><strong>Paid:</strong></td>
              <td>{order.pay}</td>
            </tr>
            <tr>
              <td><strong>Balance:</strong></td>
              <td>{order.balance}</td>
            </tr>
          </tbody>
        </Table>

        {/* Items Table */}
        <h5 className="mt-4">Items</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Material</th>
              <th>Color</th>
              <th>Stock Range</th>
              <th>Received Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.itemId}</td>
                <td>{item.name}</td>
                <td>{item.material}</td>
                <td>{item.color}</td>
                <td>{item.stockRange}</td>
                <td>{item.receivedQty}</td>
                <td>{item.unitPrice}</td>
                <td>{item.unitPrice * item.receivedQty}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default PurchaseNotePopup;

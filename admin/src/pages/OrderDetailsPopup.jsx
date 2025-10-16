import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from "reactstrap";
import "../style/popup.css";

const OrderDetailsPopup = ({ isOpen, toggle, order }) => {
  const [totalPriceBeforeDiscount, setTotalPriceBeforeDiscount] = useState(0);

  useEffect(() => {
    if (!order || !order.items) return;

    const calculateTotalPriceBeforeDiscount = () => {
      return order.items.reduce((total, item) => {
        return total + (item.unitPrice * item.quantity);
      }, 0);
    };

    setTotalPriceBeforeDiscount(calculateTotalPriceBeforeDiscount());
  }, [order]);

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Order Details - {order.orderId}
      </ModalHeader>
      <ModalBody>
        {/* Customer Info Section */}
        <h5 className="underline">Customer Info</h5>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Address:</strong> {order.customerAddress || 'N/A'}</p>
        </div>
        <p><strong>Phone:</strong> {order.customerPhone} / {order.customerOptionalPhone || 'N/A'}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><strong>Category:</strong> {order.customerCategory}</p>
          <p><strong>Type:</strong> {order.customerType}</p>
        </div>

        {/* Order Info Section */}
        <h5>Order Info</h5>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><strong>Order Date:</strong> {order.orderDate}</p>
          <p><strong>Expected Date:</strong> {order.expectedDeliveryDate}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p><strong>Status:</strong> {order.orderStatus}</p>
          <p><strong>Special Note:</strong> {order.specialNote || 'N/A'}</p>
        </div>

        {/* Order Summary Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <tbody>
            <tr>
              <td><strong>Item Total:</strong></td>
              <td>{totalPriceBeforeDiscount}</td>
            </tr>
            <tr>
              <td><strong>Item Discount:</strong></td>
              <td>{order.itemDiscount}</td>
            </tr>
            <tr>
              <td><strong>Net Total:</strong></td>
              <td>{order.netTotal}</td>
            </tr>
            <tr>
              <td><strong>Delivery:</strong></td>
              <td>{order.deliveryCharge}</td>
            </tr>
            <tr>
              <td><strong>Coupon Discount:</strong></td>
              <td>{order.discount}</td>
            </tr>
            <tr>
              <td><strong>Special Discount:</strong></td>
              <td>{order.specialdiscount}</td>
            </tr>
            <tr>
              <td><strong>Bill Total:</strong></td>
              <td>{order.totalPrice}</td>
            </tr>
            <tr>
              <td><strong>Advance:</strong></td>
              <td>{order.advance}</td>
            </tr>
            <tr>
              <td><strong>Balance:</strong></td>
              <td>{order.balance}</td>
            </tr>
          </tbody>
        </table>

        {/* Items Table */}
        <h5>Items</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Color</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.itemId}>
                <td>{item.itemName}</td>
                <td>{item.color}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice}</td>
                <td>{item.quantity * (item.unitPrice-item.discount)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Payment History Table */}
        <h5>Payment History</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {order.paymentHistory.length > 0 ? (
              order.paymentHistory.map((payment) => (
                <tr key={payment.paymentId}>
                  <td>{payment.paymentId}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.paymentDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No payment history available.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderDetailsPopup;

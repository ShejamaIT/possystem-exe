import React, { useState, useEffect } from "react";
import "../style/invoice.css";
import Swal from 'sweetalert2';
import {Label} from "reactstrap";

const HirePayment = ({ selectedHire, setShowModal, handleSubmit2 }) => {
    const [customerPayment, setCustomerPayment] = useState(0);
    const [driverHandover, setDriverHandover] = useState(0);
    const [customerBalance, setCustomerBalance] = useState(0);
    const [driverBalance, setDriverBalance] = useState(0);

    // 🔄 Update balance whenever payments or hire change
    useEffect(() => {
        const hireAmount = parseFloat(selectedHire.hire || 0);
        const custPay = parseFloat(customerPayment || 0);
        const driverPay = parseFloat(driverHandover || 0);

        setCustomerBalance( hireAmount- custPay);
        setDriverBalance(custPay - driverPay );
    }, [customerPayment, driverHandover, selectedHire]);
    const handleSave = () => {
        const hireAmount = parseFloat(selectedHire.hire || 0);
        let CustBalance = parseFloat(customerBalance || 0);
        let DrivBalance = parseFloat(driverBalance || 0);

        const customerPromise = CustBalance !== 0
            ? Swal.fire({
                title: "<strong>Customer <u>Balance</u></strong>",
                icon: "info",
                html: `There is <b>Rs.${CustBalance}</b> balance by customer.`,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "👍 Pass!",
                cancelButtonText: "👎 Loss",
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    return { newCustBalance: 0, profitOrLoss: CustBalance, lossBy: "Customer" };
                }
                return { newCustBalance: CustBalance, profitOrLoss: 0, lossBy: null };
            })
            : Promise.resolve({ newCustBalance: 0, profitOrLoss: 0, lossBy: null });

        customerPromise.then(({ newCustBalance, profitOrLoss, lossBy }) => {
            CustBalance = newCustBalance;

            const driverPromise = DrivBalance !== 0
                ? Swal.fire({
                    title: "<strong>Driver <u>Balance</u></strong>",
                    icon: "info",
                    html: `There is <b>Rs.${DrivBalance}</b> balance by driver.`,
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: "👍 Pass!",
                    cancelButtonText: "👎 Loss",
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        return { newDrivBalance: 0, driverLoss: DrivBalance, lossBy: "Driver" };
                    }
                    return { newDrivBalance: DrivBalance, driverLoss: 0, lossBy: null };
                })
                : Promise.resolve({ newDrivBalance: 0, driverLoss: 0, lossBy: null });

            driverPromise.then(({ newDrivBalance, driverLoss, lossBy: driverLossBy }) => {
                DrivBalance = newDrivBalance;

                const lossSources = [lossBy, driverLossBy].filter(Boolean);
                const lossByFinal = lossSources.length > 0 ? lossSources.join(" & ") : null;

                // Final data with balance decisions
                handleSubmit2({
                    customer:selectedHire.customer,
                    driver:selectedHire.driverId,
                    customerPayment: parseFloat(customerPayment),
                    customerBalance: CustBalance,
                    driverHandover: parseFloat(driverHandover),
                    driverBalance: DrivBalance,
                    profitOrLoss: profitOrLoss + driverLoss,
                    lossBy: lossByFinal
                });

                setShowModal(false);
            });
        });
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
    };
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="invoice-title">Make Hire Payment</h2>
                <div className="invoice-section">
                    <div>

                    </div>
                    <p><strong>Customer:</strong> {selectedHire.custname}</p>
                    <p><strong>Date:</strong> {formatDate(selectedHire.date)}</p>
                    <p><strong>Phone Number:</strong> {selectedHire.phoneNumber}</p>
                    <p><strong>Other Number:</strong> {selectedHire.otherNumber}</p>
                    <p><strong>PickUp:</strong> {selectedHire.pickup}</p>
                    <p><strong>Destination:</strong> {selectedHire.destination}</p>
                    <p><strong>Driver:</strong> {selectedHire.driverName}</p>
                    <p><strong>Vehicle:</strong> {selectedHire.registration_no}</p>

                    <Label><strong>Hire:</strong> Rs.{selectedHire.hire}</Label>

                    <div>
                        <label><strong>Customer Payment:</strong> Rs.
                            <input
                                type="text"
                                value={customerPayment}
                                onChange={(e) => setCustomerPayment(e.target.value)}
                            />
                        </label>
                    </div>

                    <Label><strong>Customer Balance:</strong> Rs.{customerBalance}</Label>

                    <div>
                        <label><strong>Driver Handover:</strong> Rs.
                            <input
                                type="text"
                                value={driverHandover}
                                onChange={(e) => setDriverHandover(e.target.value)}
                            />
                        </label>
                    </div>

                    <p><strong>Driver Balance:</strong> Rs.{driverBalance}</p>
                </div>

                <div className="modal-buttons">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default HirePayment;

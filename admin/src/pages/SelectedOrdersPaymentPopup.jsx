import React, { useState, useMemo, useEffect } from "react";
import {  Modal,  ModalHeader,  ModalBody,  ModalFooter,  Table,  Button,  Input,  FormGroup,  Row,  Col,  Label,} from "reactstrap";
import PaymentReceiptView from "../pages/PaymentReceiptView ";

const SelectedOrdersPaymentPopup = ({  isOpen,  toggle,  selectedOrders,selecetdCustomer,  onSubmit,  loading = false,}) => {
  const [ordersState, setOrdersState] = useState([]);
  const [payRows, setPayRows] = useState({});
  const [formData, setFormData] = useState({payment: "",subPayment: ""});
  const [Banks, setBanks] = useState([]);
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [paymentdetails ,setPaymentDetails] = useState([]);
  const [paymentamount , setPaymentAmount] = useState(0);
  const [cashBalance , setCashBalance] = useState(0);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transferBank , setTranferBank] = useState("");
  const [transferAccount , setTransferAccount] = useState("");
  const [returnNoteModal, setReturnNoteModal] = useState(false);
  const [currentReturnOrder, setCurrentReturnOrder] = useState(null);
  const [returnQty, setReturnQty] = useState([]);
  const [returnNotes, setReturnNotes] = useState({});
  const [cardPayment , setCardPayment] = useState(0);
  const [cardFullPay , setCardfullPay] = useState(0);
  const [cardBalance , setCardBalance] = useState(0);
  const [rate , setRate] = useState(0);
  const [interestValue , setInterestValue] = useState(0);
  const [chequeAmount , setChequeAmount] = useState(0);
  const [bank , setBank] = useState("");
  const [branch , setBranch] = useState("");
  const [chequeNumber , setChequeNumber] = useState("");
  const [accountNumber , setAccountNumber] = useState("");
  const [chequeDate , setChequeDate] = useState("");
  const [cheques, setCheques] = useState([]);
  const [chequeBalance , setChequeBalance] = useState(0);
  const [creditAmount , setCreditAmount] = useState(0);
  const [creditExpectedDate , setCreditExpectedDate] = useState('');
  const [fulltotalPay , setFullTotalPay] = useState(0);
  const [combinedBalance , setCombinedBalance] = useState(0);
  const [combinedTransferBalance ,setCombinedTranferBalance] = useState(0);
  const [transferPortion , setTransferPortion] =useState(0);
  const [combinedCardBalance , setCombinedCardBalance] = useState(0);
  const [cardPortion , setCardPortion] = useState(0);
  const [netAmount , setNetAmount ] = useState(0);
  const [combinedChequeBalance , setCombinedChequeBalance] =useState(0);
  const [combinedChequeCard , setCombinedChequeCard] =useState(0);
  const [receiptView, setReceiptView] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const fixedRate = 2.5;

  useEffect(() => {
    fetchBankDetails();
  }, []);

  useEffect(() => {
    setOrdersState(selectedOrders.map((o) => ({ ...o })));
    const next = {};
    selectedOrders.forEach((o) => (next[o.orderId] = 0));
    setPayRows(next);
  }, [selectedOrders]);
  useEffect(() => {
    if (currentReturnOrder?.items) {
      setReturnQty(currentReturnOrder.items.map(() => 0));
    }
  }, [currentReturnOrder]);
  const fetchBankDetails = async () => {
      try {
          // Fetch shop banks
          const banksResponse = await fetch("http://localhost:5001/api/admin/main/shop-banks");
          const banksData = await banksResponse.json();
          setBanks(banksData || []);

          // Fetch account numbers
          const accResponse = await fetch("http://localhost:5001/api/admin/main/account-numbers/grouped");
          const accData = await accResponse.json();
          setAccountNumbers(accData || []);

          return { banks: banksData, accounts: accData }; // optional return
      } catch (error) {
          console.error("Error fetching bank details:", error);
          // toast.error("Error fetching bank details.");
          return { banks: [], accounts: [] };
      }
  };
  const handleReturnQtyChange = (index, value) => {
    const updatedQty = [...returnQty];
    updatedQty[index] = Number(value);
    setReturnQty(updatedQty);
  };
  const adjustOrderBalance = (orderId, totalReturnValue) => {
  setOrdersState((prevOrders) =>
    prevOrders.map((order) =>
      order.orderId === orderId
        ? {
            ...order,
            balance: Number(order.balance) - totalReturnValue, // allow negative
          }
        : order
    )
  );

  // Ensure payRows do not exceed updated balance (if positive)
  setPayRows((prev) => {
    const currentBalance =
      (ordersState.find((o) => o.orderId === orderId)?.balance || 0) -
      totalReturnValue;
    return {
      ...prev,
      [orderId]: Math.min(prev[orderId] || 0, currentBalance > 0 ? currentBalance : 0),
    };
  });
};
  const handlePassReturnItems = () => {
  const returnItems = currentReturnOrder.items.map((item, idx) => ({
    ...item,
    returnQty: returnQty[idx],
    returnValue: returnQty[idx] * (item.unitPrice - item.discount),
    orderId: currentReturnOrder.orderId,
  }));

  const totalReturn = returnItems.reduce((sum, item) => sum + item.returnValue, 0);

  // Save return details for this order
  setReturnNotes((prev) => ({
    ...prev,
    [currentReturnOrder.orderId]: {
      totalReturn,
      returnItems,
    },
  }));

  // Deduct return amount from the order balance
  adjustOrderBalance(currentReturnOrder.orderId, totalReturn);

  setReturnNoteModal(false);
};

  const secondOptions = useMemo(() => {
    switch (formData.payment) {
      case "Cash":
        return ["Cash", "Transfer"];
      case "Card":
        return ["Credit Card", "Debit Card"];
      case "Combined":
        return ["Cash & Card", "Cash & Cheque" , "Cash & Credit" , "Cash & Transfer"];
      case "Cheque":
        return [];
      default:
        return [];
    }
  }, [formData.payment]);
  const totalSelectedBalance = useMemo(
    () => ordersState.reduce((sum, o) => sum + Number(o.balance || 0), 0),
    [ordersState]
  );
  const totalToPay = useMemo(
    () => Object.values(payRows).reduce((sum, v) => sum + Number(v || 0), 0),
    [payRows]
  );
  const balanceRemaining = useMemo(
    () => totalSelectedBalance - totalToPay,
    [totalSelectedBalance, totalToPay]
  );
  const handleAmountChange = (orderId, value) => {
    const order = ordersState.find((o) => o.orderId === orderId);
    const currentBalance = Number(order?.balance || 0);

    // If balance is negative, payment must be 0
    if (currentBalance < 0) {
      setPayRows((prev) => ({
        ...prev,
        [orderId]: 0,
      }));
      return;
    }

    const val = Number(value || 0);
    const maxPayable = currentBalance;

    setPayRows((prev) => ({
      ...prev,
      [orderId]: val > maxPayable ? maxPayable : val,
    }));
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      subPayment: "",
    });
  };
  const handleChangeSub = (e) => {
    setFormData({ ...formData, subPayment: e.target.value });
  };
  const handleSubmit = async () => {
    if (!formData.payment) {
      alert("Please select a payment method.");
      return;
    }

    const payload = ordersState.map((o) => ({
      orderId: o.orderId,
      billTotal: o.billTotal,
      advance: o.advance,
      balance: o.balance,
      payAmount: payRows[o.orderId] || 0,
      returnNote: returnNotes[o.orderId] || null,
    }));

    const requestBody = {
      paymentMethod: {
        ...paymentdetails,
      },
      orders: payload,
    };

    const total = Number(totalToPay);
    const payment = Number(paymentdetails.fullTotal);
    if (payment !== total) {
      return alert("Payment value is not the same as total to pay.");
    }
    try {
      const response = await fetch("http://localhost:5001/api/admin/main/payment/settle-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Payment failed:", result);
        alert(`Payment failed: ${result.message}`);
        return;
      }

      alert("Payment processed successfully.");

      // ✅ Store receipt data
      setReceiptData({
        paymentMethod: paymentdetails,
        orders: payload,
        customerData: selecetdCustomer,
      });

      setReceiptView(true); // ✅ Trigger receipt modal or view

      // toggle(); // Close modal/reset if needed
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Something went wrong during payment. Please try again.");
    }
  };

  const handleReturnNote = (order) => {
    setCurrentReturnOrder(order);
    setReturnNoteModal(true);
  };
  const handleCheque = () => {
      if (!chequeNumber || !chequeDate || !chequeAmount) return;

      setCheques([
          ...cheques,
          {
              chequeNumber,
              chequeDate,
              amount: chequeAmount,
              bank,
              branch,
              accountNumber,
          },
      ]);

      // Optional: Reset form fields
      setChequeAmount('');
      setChequeNumber('');
      setChequeDate('');
      setBank('');
      setBranch('');
      setAccountNumber('');
  };

  const handleRemoveCheque = (index) => {
      const updatedCheques = [...cheques];
      updatedCheques.splice(index, 1);
      setCheques(updatedCheques);
  };

  const totalReturnValue = useMemo(() => {
    if (!currentReturnOrder?.items) return 0;
    return currentReturnOrder.items.reduce(
      (sum, item, idx) =>
        sum + returnQty[idx] * (item.unitPrice - item.discount),
      0
    );
  }, [returnQty, currentReturnOrder]);

  useEffect(() => {
    const totalBalance = Number(totalSelectedBalance) || 0;
    const cardPay = parseFloat(cardPayment) || 0;
    const totalChequeAmount = cheques.reduce((sum, chq) => sum + (parseFloat(chq.amount) || 0), 0);
    const creditAdvance = Number(creditAmount);
    
    const isChequePayment = formData.payment === "Cheque"; // FIXED
    const isCreditPayment = formData.payment === "Credit";
    const isCashPayment = formData.payment === "Cash" && formData.subPayment === "Cash";
    const isTransferPayment = formData.payment === "Cash" && formData.subPayment === "Transfer";
    const isCombinedCashTransfer = formData.payment === "Combined" && formData.subPayment === "Cash & Transfer";
    const isCombinedCashCard = formData.payment === "Combined" && formData.subPayment === "Cash & Card";
    const isCombinedCashCheque = formData.payment === "Combined" && formData.subPayment === "Cash & Cheque";
    const isCardPayment =formData.payment === "Card" &&(formData.subPayment === "Debit Card" || formData.subPayment === "Credit Card");

    const newCashBalance = totalBalance - Number(paymentamount || 0);
    setCashBalance(newCashBalance);

    if (!formData.payment || (!isChequePayment && !formData.subPayment)) {
      setPaymentDetails(null);
      return;
    }

    if (isCashPayment) {
      setPaymentDetails({
        method: formData.payment,
        submethod: formData.subPayment,
        CashpaymentAmount: Number(paymentamount || 0),
        balance: newCashBalance,
        fullTotal: Number(paymentamount || 0),
      });
    } else if (isTransferPayment) {
      setPaymentDetails({
        method: formData.payment,
        submethod: formData.subPayment,
        TransferpaymentAmount: Number(paymentamount || 0),
        balance: newCashBalance,
        bank: selectedBankId,
        account: transferAccount,
        fullTotal: Number(paymentamount || 0),
      });
    } else if (isCardPayment) {
      const interestOnCardPay = (cardPay * fixedRate) / 100;
      const netCardPay = cardPay + interestOnCardPay;
      const balanceValue = totalBalance - cardPay;

      setRate(fixedRate);
      setInterestValue(interestOnCardPay);
      setCardfullPay(netCardPay);
      setCardBalance(balanceValue);

      setPaymentDetails({
        method: formData.payment,
        submethod: formData.subPayment,
        paymentAmount: Number(cardPay || 0),
        balance: balanceValue,
        interstValue: interestValue,
        fullTotal: Number(cardPay || 0),
      });
    } else if (isChequePayment) {
      const totalPaid = Number(totalChequeAmount);
      const newBalance = totalBalance - totalPaid;

      setChequeBalance(newBalance);
      setPaymentDetails({
        method: formData.payment,
        submethod: formData.subPayment || "", // avoid undefined
        paymentAmount: totalPaid,
        balance: newBalance,
        cheques: cheques,
        fullTotal: Number(totalPaid || 0),
      });
    } else if (isCreditPayment) {
              const balance = creditAdvance - totalBalance;
              // setAdvance(creditAdvance);
              // setBalance(balance.toFixed(2));
    }  else if (isCombinedCashTransfer) {
        const cashPart = parseFloat(combinedTransferBalance) || 0;
        const transferPart = parseFloat(transferPortion) || 0;
        const fullPaid = cashPart + transferPart;
        const bal = Number(fullPaid - totalBalance);

        setFullTotalPay(totalBalance);
        setCombinedBalance(bal);
        setPaymentDetails({
          method: formData.payment,
          submethod: formData.subPayment,
          cashPart: Number(cashPart),
          trasferPart: Number(transferPart),
          balance: Number(bal),
          bank: selectedBankId,
          account: transferAccount,
          fullTotal: Number(fullPaid || 0),
        });
    } else if (isCombinedCashCard) {
        const cardAmount = Number(cardPortion);
        const cashAmount = Number(combinedCardBalance);

        const interest = (cardAmount * fixedRate) / 100;
        const cardTotal = cardAmount + interest;
        const fullPaid = cardAmount + cashAmount;
        const fullTotal = cashAmount + cardTotal;
        const bal = Number(totalBalance - fullPaid)

        setRate(fixedRate);
        setInterestValue(interest);
        setNetAmount(fullTotal);
        setFullTotalPay(fullPaid);
        setCombinedBalance(bal);
        setPaymentDetails({
          method: formData.payment,
          submethod: formData.subPayment,
          cardAmount: Number(cardAmount || 0),
          cashAmount: Number(cashAmount || 0),
          balance: bal,
          interstValue: interest,
          fullTotal: Number(fullPaid || 0),
        });
    }  else if (isCombinedCashCheque) {
      const chequeCash = Number(combinedChequeCard);
        const totalPaid = chequeCash + totalChequeAmount;
        const balanceRemaining = totalPaid - totalBalance;

        setCombinedChequeBalance(balanceRemaining);
        setPaymentDetails({
        method: formData.payment,
          submethod: formData.subPayment || "", // avoid undefined
          cashAmount: Number(chequeCash),
          chequeAmount:Number(totalChequeAmount),
          balance: Number(balanceRemaining),
          cheques: cheques,
          fullTotal: Number(totalPaid || 0),
        });
        
    }  else {
      setPaymentDetails({
        method: formData.payment,
        submethod: formData.subPayment,
        paymentAmount: Number(paymentamount || 0),
        balance: newCashBalance,
        fullTotal: Number(paymentamount || 0),
      });
    }
  }, [ formData.payment, formData.subPayment, totalSelectedBalance, paymentamount, selectedBankId, transferAccount, cardPayment, interestValue, cheques,creditAmount,creditExpectedDate,
    combinedTransferBalance,transferPortion,cardPortion,combinedCardBalance,combinedChequeCard
  ]);

  return (
    <>
      {/* Main Payment Modal */}
      <Modal isOpen={isOpen} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Proceed Payment</ModalHeader>
        <ModalBody>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Outstanding Balance</th>
                <th>Current Payment</th>
                <th>Remaining Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersState.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.balance}</td>
                  <td>
                    <Input
                      type="text"
                      value={payRows[o.orderId] || ""}
                      onChange={(e) =>
                        handleAmountChange(o.orderId, e.target.value)
                      }
                    />
                  </td>
                  <td>{Number(o.balance) - Number(payRows[o.orderId] || 0)}</td>
                  <td>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => handleReturnNote(o)}
                    >
                      Return Note
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Display Totals */}
          <div className="mt-2">
            <Label className="fw-bold me-3">
              Total Outstanding: {totalSelectedBalance}
            </Label>
            <Label className="fw-bold me-3">
              Current Payment: {totalToPay}
            </Label>
            <Label className="fw-bold">
              Balance Remaining: {balanceRemaining}
            </Label>
          </div>

          {/* Payment Method */}
          <Row className="mt-3">
            <Label className="fw-bold">Payment Method</Label>
            <Col md={6}>
              <FormGroup>
                <Input
                  type="select"
                  name="payment"
                  id="payment"
                  value={formData.payment}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Option</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit">Credit</option>
                  <option value="Combined">Combined</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Input
                  type="select"
                  name="subPayment"
                  id="subPayment"
                  value={formData.subPayment}
                  onChange={handleChangeSub}
                  disabled={!formData.payment || secondOptions.length === 0}
                >
                  <option value="">Select Sub Option</option>
                  {secondOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            {formData.payment === "Cash" && (formData.subPayment === "Cash") && (
              <>
                  <div className="custom-info-row">
                      <span className="custom-info-label">Total Outstating</span>
                      <span className="custom-info-value">Rs.{totalSelectedBalance}</span>
                  </div>
                  <div className="custom-info-row">
                      <span className="custom-info-label">Payment Amount</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="paymentamount"
                              value={paymentamount}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  // Allow only numbers and a single dot
                                  if (/^\d*\.?\d*$/.test(val)) {
                                      setPaymentAmount(val);
                                  }
                              }}
                              required
                              className="w-full text-right" // Optional: Align input text to the right
                          />
                      </span>
                  </div>

              <div className="custom-info-row">
                      <span className="custom-info-label">Balance</span>
                      <span className="custom-info-value">Rs.{cashBalance}</span>
                  </div>
              </>
            )}
            {formData.payment === "Cash" && formData.subPayment === "Transfer" && (
              <>
                  {/* Net Amount */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Total Outstating</span>
                      <span className="custom-info-value">Rs.{totalSelectedBalance}</span>
                  </div>

                  {/* Payment Amount */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Payment Amount</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="paymentamount"
                              value={paymentamount}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*\.?\d*$/.test(val)) {
                                      setPaymentAmount(val);
                                  }
                              }}
                              required
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Bank</span>
                      <span className="custom-info-value flex items-center gap-2">
                          <select
                              className="w-full text-right"
                              value={selectedBankId}
                              onChange={(e) => {
                                  const bankId = e.target.value;
                                  setSelectedBankId(bankId);

                                  const matchedBank = Banks.find((b) => b.sbID === parseInt(bankId));
                                  setTranferBank(matchedBank?.Bank || "");

                                  const relatedAccounts = accountNumbers.find(acc => acc.sbID === parseInt(bankId));
                                  setAvailableAccounts(relatedAccounts?.accountNumbers || []);
                                  setSelectedAccount("");
                              }}
                              required
                          >
                              <option value="">Select Bank</option>
                              {Banks.map((bank) => (
                                  <option key={bank.sbID} value={bank.sbID}>
                                      {bank.Bank} - {bank.branch}
                                  </option>
                              ))}
                          </select>
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Account Number</span>
                      <span className="custom-info-value flex items-center gap-2">
                          <select
                              className="w-full text-right"
                              value={transferAccount}
                              onChange={(e) => setTransferAccount(e.target.value)}
                              required
                          >
                              <option value="">Select Account</option>
                              {availableAccounts.map((acc) => (
                                  <option key={acc.acnID} value={acc.acnID}>
                                      {acc.number}
                                  </option>
                              ))}
                          </select>
                      </span>
                  </div>
                  <div className="custom-info-row">
                      <span className="custom-info-label">Balance</span>
                      <span className="custom-info-value">Rs.{cashBalance}</span>
                  </div>
              </>
            )}
            {formData.payment === "Card" &&
            (formData.subPayment === "Debit Card" || formData.subPayment === "Credit Card") && (
                <>
                    <div className="custom-info-row">
                        <span className="custom-info-label">Outstanding Amount</span>
                        <span className="custom-info-value">{totalSelectedBalance}</span>
                    </div>
                    <div className="custom-info-row">
                        <span className="custom-info-label">Payment Amount</span>
                        <span className="custom-info-value">
                            <Input
                                type="text"
                                name="amount"
                                value={cardPayment}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*\.?\d*$/.test(val)) {
                                        setCardPayment(val);
                                        // setAdvance(val); // Reflect in general payment state
                                    }
                                }}
                                required
                                className="w-full text-right"
                            />
                        </span>
                    </div>
                    <div className="custom-info-row">
                        <span className="custom-info-label">Interest Rate (%)</span>
                        <span className="custom-info-value">{rate}</span>
                    </div>
                    <div className="custom-info-row">
                        <span className="custom-info-label">Interest Value</span>
                        <span className="custom-info-value">Rs.{interestValue.toFixed(2)}</span>
                    </div>
                    <div className="custom-info-row">
                        <span className="custom-info-label">Net Amount</span>
                        <span className="custom-info-value">Rs.{cardFullPay.toFixed(2)}</span>
                    </div>
                    <div className="custom-info-row">
                        <span className="custom-info-label">Balance</span>
                        <span className="custom-info-value">Rs.{cardBalance}</span>
                    </div>
                </>
            )}
            {formData.payment === "Cheque" && (
              <>
                  <div className="custom-info-row">
                      <span className="custom-info-label">Outstanding Amount</span>
                      <span className="custom-info-value">Rs.{totalSelectedBalance}</span>
                  </div>
                  <div className="custom-info-row">
                  <span className="custom-info-label">Payment Amount</span>
                  <span className="custom-info-value">
                      <Input
                      type="text"
                      name="amount"
                      value={chequeAmount}
                      onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*\.?\d*$/.test(val)) {
                          setChequeAmount(val);
                          }
                      }}
                      
                      className="w-full text-right"
                      />
                  </span>
                  </div>

                  <div className="custom-info-row">
                  <span className="custom-info-label">Cheque Number</span>
                  <span className="custom-info-value">
                      <Input
                      type="text"
                      name="chequeNumber"
                      value={chequeNumber}
                      onChange={(e) => setChequeNumber(e.target.value)}
                      
                      className="w-full text-right"
                      />
                  </span>
                  </div>

                  <div className="custom-info-row">
                  <span className="custom-info-label">Bank</span>
                  <span className="custom-info-value">
                      <Input
                      type="text"
                      name="bank"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      
                      className="w-full text-right"
                      />
                  </span>
                  </div>

                  <div className="custom-info-row">
                  <span className="custom-info-label">Branch</span>
                  <span className="custom-info-value">
                      <Input
                      type="text"
                      name="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      
                      className="w-full text-right"
                      />
                  </span>
                  </div>

                  <div className="custom-info-row">
                  <span className="custom-info-label">Account Number</span>
                  <span className="custom-info-value">
                      <Input
                      type="text"
                      name="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      
                      className="w-full text-right"
                      />
                  </span>
                  </div>

                  <div className="custom-info-row">
                  <span className="custom-info-label">Cheque Date</span>
                  <span className="custom-info-value">
                      <Input
                      type="date"
                      name="chequeDate"
                      value={chequeDate}
                      onChange={(e) => setChequeDate(e.target.value)}
                      
                      className="w-full text-right"
                      />
                  </span>
                  </div>
                  <div className="custom-info-row">
                      <span className="custom-info-label">Balance</span>
                      <span className="custom-info-value">Rs.{chequeBalance}</span>
                  </div>
                     
                  <Row className="align-items-center">
                  <Col xs="4">
                      <Button color="info" onClick={handleCheque}>Add Cheque</Button>
                  </Col>
              </Row>

                  {cheques.length > 0 && (
                      <Table bordered size="sm" className="mt-3">
                          <thead className="custom-table-header">
                              <tr>
                                  <th>#</th>
                                  <th>Cheque Number</th>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {cheques.map((cheque, index) => (
                                  <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{cheque.chequeNumber}</td>
                                      <td>{cheque.chequeDate}</td>
                                      <td>{cheque.amount}</td>
                                      <td>
                                          <Button
                                              color="danger"
                                              size="sm"
                                              onClick={() => handleRemoveCheque(index)}
                                          >
                                              Remove
                                          </Button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </Table>
                  )}

              </>
            )}
            {formData.payment === "Combined" && formData.subPayment === "Cash & Transfer" && (
              <>
                  {/* Net Amount */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Total Outstanding</span>
                      <span className="custom-info-value">Rs.{totalSelectedBalance}</span>
                  </div>

                  {/* Cash Amount */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Cash Amount</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="cashAmount"
                              value={combinedTransferBalance}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*\.?\d*$/.test(val)) {
                                      setCombinedTranferBalance(val);
                                  }
                              }}
                              required
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  {/* Transfer Balance (Editable) */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Transfer Balance</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="transferBalance"
                              value={transferPortion}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*\.?\d*$/.test(val)) {
                                      setTransferPortion(val);

                                  }
                              }}
                              required
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  {/* Bank Dropdown */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Bank</span>
                      <span className="custom-info-value flex items-center gap-2">
                          <select
                              className="w-full text-right"
                              value={selectedBankId}
                              onChange={(e) => {
                                  const bankId = e.target.value;
                                  setSelectedBankId(bankId);

                                  const matchedBank = Banks.find((b) => b.sbID === parseInt(bankId));
                                  setTranferBank(matchedBank?.Bank || "");

                                  const relatedAccounts = accountNumbers.find(acc => acc.sbID === parseInt(bankId));
                                  setAvailableAccounts(relatedAccounts?.accountNumbers || []);
                                  setSelectedAccount("");
                              }}
                              required
                          >
                              <option value="">Select Bank</option>
                              {Banks.map((bank) => (
                                  <option key={bank.sbID} value={bank.sbID}>
                                      {bank.Bank} - {bank.branch}
                                  </option>
                              ))}
                          </select>
                      </span>
                  </div>

                  {/* Account Number Dropdown */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Account Number</span>
                      <span className="custom-info-value flex items-center gap-2">
                          <select
                              className="w-full text-right"
                              value={transferAccount}
                              onChange={(e) => setTransferAccount(e.target.value)}
                              required
                          >
                              <option value="">Select Account</option>
                              {availableAccounts.map((acc) => (
                                  <option key={acc.acnID} value={acc.acnID}>
                                      {acc.number}
                                  </option>
                              ))}
                          </select>
                      </span>
                  </div>

                  {/* Balance */}
                  <div className="custom-info-row">
                      <span className="custom-info-label">Balance</span>
                      <span className="custom-info-value">Rs.{combinedBalance}</span>
                  </div>

              </>
            )}
            {formData.payment === "Combined" && formData.subPayment === "Cash & Card" && (
              <>
                <div className="custom-info-row">
                  <span className="custom-info-label">Total Outstanding</span>
                  <span className="custom-info-value">Rs.{totalSelectedBalance}</span>
                </div>

                <div className="custom-info-row">
                  <span className="custom-info-label">Cash Amount</span>
                  <span className="custom-info-value">
                    <Input
                      type="text"
                      name="cashAmount"
                      value={combinedCardBalance}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                          setCombinedCardBalance(val);
                        }
                      }}
                      required
                      className="w-full text-right"
                    />
                  </span>
                </div>

                <div className="custom-info-row">
                  <span className="custom-info-label">Card Amount</span>
                  <span className="custom-info-value">
                    <Input
                      type="text"
                      name="cardAmount"
                      value={cardPortion}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                          setCardPortion(val);
                        }
                      }}
                      required
                      className="w-full text-right"
                    />
                  </span>
                </div>

                <div className="custom-info-row">
                  <span className="custom-info-label">Interest Rate (%)</span>
                  <span className="custom-info-value">{rate}</span>
                </div>

                <div className="custom-info-row">
                  <span className="custom-info-label">Interest Value</span>
                  <span className="custom-info-value">Rs.{interestValue.toFixed(2)}</span>
                </div>

                <div className="custom-info-row">
                  <span className="custom-info-label">Net Amount</span>
                  <span className="custom-info-value">Rs.{netAmount.toFixed(2)}</span>
                </div>

                 <div className="custom-info-row">
                  <span className="custom-info-label">Total Pay Amount</span>
                  <span className="custom-info-value">Rs.{parseFloat(fulltotalPay).toFixed(2)}</span>
                </div>

                <div className="custom-info-row">
                  <span className="custom-info-label">Balance</span>
                  <span className="custom-info-value">Rs.{combinedBalance.toFixed(2)}</span>
                </div>
              </>
            )}
            {formData.payment === "Combined" && formData.subPayment === "Cash & Cheque" && (
              <>
                  <div className="custom-info-row">
                      <span className="custom-info-label">Total Outstanding</span>
                      <span className="custom-info-value">Rs.{totalSelectedBalance}</span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Cash Amount</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="cashAmount"
                              value={combinedChequeCard}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*\.?\d*$/.test(val)) {
                                      setCombinedChequeCard(val);
                                  }
                              }}
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Cheque Amount</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="chequeAmount"
                              value={chequeAmount}
                              onChange={(e) => {
                                  const val = e.target.value;
                                  if (/^\d*\.?\d*$/.test(val)) {
                                      setChequeAmount(val);
                                  }
                              }}
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Cheque Number</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="chequeNumber"
                              value={chequeNumber}
                              onChange={(e) => setChequeNumber(e.target.value)}
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Bank</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="bank"
                              value={bank}
                              onChange={(e) => setBank(e.target.value)}
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Branch</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="branch"
                              value={branch}
                              onChange={(e) => setBranch(e.target.value)}
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Account Number</span>
                      <span className="custom-info-value">
                          <Input
                              type="text"
                              name="accountNumber"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              className="w-full text-right"
                          />
                      </span>
                  </div>

                  <div className="custom-info-row">
                      <span className="custom-info-label">Cheque Date</span>
                      <span className="custom-info-value">
                          <Input
                              type="date"
                              name="chequeDate"
                              value={chequeDate}
                              onChange={(e) => setChequeDate(e.target.value)}
                              className="w-full text-right"
                          />
                      </span>
                  </div>
                  <div className="custom-info-row">
                      <span className="custom-info-label">Balance</span>
                      <span className="custom-info-value">Rs.{combinedChequeBalance}</span>
                  </div>
                  <Row className="align-items-center">
                      <Col xs="4">
                          <Button color="info" onClick={handleCheque}>Add Cheque</Button>
                      </Col>
                  </Row>

                  {cheques.length > 0 && (
                      <Table bordered size="sm" className="mt-3">
                          <thead className="custom-table-header">
                              <tr>
                                  <th>#</th>
                                  <th>Cheque Number</th>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Action</th>
                              </tr>
                          </thead>
                          <tbody>
                              {cheques.map((cheque, index) => (
                                  <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>{cheque.chequeNumber}</td>
                                      <td>{cheque.chequeDate}</td>
                                      <td>{cheque.amount}</td>
                                      <td>
                                          <Button
                                              color="danger"
                                              size="sm"
                                              onClick={() => handleRemoveCheque(index)}
                                          >
                                              Remove
                                          </Button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </Table>
                  )}
              </>
          )}

            {receiptView && receiptData && (
              <PaymentReceiptView
                receiptData={receiptData}
                setShowReceiptView={setReceiptView}
              />
            )}


          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}> Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            {loading ? "Processing..." : "Confirm Payment"}
          </Button>
        </ModalFooter>
      </Modal>
      {currentReturnOrder && (
        <Modal
          isOpen={returnNoteModal}
          toggle={() => setReturnNoteModal(false)}
          size="lg"
        >
          <ModalHeader toggle={() => setReturnNoteModal(false)}>
            Return Note - {currentReturnOrder.orderId}
          </ModalHeader>
          <ModalBody style={{ maxHeight: "400px", overflowY: "auto" }}>
            {currentReturnOrder.items && currentReturnOrder.items.length > 0 ? (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Return Qty</th>
                    <th>Return Qty Value</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReturnOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.itemName || "N/A"}</td>
                      <td>{item.quantity || 0}</td>
                      <td>{(item.unitPrice - item.discount) * item.quantity}</td>
                      <td>
                        <Input
                          type="number"
                          min="0"
                          max={item.quantity}
                          name={`returnqty-${idx}`}
                          value={returnQty[idx]}
                          onChange={(e) =>
                            handleReturnQtyChange(idx, e.target.value)
                          }
                        />
                      </td>
                      <td>{returnQty[idx] * (item.unitPrice - item.discount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={4} className="text-end">
                      Total Return Value:
                    </th>
                    <th>{totalReturnValue}</th>
                  </tr>
                </tfoot>
              </Table>
            ) : (
              <p>No items available for this order.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handlePassReturnItems}>Pass</Button>
            <Button color="secondary" onClick={() => setReturnNoteModal(false)}> Close</Button>
          </ModalFooter>
        </Modal>

        
      )}
    </>
  );
};

export default SelectedOrdersPaymentPopup;

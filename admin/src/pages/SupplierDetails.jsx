import React, { useState, useEffect } from 'react';
import {Row, Col, Button, Input, Table, Label, Container, ModalHeader, ModalBody, FormGroup, ModalFooter, Modal} from 'reactstrap';
import {toast} from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

const SupplierDetails = ({ supplier }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemsList, setItemsList] = useState([]);  // List to store items (existing + new)
    const [paymentList, setPaymentList] = useState([]);  // List to store payment
    const [dropdownOpen, setDropdownOpen] = useState(false);  // To handle dropdown visibility
    const [amount, setAmount] = useState('');  // To store entered cost
    const [warrantyPeriod, setWarrantyPeriod] = useState('');  // Warranty period remains unchanged
    const [itemData, setItemData] = useState([]); // List of all items for searching and filtering
    const [filteredItems, setFilteredItems] = useState([]); // List to store filtered items based on search term
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [balanceAmount, setBalanceAmount] = useState('');
    const [fullPayAmount, setFullPayAmount] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedCost, setEditedCost] = useState("");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems1, setFilteredItems1] = useState(itemsList);
    const [filteredPayments, setFilteredPayments] = useState(paymentList);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

  // 🔹 Filter payments by selected date range
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredPayments(paymentList);
      return;
    }

    const start = startDate ? new Date(startDate) : new Date("1900-01-01");
    const end = endDate ? new Date(endDate) : new Date("9999-12-31");

    const filtered = paymentList.filter((payment) => {
      const paymentDate = new Date(payment.rDate);
      return paymentDate >= start && paymentDate <= end;
    });

    // Sort ascending by date
    filtered.sort((a, b) => new Date(a.rDate) - new Date(b.rDate));

    setFilteredPayments(filtered);
  }, [startDate, endDate, paymentList]);

    useEffect(() => {
        // Filter items by ID or Name
        const filtered = itemsList.filter(item =>
            item.I_Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.I_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredItems1(filtered);
    }, [searchQuery, itemsList]);

    // Fetch all items for search and filter
    useEffect(() => {
        fetchAllItems();
    }, []); 
    const fetchAllItems = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitems");  // API to fetch all items
            const data = await response.json();

            if (response.ok) {
                setItemData(data); // Store all items for search
            } else {
                console.error("Failed to load items:", data.message);
            }
        } catch (error) {
            console.error("Error fetching all items:", error);
        }
    };
    useEffect(() => {
        fetchSupplierItems();
    }, [supplier?.s_ID]);
    const fetchSupplierItems = async () => {
            if (!supplier?.s_ID) return; // Avoid fetching if supplier ID is not available

            try {
                const response = await fetch(`http://localhost:5001/api/admin/main/supplier-items?s_Id=${supplier.s_ID}`);
                const data = await response.json();

                if (response.ok) {
                    console.log("Fetched items:", data.items); // Good for debugging
                    setItemsList(data.items || []); // Always set items list (even if empty)
                } else {
                    console.error("Failed to load supplier items:", data.message);
                    setItemsList([]); // Clear items if backend returns an error
                }
            } catch (error) {
                console.error("Error fetching supplier items:", error);
                setItemsList([]); // Clear items if there's a network or parsing error
            }
        };
    useEffect(() => {
        if (supplier?.s_ID) {
            fetchSupplierPayments();
        }
    }, [supplier?.s_ID]); // Re-fetch when supplier ID changes
    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateStr; // already in correct format
    };

    const fetchSupplierPayments = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/unpaid-stock-details?s_Id=${supplier.s_ID}`);
            const data = await response.json();

            if (response.ok) {
                setPaymentList(data.unpaidStockDetails || []);
                setFullPayAmount(data.fullTotal || 0);
            } else {
                console.error("Failed to load supplier payments:", data.message);
                setPaymentList([]);      // Clear previous data if fetch failed
                setFullPayAmount(0);
            }
        } catch (error) {
            console.error("Error fetching supplier payments:", error);
            setPaymentList([]);          // Clear state on error
            setFullPayAmount(0);
        }
    };
    // Handle search term change
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Filter items based on the search term (item code or name)
        const filtered = itemData.filter((item) =>
            item.I_Id.toString().includes(term) || item.I_name.toLowerCase().includes(term.toLowerCase())
        );

        setFilteredItems(filtered);
        setDropdownOpen(filtered.length > 0);  // Open dropdown if matching items exist
    };
    // Handle selecting an item from the dropdown
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setSearchTerm(item.I_Id);  // Set search box to selected item code
        setDropdownOpen(false);  // Close the dropdown after selection
        setWarrantyPeriod(item.warrantyPeriod);  // Set warranty period as is (it won't be changed)
    };
    const handleAddItem = async () => {
        if (!amount) {
            toast.error("Add cost first.");
            return;
        }

        if (!selectedItem) {
            toast.error("Select an item first.");
            return;
        }

        // Check if the item already exists in the list
        const itemExists = itemsList.some(item => item.I_Id === selectedItem.I_Id);
        if (itemExists) {
            toast.error("This item has already been added.");
            return;
        }
        // Create new item object
        const newItem = {
            I_Id: selectedItem.I_Id,
            I_name: selectedItem.I_name,
            s_ID: supplier.s_ID,
            unit_cost: amount,
            warrantyPeriod: selectedItem.warrantyPeriod
        };
        const itemDetail ={
            I_Id: selectedItem.I_Id,
            s_ID: supplier.s_ID,
            unit_cost: amount
        }

        // Send API request to save the item in `item_supplier` table
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/add-supplier-item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemDetail),
            });

            const data = await response.json();

            if (response.ok) {
                // Add the new item to the local list
                setItemsList((prevItems) => [newItem, ...prevItems]);

                // Clear selection fields
                setSelectedItem('');
                setAmount('');

                toast.success("Item added successfully!");
            } else {
                toast.error(data.message || "Failed to add item.");
            }
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("Error adding item. Please try again.");
        }
    };
    const handleOpenPaymentModal = (payment) => {
        setSelectedPayment(payment);
        setBalanceAmount(payment.balance);
        setShowPaymentModal(true);
    };
    const handlePaymentAmountChange = (e) => {
        const enteredAmount = parseFloat(e.target.value) || 0;
        const newBalance = selectedPayment.total - enteredAmount;

        setPaymentAmount(enteredAmount);
        setBalanceAmount(newBalance >= 0 ? newBalance : 0); // Prevent negative balance
    };
    const handleClearSelection = () => {
        setSelectedItem(null);
        setSearchTerm("");
        setAmount("");
    };
    const handlePaymentSettlement = async () => {
        if (!paymentAmount || paymentAmount <= 0) {
            toast.error("Enter a valid payment amount.");
            return;
        }

        const paymentData = {
            pc_Id: selectedPayment.pc_Id,
            amountPaid: paymentAmount, // Balance isn't needed if API recalculates it
        };

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/settle-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Payment settled successfully!");
                setShowPaymentModal(false);
                fetchSupplierPayments(); // Refresh unpaid stock list
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(data.message || "Failed to settle payment.");
            }
        } catch (error) {
            console.error("Error settling payment:", error);
            toast.error("Error processing payment.");
        }
    };
    const handleViewOrder = (noteId) => {
        navigate(`/purchase-detail/${noteId}`);
    };
    const handleRemoveSupplier = async (I_Id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This supplier will be removed from the item!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5001/api/admin/main/item-suppliers/${I_Id}/${supplier.s_ID}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                // Refresh all related data after successful deletion
                fetchAllItems();
                fetchSupplierItems();
                fetchSupplierPayments();

                Swal.fire("Removed!", "Supplier removed successfully.", "success");
            } else {
                Swal.fire("Failed!", "Could not delete supplier.", "error");
            }
        } catch (error) {
            console.error("Error removing supplier:", error);
            Swal.fire("Error!", "Something went wrong.", "error");
        }
    };
    // Start editing
    const handleEditClick = (item) => {
        setEditingItemId(item.I_Id);
        setEditedCost(item.amount || item.unit_cost || "");
    };

    // Save updated cost
    const handleSaveClick = async (item) => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/updateItemCost", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    I_Id: item.I_Id,
                    cost: editedCost,
                    supplier: supplier.s_ID,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Item cost updated successfully!");

                // ✅ Update the cost locally in the UI without reloading
                setFilteredItems1((prevItems) =>
                    prevItems.map((i) =>
                        i.I_Id === item.I_Id
                            ? { ...i, unit_cost: editedCost, amount: editedCost }
                            : i
                    )
                );

                // Optional: also update the main list if you have it
                setItemsList((prevItems) =>
                    prevItems.map((i) =>
                        i.I_Id === item.I_Id
                            ? { ...i, unit_cost: editedCost, amount: editedCost }
                            : i
                    )
                );

                setEditingItemId(null);
            } else {
                console.error("❌ Failed to update cost:", data.message);
                alert("Failed to update cost: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("❌ Error updating cost:", error);
            alert("Failed to update cost.");
        }
    };

    return (
        <Helmet title={`Supplier Detail`}>
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <div className="coupon-detail">
                                <h4 className="sub-title">Supplier Details</h4>
                                <Table bordered className="member-table">
                                    <tbody>
                                    <tr>
                                        <td><strong>Id</strong></td>
                                        <td>{supplier.s_ID}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Name</strong></td>
                                        <td>{supplier.name}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Contacts</strong></td>
                                        <td>{supplier.contact} / {supplier.contact2}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Address</strong></td>
                                        <td>{supplier.address}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div className="coupon-detail">
                                <h4 className="sub-title">Add New Item<h5>(Add one by one)</h5></h4>

                                {/* Search box */}
                                <Row>
                                    <Col md={6} style={{ position: "relative" }}>
                                    <label>Select Item:</label>
                                    <Input
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search for item..."
                                    />

                                    {/* Dropdown positioned directly under input */}
                                    {dropdownOpen && filteredItems.length > 0 && (
                                        <div 
                                            className="dropdown-search"
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: 0,
                                                right: 0,
                                                backgroundColor: "white",
                                                border: "1px solid #ddd",
                                                zIndex: 1000,
                                                maxHeight: "200px",
                                                overflowY: "auto"
                                            }}
                                        >
                                            {filteredItems.map((item) => (
                                                <div
                                                    key={item.I_Id}
                                                    onClick={() => handleSelectItem(item)}
                                                    style={{
                                                        padding: "8px",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #eee"
                                                    }}
                                                >
                                                    {item.I_Id} - {item.I_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Col>
                                </Row>

                                {/* Display selected item details */}
                                {selectedItem && (
                                    <Row className="mt-2 align-items-center">
                                        <Col md={4}>
                                            <label>Selected Item: <strong>{selectedItem.I_name}</strong></label>
                                        </Col>
                                        <Col md={4}>
                                            <Input
                                                type="text"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="Enter cost"
                                            />
                                        </Col>
                                        <Col >
                                            <Button color="primary" className='mr-3 ml-3' onClick={handleAddItem}>Add</Button>
                                            <Button color="danger" className='mr-3 ml-3' onClick={handleClearSelection}>Clear</Button>
                                        </Col>
                                    </Row>
                                )}
                            </div>

                            <div className="coupon-detail">
                                <h4 className="sub-title">Supply Items</h4>

                                {/* 🔍 Search bar for filtering by Item ID or Item Name */}
                                <div style={{ marginBottom: "15px" }}>
                                    <input
                                        type="text"
                                        placeholder="Search by Item ID or Item Name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: "300px",
                                            padding: "8px",
                                            borderRadius: "6px",
                                            border: "1px solid #ccc",
                                        }}
                                    />
                                </div>

                                <Table bordered className="coupon-table">
                                    <thead>
                                        <tr>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>Cost Amount</th>
                                            <th>Warranty Period</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems1.map((item) => (
                                            <tr key={item.I_Id}>
                                                <td>{item.I_Id}</td>
                                                <td>{item.I_name}</td>

                                                {/* Cost column — editable when in edit mode */}
                                                <td>
                                                    {editingItemId === item.I_Id ? (
                                                        <Input
                                                            type="text"
                                                            value={editedCost}
                                                            onChange={(e) => setEditedCost(e.target.value)}
                                                            style={{ width: "120px" }}
                                                        />
                                                    ) : (
                                                        item.amount || item.unit_cost
                                                    )}
                                                </td>

                                                <td>{item.warrantyPeriod}</td>

                                                {/* Action buttons */}
                                                <td>
                                                    <Row className="justify-content-center" style={{ gap: "5px" }}>
                                                        <Col>
                                                            {editingItemId === item.I_Id ? (
                                                                <Button
                                                                    className="buttons"
                                                                    color="success"
                                                                    onClick={() => handleSaveClick(item)}
                                                                >
                                                                    💾
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    className="buttons"
                                                                    color="warning"
                                                                    onClick={() => handleEditClick(item)}
                                                                >
                                                                    ✏️
                                                                </Button>
                                                            )}
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                className="buttons"
                                                                color="danger"
                                                                onClick={() => handleRemoveSupplier(item.I_Id)}
                                                            >
                                                                🗑️
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            <div className="coupon-detail">
                                <h4 className="sub-title">Payment Details</h4>

                                {/* 🔹 Date Range Filter */}
                                <Row className="align-items-center mb-3">
                                    <Col md="3">
                                    <Label for="startDate">Start Date</Label>
                                    <Input
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    </Col>
                                    <Col md="3">
                                    <Label for="endDate">End Date</Label>
                                    <Input
                                        type="date"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    </Col>
                                    <Col md="3">
                                    <Button
                                        color="secondary"
                                        style={{ marginTop: "28px" }}
                                        onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                        }}
                                    >
                                        Clear Filter
                                    </Button>
                                    </Col>
                                </Row>

                                {/* 🔹 Payment List Table */}
                                <Table bordered className="coupon-table">
                                    <thead>
                                    <tr>
                                        <th>Purchase Note</th>
                                        <th>Date</th>
                                        <th>Delivery (Rs.)</th>
                                        <th>Amount (Rs.)</th>
                                        <th>Balance (Rs.)</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredPayments.length > 0 ? (
                                        filteredPayments.map((payment, index) => (
                                        <tr key={index}>
                                            <td>{payment.pc_Id}</td>
                                            <td>{formatDateForInput(payment.rDate)}</td>
                                            <td>Rs. {payment.deliveryCharge}</td>
                                            <td>Rs. {payment.total}</td>
                                            <td>Rs. {payment.balance}</td>
                                            <td>
                                            <Row className="justify-content-center" style={{ gap: "5px" }}>
                                                <Col>
                                                <Button className="buttons" onClick={() => handleViewOrder(payment.pc_Id)}>
                                                    👁️
                                                </Button>
                                                </Col>
                                                <Col>
                                                <Button className="buttons" onClick={() => handleOpenPaymentModal(payment)}>
                                                    💲
                                                </Button>
                                                </Col>
                                            </Row>
                                            </td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan="6" className="text-center">
                                            No payments available for this date range.
                                        </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </Table>
                                </div>
                            <Modal isOpen={showPaymentModal} toggle={() => setShowPaymentModal(false)}>
                                <ModalHeader toggle={() => setShowPaymentModal(false)}>Payment Details</ModalHeader>
                                <ModalBody>
                                    {selectedPayment && (
                                        <>
                                            <p><strong>Order ID:</strong> {selectedPayment.pc_Id}</p>
                                            <p><strong>Total Amount:</strong> Rs.{selectedPayment.total}</p>
                                            <FormGroup>
                                                <Label>Enter Payment Amount</Label>
                                                <Input
                                                    type="text"
                                                    value={paymentAmount}
                                                    onChange={handlePaymentAmountChange}
                                                />
                                            </FormGroup>
                                            <p><strong>Due Balance:</strong> Rs.{balanceAmount}</p>
                                        </>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={handlePaymentSettlement}>Settle Payment</Button>
                                    <Button color="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};
export default SupplierDetails;

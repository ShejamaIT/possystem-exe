import React, { useState, useEffect } from "react";
import { Container, Row, Col, Label, Input, Form, Table, Button,InputGroup, InputGroupText } from "reactstrap";

import { FaPlus } from 'react-icons/fa'; // FontAwesome Plus icon
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import "../style/PurchaseDetails.css";

const PurchaseDetails = () => {
    const [PurchaseId, setPurchaseId] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [supplierItems, setSupplierItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [DeliveryCharge, setDeliveryCharge] = useState("0");
    const [ItemTotal, setItemTotal] = useState("0");
    const [Invoice, setInvoiceId] = useState("");
    const [NetTotal, setNetTotal] = useState("0");
    const [selectedItemId, setSelectedItemId] = useState("");
    const [purchaseNotes, setPurchaseNotes] = useState([]);
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        fetchPurchaseID();
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const calculateItemTotal = () => {
            const total = selectedItems.reduce((acc, item) => {
                return acc + (item.unitPrice * item.quantity);
            }, 0);
            setItemTotal(total.toFixed(2)); // Set the total to two decimal places
        };
        calculateItemTotal();
    }, [selectedItems]);

    useEffect(() => {
        const netTotal = parseFloat(ItemTotal) + parseFloat(DeliveryCharge || 0);
        setNetTotal(netTotal.toFixed(2));
    }, [ItemTotal, DeliveryCharge]);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
        setDate(today);
    }, []);

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateStr; // already in correct format
    };

    const fetchPurchaseID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/newPurchasenoteID");
            const data = await response.json();
            if (data.PurchaseID) {
                setPurchaseId(data.PurchaseID);
            } else {
                toast.error("Server did not return a valid Purchase ID.");
            }
        } catch (err) {
            console.error("Error fetching Purchase ID:", err);
            toast.error("Failed to load Purchase ID.");
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/suppliers");
            const data = await response.json();
            if (data.success) {
                setSuppliers(data.suppliers);
            } else {
                toast.error(data.message || "Failed to load suppliers.");
            }
        } catch (err) {
            toast.error("Failed to load suppliers.");
        }
    };

    const fetchSupplierItems = async (supplierId) => {
        if (!supplierId) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/supplier-items?s_Id=${supplierId}`);
            const data = await response.json();
            if (data.success) {
                console.log(data.items);
                setSupplierItems(data.items);
            } else {
                setSupplierItems([]);
                toast.error(data.message || "No items found.");
            }
        } catch (err) {
            toast.error("Failed to load supplier items.");
        }
    };

    const handleSupplierChange = (event) => {
        const supplierId = event.target.value;
        setSelectedSupplier(supplierId);
        setSupplierItems([]);
        setSelectedItems([]);
        fetchSupplierItems(supplierId);
    };

    const handleItemChange = (item) => {
        if (!item) return;

        const isAlreadySelected = selectedItems.some(i => i.I_Id === item.I_Id);
        if (isAlreadySelected) {
            toast.warn("Item already added.");
            return;
        }

        setSelectedItems(prev => [
            ...prev,
            {
                ...item,
                quantity: 1,
                unitPrice: item.unit_cost,
                price: item.price
            }
        ]);

        setSearchTerm("");      // Clear search input
        setFilteredItems([]);   // Hide dropdown
    };

    const handleSearchChange = (e) => {
        fetchSupplierItems(selectedSupplier);
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (!value.trim()) {
            setFilteredItems([]);
        } else {
            const filtered = supplierItems.filter((item) =>
                item.I_Id.toString().toLowerCase().includes(value) ||
                item.I_name.toLowerCase().includes(value)
            );
            setFilteredItems(filtered);
        }
    };

    const handleQuantityChange = (index, event) => {
        const newSelectedItems = [...selectedItems];
        newSelectedItems[index].quantity = parseInt(event.target.value, 10) || 0;
        setSelectedItems(newSelectedItems);
    };

    const handleDeliveryChargeChange = (e) => {
        const value = e.target.value;

        // Allow only digits and decimal point (but not multiple decimals)
        if (/^\d*\.?\d*$/.test(value)) {
            setDeliveryCharge(value);
        }
    };

    const handleInvoiceChange = (e) => {
        setInvoiceId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            purchaseNotes: purchaseNotes // Include the array of notes here
        };
        console.log(JSON.stringify(payload));
        try {
            // Send data to the backend
            const response = await fetch("http://localhost:5001/api/admin/main/addStock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload), // Send as JSON
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Purchase saved successfully!");
                setSelectedItems([]); // Clear selected items after successful submission
                fetchPurchaseID();
                setTimeout(() => {
                    window.location.reload(); // Auto-refresh the page
                }, 1000);
            } else {
                toast.error(result.message || "Failed to save purchase.");
                console.log(result.error);

            }
        } catch (err) {
            console.error("Error saving purchase:", err);
            toast.error("Error saving purchase.");
        }
    };

    const passToPurchaseNote = () => {
        const netTotal = Number(ItemTotal) + Number(DeliveryCharge);
        if (!selectedSupplier || selectedItems.length === 0) {
            toast.error("Please fill in all fields before passing to table.");
            return;
        }
        const note = {
            purchase_id: PurchaseId,
            supplier_id: selectedSupplier,
            date: formatDateForInput(date),
            time: currentTime,
            itemTotal: parseFloat(ItemTotal || 0).toFixed(2),
            delivery: parseFloat(DeliveryCharge || 0).toFixed(2),
            invoice: Invoice || "-",
            netTotal: parseFloat(netTotal).toFixed(2),
            items: selectedItems.map(item => ({
                I_Id: item.I_Id,
                material: item.material,
                color: item.color,
                unit_price: parseFloat(item.unitPrice || 0).toFixed(2),
                price: parseFloat(item.price || 0).toFixed(2),
                quantity: item.quantity,
                total_price: (parseFloat(item.unitPrice || 0) * item.quantity).toFixed(2)
            })),
        };

        setPurchaseNotes(prevNotes => [...prevNotes, note]);
        setSelectedItems([]);
        console.log(purchaseNotes);
        // Manually increment purchase ID
        const newId = generateNextPurchaseId(PurchaseId);
        setPurchaseId(newId);
        setSelectedSupplier("");
        setDeliveryCharge("0");
        setInvoiceId("");
        setItemTotal("0");
        setNetTotal("0");
        
    };

    const generateNextPurchaseId = (currentId) => {
        const prefix = currentId.split("_")[0]; // "PX"
        const numPart = currentId.split("_")[1]; // "005"
        const nextNum = String(parseInt(numPart, 10) + 1).padStart(numPart.length, "0"); // "006"
        return `${prefix}_${nextNum}`; // "PX_006"
    };
    
    const handleClear = () => {
        setSelectedSupplier("");
        setSelectedItems([]);
        setDeliveryCharge("0");
        setInvoiceId("");
        setItemTotal("0");
        setNetTotal("0");
        setPurchaseNotes([]);
    };
    const handleRemoveItem = (indexToRemove) => {
        const updatedItems = selectedItems.filter((_, index) => index !== indexToRemove);
        setSelectedItems(updatedItems);
    };

    return (
    <Helmet title="Purchase Items">
        <section>
            <Container className="purchase-item-container">
                <Row>
                    <Col>
                        <h3 className="text-center mb-4">Purchase Invoice</h3>
                        <Form>
                            <Row className="mb-3">
                                <Col>
                                    <h5 className="text-center section-title">Purchase Note Detail</h5>
                                    <hr />
                                </Col>
                            </Row>

                            <Row className="d-flex gap-4 mb-4">
                                <Col>
                                    <p><strong>Purchase ID:</strong> {PurchaseId}</p>
                                    <Label><strong>Supplier:</strong></Label>
                                    <Input type="select" value={selectedSupplier} onChange={handleSupplierChange}>
                                        <option value="">Select a Supplier</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.s_ID} value={supplier.s_ID}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                                <Col>
                                    <Label><strong>Date:</strong></Label>
                                    <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    />
                                    <p><strong>Time:</strong> {currentTime}</p>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <Label><strong>Items:</strong></Label>
                                    <InputGroup>
                                        <Input
                                            type="text"
                                            placeholder="Search items"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            disabled={!selectedSupplier}
                                            style={{ flex: 4 }}
                                        />
                                    </InputGroup>

                                    {/* Filtered Dropdown */}
                                    {searchTerm && filteredItems.length > 0 && (
                                        <div className="border rounded bg-white shadow-sm max-h-40 overflow-auto">
                                            {filteredItems.map((item) => (
                                                <div
                                                    key={item.I_Id}
                                                    onClick={() => handleItemChange(item)}
                                                    className="dropdown-item px-3 py-2 border-bottom cursor-pointer hover:bg-light"
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {item.I_name} - Rs.{item.unit_cost}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            {selectedItems.length > 0 && (
                                <table className="table mt-4">
                                    <thead>
                                        <tr>
                                            <th>Item ID</th>
                                            <th>Name</th>
                                            <th>Color</th>
                                            <th>Cost</th>
                                            <th>Qty</th>
                                            <th>Total</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.I_Id}</td>
                                                <td>{item.I_name}</td>
                                                <td>{item.color || "N/A"}</td>
                                                <td>{item.unitPrice}</td>
                                                <td>
                                                    <Input
                                                        type="text"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(index, e)}
                                                    />
                                                </td>
                                                <td>{(item.unitPrice * item.quantity).toFixed(2)}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="remove-btn"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <Row className="mb-3">
                                <Col>
                                    <Label><strong>Delivery Charges:</strong></Label>
                                    <Input type="text" value={DeliveryCharge} onChange={handleDeliveryChargeChange} />
                                </Col>
                                <Col>
                                    <Label><strong>Invoice ID:</strong></Label>
                                    <Input type="text" value={Invoice} onChange={handleInvoiceChange} />
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col>
                                    <h5>Item Total: Rs.{ItemTotal}</h5>
                                    <h5>Delivery Fee: Rs.{DeliveryCharge}</h5>
                                    <h5>Net Total: Rs.{NetTotal}</h5>
                                </Col>
                            </Row>

                            <Button color="secondary" block onClick={passToPurchaseNote}>Pass to Purchase Note</Button>

                            <table className="table mt-4">
                                <thead>
                                    <tr>
                                        <th>Supplier ID</th>
                                        <th>Invoice</th>
                                        <th>Delivery</th>
                                        <th>Item ID</th>
                                        <th>Material</th>
                                        <th>Unit Price</th>
                                        <th>Qty</th>
                                        <th>Item Total</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseNotes.map((note, noteIndex) =>
                                        note.items.map((item, itemIndex) => (
                                            <tr key={`${noteIndex}-${itemIndex}`}>
                                                {itemIndex === 0 && (
                                                    <>
                                                        <td rowSpan={note.items.length}>{note.supplier_id}</td>
                                                        <td rowSpan={note.items.length}>{note.invoice}</td>
                                                        <td rowSpan={note.items.length}>{note.delivery}</td>
                                                    </>
                                                )}
                                                <td>{item.I_Id}</td>
                                                <td>{item.material}</td>
                                                <td>{item.unit_price}</td>
                                                <td>{item.quantity}</td>
                                                
                                                {itemIndex === 0 && (
                                                    <>
                                                        <td rowSpan={note.items.length}>{note.itemTotal}</td>
                                                        <td rowSpan={note.items.length}>{parseFloat(note.netTotal).toFixed(2)}</td>
                                                        <td rowSpan={note.items.length}>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setPurchaseNotes(prev =>
                                                                        prev.filter((_, i) => i !== noteIndex)
                                                                    )
                                                                }
                                                                className="remove-btn"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            <Row className="mt-4">
                                <Col md="6">
                                    <Button color="primary" block onClick={handleSubmit}>Save Purchase</Button>
                                </Col>
                                <Col md="6">
                                    <Button color="danger" block onClick={handleClear}>Clear</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </section>
    </Helmet>
);

};

export default PurchaseDetails;

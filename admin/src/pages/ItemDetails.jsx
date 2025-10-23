import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import { Container,Table, Row, Col, Button, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter,Nav, NavItem, NavLink ,TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar/Navbar";
import "../style/ItemDetails.css";
import Swal from "sweetalert2";

const ItemDetails = () => {
    const { id } = useParams(); // Get item ID from URL
    const [item, setItem] = useState(null);
    const [stock, setStock] = useState(null);
    const [previousId, setPreviousId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [suppliers, setSuppliers] = useState([]); // State to store supplier data
    const [suppliers1, setSuppliers1] = useState([]); 
    const [formData, setFormData] = useState({}); // Stores editable fields
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showStockModal, setShowStockModal] = useState(false);
    const [subCatOne, setSubCatOne] = useState([]);
    const [subCatTwo, setSubCatTwo] = useState([]);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [stockData, setStockData] = useState({itemId:id, supplierId: "", stockCount: "", date: "", cost:"", comment:""});
    const [supplierData, setSupplierData] = useState({supplierName: "", contactInfo: "", cost:""});
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showStockModal1, setShowStockModal1] = useState(false);
    const [suppliers2, setSuppliers2] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [unitCost, setUnitCost] = useState("");
    const [date, setDate] = useState("");
    const [stockCount, setStockCount] = useState(1);
    const [itemForStock, setItemIdForStock] = useState("");
    const [totalCost, setTotalCost] = useState(0);
    const [PurchaseId, setPurchaseId] = useState("");
    const [activeTab, setActiveTab] = useState("1");
    const [categories, setCategories] = useState([]);

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
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
            setPurchaseId(data.PurchaseID);
        } catch (err) {
            toast.error("Failed to load Purchase ID.");
        }
    };
    useEffect(() => {
        fetchCategories();fetchPurchaseID();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/categories");
            const data = await response.json();
            console.log(data);
            setCategories(data.data.length > 0 ? data.data : []);
        } catch (err) {
            toast.error("Failed to load categories.");
        }
    };

    // Fetch suppliers for this item
    useEffect(() => {
        if (!showStockModal1) return;

        const fetchSuppliers = async () => {
            const res = await fetch(`http://localhost:5001/api/admin/main/item-suppliers?I_Id=${id}`);
            const data = await res.json();
            setSuppliers2(data.suppliers || []);
        };

        fetchSuppliers();
    }, [showStockModal1]);

    const handleSupplierChange1 = async (e) => {
        const supplierId = e.target.value;
        setSelectedSupplier(supplierId);

        const res = await fetch(`http://localhost:5001/api/admin/main/find-cost?s_ID=${supplierId}&I_Id=${id}`);
        const data = await res.json();

        if (data.cost?.unit_cost) {
            setUnitCost(data.cost.unit_cost);
            setTotalCost(data.cost.unit_cost * stockCount);
        }
    };

    useEffect(() => {
        setTotalCost(unitCost * stockCount);
    }, [unitCost, stockCount]);
    const handleAddStock = () => {
        const stockData = {
            purchase_id: PurchaseId,
            date: formatDateForInput(date),
            time: currentTime,
            supplier_id: selectedSupplier,
            itemTotal: totalCost,
            delivery: 0,
            invoice: "",
            items: [
                {
                    I_Id: item.I_Id,
                    material: item.material,
                    color: item.color || "N/A",
                    unit_price: unitCost,
                    price: unitCost,
                    quantity: stockCount,
                    total_price: totalCost.toFixed(2)
                }
            ],
        };
        onAddStock(stockData);
        setShowStockModal(false);
    };

    const onAddStock = async (stockData) => {
        try {
            const formData = new FormData();

            // ✅ Must be an array, stringified
            formData.append("purchaseNotes", JSON.stringify([stockData]));

            const response = await fetch("http://localhost:5001/api/admin/main/addStock", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setShowStockModal1(false);
                toast.success("✅ Stock added successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.error("❌ Stock add failed:", result.message);
                alert("Failed to add stock: " + result.message);
            }
        } catch (error) {
            console.error("⚠️ Error during stock add:", error);
            alert("Server error while adding stock.");
        }
    };

    useEffect(() => {
        if (formData.maincategory) {
            fetch(`http://localhost:5001/api/admin/main/SubCatNames?categoryName=${formData.maincategory}`)
                .then((res) => res.json())
                .then((data) => {
                    setSubCatOne(data.data);
                    setSubCatTwo([]);
                    setFormData((prev) => ({ ...prev, sub_one: "", sub_two: "" }));
                })
                .catch(() => toast.error("Failed to load subcategories."));
        }
    }, [formData.maincategory]);

    useEffect(() => {
        if (formData.sub_one) {
            const selectedSubCatOne = subCatOne.find((cat) => cat.subCatOneId === formData.sub_one);
            setSubCatTwo(selectedSubCatOne ? selectedSubCatOne.subCatTwo : []);
            setFormData((prev) => ({ ...prev, sub_two: "" }));
        }
    }, [formData.sub_one, subCatOne]);

    const handleSupplierSelect = (e) => {
        const selectedSupplierID = e.target.value;

        // Find the selected supplier from the list
        const selectedSupplier = suppliers1.find(supplier => supplier.s_ID === selectedSupplierID);

        if (selectedSupplier) {
            setSupplierData(prevState => ({
                ...prevState,
                supplierID: selectedSupplier.s_ID,
                supplierName: selectedSupplier.name,
                contactInfo: selectedSupplier.contact,
                cost: selectedSupplier.cost || "",  // Ensure cost is updated too
            }));
        }
    };

    const handleSupplierChange = (e) => {
        const { name, value } = e.target;
        setSupplierData(prev => ({ ...prev, [name]: value }));
    };

    const updateStatus = async (pid_Id, newStatus) => {
        if (!pid_Id || !newStatus) {
            toast.error("❌ Missing Stock ID or Status.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/update-stock-status", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pid_Id, status: newStatus }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("✅ Status updated successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(result.message || "❌ Failed to update status.");
            }
        } catch (err) {
            console.error("❌ Status update error:", err);
            toast.error("❌ Error updating stock status. Please try again.");
        }
    };

    // Single item delete
    const deleteStock = async (pid_Id) => {
        if (!window.confirm("Are you sure you want to delete this stock item?")) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/delete-one-stock/${pid_Id}`, {
                method: "DELETE",
            });

            const res = await response.json();

            if (res.success) {
                setStock((prev) => prev.filter((item) => item.pid_Id !== pid_Id));
                toast.success("✅ Stock deleted successfully!");
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1000);
            } else {
                alert(res.message || "Failed to delete stock.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Error deleting stock item.");
        }
    };

    // Bulk delete
    const deleteSelectedStocks = async () => {
        if (selectedItems.length === 0) return;
        if (!window.confirm(`Delete ${selectedItems.length} selected stock item(s)?`)) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/delete-more-stock/delete-multiple`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pid_Ids: selectedItems }),
            });

            const result = await response.json();

            if (result.success) {
                setStock((prev) => prev.filter((item) => !selectedItems.includes(item.pid_Id)));
                toast.success("✅ Stocks deleted successfully!");
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1000);
            } else {
                alert(`${result.failed?.length || 0} item(s) failed to delete.`);
            }

            setSelectedItems([]);
            setDeleteMode(false);
        } catch (err) {
            console.error("Bulk delete error:", err);
            alert("Error deleting stock items.");
        }
    };

    const handleAddSupplier = async () => {
        const cost = parseFloat(supplierData.cost);
        try {
            // Assuming you want to save the item-supplier association
            const response = await fetch("http://localhost:5001/api/admin/main/add-item-supplier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    I_Id: item.I_Id,
                    s_ID: supplierData.supplierID,
                    cost: cost,
                }),
            });
        
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            if (data.success) {
                toast.success("Item-Supplier association added successfully!");
                setShowSupplierModal(false); // Close the modal after adding
                fetchItem();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error adding item-supplier association");
        }
    };

    const handleSave = async () => {
        try {
            // Prepare payload for JSON
            const payload = { ...formData, previousId };

            // Convert suppliers array to JSON string if necessary
            if (Array.isArray(payload.suppliers)) {
                payload.suppliers = JSON.stringify(payload.suppliers);
            }

            // Send PUT request as JSON
            const updateResponse = await fetch("http://localhost:5001/api/admin/main/update-item", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const updateResult = await updateResponse.json();

            if (updateResponse.ok && updateResult.success) {
                toast.success("✅ Item updated successfully!");

                // Refresh item data if needed
                fetchItem1(updateResult.data.I_Id);
                setIsEditing(false);
                setFormData(updateResult.data);
                setPreviousId(null);
            } else {
                console.error("❌ Error updating item:", updateResult.message);
                toast.error(updateResult.message || "Failed to update item.");
            }

        } catch (error) {
            console.error("❌ Error updating item:", error);
            toast.error("Error updating item: " + error.message);
        }
    };

    useEffect(() => {
        fetchItem();
    }, [id]);

    // Fetch all suppliers when the modal opens
    useEffect(() => {
        const fetchAllSuppliers = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/admin/main/suppliers");
                if (!response.ok) throw new Error("Failed to fetch suppliers");
                const data = await response.json();
                if (data.success) {
                    setSuppliers1(data.suppliers); // Set the suppliers list
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Error loading suppliers");
            }
        };

        if (showSupplierModal) {
            fetchAllSuppliers();
        }
    }, [showSupplierModal]); // Re-run this when the modal is opened

    const fetchItem = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/item-details?I_Id=${id}`);
            if (!response.ok) throw new Error("Failed to fetch item details.");
            const data = await response.json();
            console.log(data);
            const response1 = await fetch(`http://localhost:5001/api/admin/main/orders/by-item/${id}`);
            const data1 = await response1.json();
            setItem(data.item);
            setSuppliers(data.item.suppliers || []);
            setStock(data.item.stockDetails || []);
            setOrders(data1 || []);
            setFormData(data.item);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching item details:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchItem1 = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/item-details?I_Id=${itemId}`);
            if (!response.ok) throw new Error("Failed to fetch item details.");

            const data = await response.json();
            setItem(data.item);
            setSuppliers(data.item.suppliers || []);
            setStock(data.item.stockDetails || []);
            setFormData(data.item);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching item details:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleChange = (e, supplierId) => {
        const { name, value, type, files } = e.target;

        // If the field is a file, handle image upload
        if (type === "file" && files) {
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [name]: reader.result.split(',')[1], // Removing the "data:image/png;base64," part
                }));
            };

            reader.readAsDataURL(file);
        } else {
            // Handle regular text input changes
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }

        // Update the specific supplier's data in the suppliers array
        setSuppliers((prevSuppliers) =>
            prevSuppliers.map((supplier) =>
                supplier.s_ID === supplierId
                    ? { ...supplier, [name]: value } // Update the supplier's cost
                    : supplier
            )
        );

        // Also update the supplier information in formData
        setFormData((prevFormData) => ({
            ...prevFormData,
            suppliers: prevFormData.suppliers.map((supplier) =>
                supplier.s_ID === supplierId
                    ? { ...supplier, [name]: value } // Update the supplier's cost in the formData
                    : supplier
            )
        }));
    };

    const handleRemoveSupplier = async (supplierId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
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
                `http://localhost:5001/api/admin/main/item-suppliers/${id}/${supplierId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                fetchItem();
                toast.success("Supplier Removed Successfully!")
                
            } else {
                toast.error("Could not delete supplier.!")
            
            }
        } catch (error) {
            console.error("Error removing supplier:", error);
            toast.error("Something went wrong.!");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!item) return <p>Item not found</p>;

    return (
        <Helmet title={`Item Details - ${item.I_name}`}>
            <section>
                <Row>
                    <NavBar />
                </Row>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h4 className="mb-3 text-center topic">Item #{item.I_Id} Details</h4>
                            <div className="item-details">
                                {/* General Item Info */}
                                <div className="item-header">
                                    <h5 className="mt-4">General Details</h5>
                                    <div className="item-general">
                                        <Row>
                                            <Col>
                                                {!isEditing ? (
                                                    <p><strong>Item Code:</strong> {item.I_Id}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Item Code:</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="I_Id"
                                                            className="large-input"
                                                            value={formData.I_Id}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                )}
                                                {!isEditing ? (
                                                    <p><strong>Item Name:</strong> {item.I_name}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Item Name:</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="I_name"
                                                            value={formData.I_name}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                )}
                                                
                                                {!isEditing ? (
                                                    <p><strong>Price:</strong> Rs. {item.price}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Price:</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="price"
                                                            value={formData.price}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                )}
                                                
                                                
                                            </Col>
                                        </Row>
                                        {/* Category Name */}
                                        <Row>
                                            <Col>
                                                {!isEditing ? (
                                                    <p><strong>Description:</strong> {item.descrip}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Description:</strong></Label>
                                                        <Input
                                                            type="textarea"
                                                            name="descrip"
                                                            value={formData.descrip}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                )}
                                                {!isEditing ? (
                                                    <p><strong>Material:</strong> {item.material}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Material:</strong></Label>
                                                        <Input
                                                            type="select"
                                                            name="material"
                                                            value={formData.material}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Material</option>
                                                            <option value="Teak">Teak</option>
                                                            <option value="Mahogani">Mahogani</option>
                                                            <option value="Mara">Mara</option>
                                                            <option value="Attoriya">Attoriya</option>
                                                            <option value="Sapu">Sapu</option>
                                                            <option value="Steel">Steel</option>
                                                            <option value="MDF">MDF</option>
                                                            <option value="MM">MM</option>
                                                            <option value="Mattress">Mattress</option>
                                                            <option value="Other">Other</option>
                                                        </Input>
                                                    </FormGroup>
                                                )}
                                                {!isEditing ? (
                                                    <p><strong>Color:</strong> {item.color}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Color:</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="color"
                                                            value={formData.color}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                )}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {!isEditing ? (
                                                    <p><strong>Min Quantity:</strong> {item.minQTY}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Min Quantity:</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="minQTY"
                                                            value={formData.minQTY}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                )}
                                                {!isEditing ? (
                                                    <p><strong>Warranty Period:</strong> {item.warrantyPeriod}</p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Warranty Period:</strong></Label>
                                                        <Input
                                                            type="text"
                                                            name="warrantyPeriod"
                                                            value={formData.warrantyPeriod}
                                                            onChange={handleChange}
                                                        />
                                                    </FormGroup>
                                                )}
                                                {!isEditing ? (
                                                    <p>
                                                        <strong>Category:</strong> {item.type ? item.type : "None"}
                                                    </p>
                                                ) : (
                                                    <FormGroup>
                                                        <Label><strong>Category:</strong></Label>
                                                        <Input
                                                            type="select"
                                                            name="type"
                                                            value={formData.type || ""}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select Category</option>
                                                            {categories.map((cat) => (
                                                                <option key={cat.Ca_Id} value={cat.name}>
                                                                    {cat.name}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </FormGroup>
                                                )}

                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Row>
                                        {/* ===== LEFT: STOCK INFO ===== */}
                                        <Col lg="6" md="12">
                                        <div className="p-3 border rounded bg-light shadow-sm">
                                            <h5 className="mb-3">Stock Information</h5>
                                            <Table bordered hover responsive className="align-middle">
                                            <tbody>
                                                <tr>
                                                <td><strong>Stock Quantity</strong></td>
                                                <td>
                                                    {!isEditing ? (
                                                    item.stockQty
                                                    ) : (
                                                    <Input
                                                        type="text"
                                                        name="stockQty"
                                                        value={formData.stockQty}
                                                        onChange={handleChange}
                                                        bsSize="sm"
                                                    />
                                                    )}
                                                </td>
                                                <td><strong>Available Quantity</strong></td>
                                                <td>
                                                    {!isEditing ? (
                                                    item.availableQty
                                                    ) : (
                                                    <Input
                                                        type="text"
                                                        name="availableQty"
                                                        value={formData.availableQty}
                                                        onChange={handleChange}
                                                        bsSize="sm"
                                                    />
                                                    )}
                                                </td>
                                                </tr>

                                                <tr>
                                                <td><strong>Booked Quantity</strong></td>
                                                <td>
                                                    {!isEditing ? (
                                                    item.bookedQty
                                                    ) : (
                                                    <Input
                                                        type="text"
                                                        name="bookedQty"
                                                        value={formData.bookedQty}
                                                        onChange={handleChange}
                                                        bsSize="sm"
                                                    />
                                                    )}
                                                </td>
                                                <td><strong>Damage Quantity</strong></td>
                                                <td>
                                                    {!isEditing ? (
                                                    item.damageQty
                                                    ) : (
                                                    <Input
                                                        type="text"
                                                        name="damageQty"
                                                        value={formData.damageQty}
                                                        onChange={handleChange}
                                                        bsSize="sm"
                                                    />
                                                    )}
                                                </td>
                                                </tr>

                                                <tr>
                                                <td><strong>Reserved Quantity</strong></td>
                                                <td>
                                                    {!isEditing ? (
                                                    item.reservedQty
                                                    ) : (
                                                    <Input
                                                        type="text"
                                                        name="reservedQty"
                                                        value={formData.reservedQty}
                                                        onChange={handleChange}
                                                        bsSize="sm"
                                                    />
                                                    )}
                                                </td>
                                                <td><strong>Dispatched Quantity</strong></td>
                                                <td>
                                                    {!isEditing ? (
                                                    item.dispatchedQty
                                                    ) : (
                                                    <Input
                                                        type="text"
                                                        name="dispatchedQty"
                                                        value={formData.dispatchedQty}
                                                        onChange={handleChange}
                                                        bsSize="sm"
                                                    />
                                                    )}
                                                </td>
                                                </tr>
                                            </tbody>
                                            </Table>
                                        </div>
                                        </Col>

                                        {/* ===== RIGHT: SUPPLIERS ===== */}
                                        <Col lg="6" md="12">
                                        <div className="p-3 border rounded bg-light shadow-sm">
                                            <h5 className="mb-3">Supplier List</h5>
                                            <Table bordered hover responsive className="align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                <th>Supplier ID</th>
                                                <th>Name</th>
                                                <th>Unit Cost</th>
                                                <th style={{ width: "100px", textAlign: "center" }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {suppliers.length > 0 ? (
                                                suppliers.map((supplier) => (
                                                    <tr key={supplier.s_ID}>
                                                    <td>{supplier.s_ID}</td>
                                                    <td>{supplier.name}</td>
                                                    <td>
                                                        {!isEditing ? (
                                                        supplier.unit_cost
                                                        ) : (
                                                        <Input
                                                            type="text"
                                                            name="unit_cost"
                                                            value={supplier.unit_cost}
                                                            onChange={(e) => handleChange(e, supplier.s_ID)}
                                                            bsSize="sm"
                                                        />
                                                        )}
                                                    </td>
                                                    <td className="text-center">
                                                        <Button
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveSupplier(supplier.s_ID)}
                                                        >
                                                        🗑️
                                                        </Button>
                                                    </td>
                                                    </tr>
                                                ))
                                                ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted">
                                                    No suppliers found
                                                    </td>
                                                </tr>
                                                )}
                                            </tbody>
                                            </Table>
                                        </div>
                                        </Col>
                                    </Row>
                                    </div>


                                {/* Buttons */}
                                <div className="text-center mt-4">
                                    {!isEditing ? (
                                        <>
                                            <Button
                                                color="primary"
                                                className="ms-3"
                                                onClick={() => {
                                                    setPreviousId(item.I_Id);     // store original ID
                                                    setFormData(item);            // populate form with item values
                                                    setIsEditing(true);           // toggle edit mode
                                                }}
                                            >
                                                Edit Item
                                            </Button>

                                            <Button
                                                color="secondary"
                                                className="ms-3"
                                                onClick={() => setShowSupplierModal(true)}
                                            >
                                                Add Supplier
                                            </Button>

                                            <Button
                                                color="info"
                                                className="ms-3"
                                                onClick={() => {
                                                    setItemIdForStock(item.I_Id); // You should manage item ID in state for modal use
                                                    setShowStockModal1(true);
                                                }}
                                            >
                                                Add Stock
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button color="success" onClick={handleSave}>Save Changes</Button>
                                            <Button
                                                color="secondary"
                                                className="ms-3"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>

                            </div>
                            {/* Add Supplier Modal */}
                            <Modal isOpen={showSupplierModal} toggle={() => setShowSupplierModal(!showSupplierModal)}>
                                <ModalHeader toggle={() => setShowSupplierModal(!showSupplierModal)}>Add Supplier</ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label>Supplier ID</Label>
                                        <Input
                                            type="select"
                                            name="supplierID"
                                            value={supplierData.supplierID}
                                            onChange={handleSupplierSelect} // Handle supplier ID selection
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers1.map((supplier) => (
                                                <option key={supplier.s_ID} value={supplier.s_ID}>
                                                    {supplier.s_ID} - {supplier.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <p>
                                            <Label>Supplier Name : </Label>{supplierData.supplierName}
                                        </p>

                                    </FormGroup>
                                    <FormGroup>
                                        <p>
                                            <Label>Contact Info : </Label><strong>{supplierData.contactInfo}</strong>
                                        </p>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Cost</Label>
                                        <Input
                                            type="text"
                                            name="cost"
                                            value={supplierData.cost}
                                            onChange={handleSupplierChange} // Now using correct function
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={handleAddSupplier}>Add Supplier</Button>
                                    <Button color="secondary" onClick={() => setShowSupplierModal(false)}>Cancel</Button>
                                </ModalFooter>
                            </Modal>

                            <Modal isOpen={showStockModal1} toggle={() => setShowStockModal1(!showStockModal1)}>
                                <ModalHeader toggle={() => setShowStockModal1(!showStockModal1)}>Add Stock</ModalHeader>
                                <ModalBody>
                                    <FormGroup>
                                        <Label>Supplier</Label>
                                        <Input
                                            type="select"
                                            value={selectedSupplier}
                                            onChange={handleSupplierChange1}
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.s_ID} value={supplier.s_ID}>
                                                    {supplier.s_ID} - {supplier.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Unit Cost</Label>
                                        <Input type="text" value={unitCost} disabled />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Quantity</Label>
                                        <Input
                                            type="text"
                                            value={stockCount}
                                            onChange={(e) => setStockCount(e.target.value)}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Total Cost</Label>
                                        <Input type="text" value={totalCost} disabled />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Date</Label>
                                        <Input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={handleAddStock}>Add Stock</Button>
                                    <Button color="secondary" onClick={() => setShowStockModal1(false)}>Cancel</Button>
                                </ModalFooter>
                            </Modal>

                        </Col>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === "1" })}
                                    onClick={() => toggle("1")}
                                >
                                    Stock Details
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === "2" })}
                                    onClick={() => toggle("2")}
                                >
                                Booked orders
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            {/* --- Stock Details Tab --- */}
                            <TabPane tabId="1">
                                <Col lg="12">
                                <h4 className="mb-3 text-center topic">Stock Details</h4>

                                {/* Delete mode toggle button */}
                                <div className="mb-3 text-end">
                                    {!deleteMode ? (
                                        <button className="btn btn-warning" onClick={() => setDeleteMode(true)}>
                                            Delete One
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary me-2" onClick={() => {
                                            setDeleteMode(false);
                                            setSelectedItems([]);
                                        }}>
                                            Cancel
                                        </button>
                                    )}
                                    {deleteMode && selectedItems.length > 0 && (
                                        <button className="btn btn-danger ms-2" onClick={deleteSelectedStocks}>
                                            Delete Selected
                                        </button>
                                    )}
                                </div>

                                <div className="item-details">
                                    {stock && stock.length > 0 ? (
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                            <tr>
                                                {deleteMode && <th>Select</th>}
                                                <th>ID</th>
                                                <th>Stock ID</th>
                                                <th>Batch ID</th>
                                                <th>Status</th>
                                                <th>Order Ref</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {stock.map((stockItem, index) => (
                                                <tr key={stockItem.pid_Id}>
                                                    {deleteMode && (
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.includes(stockItem.pid_Id)}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    setSelectedItems((prev) =>
                                                                        isChecked
                                                                            ? [...prev, stockItem.pid_Id]
                                                                            : prev.filter((id) => id !== stockItem.pid_Id)
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    )}
                                                    <td>{stockItem.pid_Id}</td>
                                                    <td>{stockItem.stock_Id}</td>
                                                    <td>{stockItem.pc_Id}</td>
                                                    <td>
                                                        <select
                                                            value={stockItem.status || "Available"}
                                                            onChange={(e) => {
                                                                const newStatus = e.target.value;
                                                                setStock((prevStock) => {
                                                                    const updatedStock = [...prevStock];
                                                                    updatedStock[index] = {
                                                                        ...updatedStock[index],
                                                                        status: newStatus,
                                                                    };
                                                                    return updatedStock;
                                                                });
                                                            }}
                                                            className="form-control"
                                                        >
                                                            <option value="Available">Available</option>
                                                            <option value="Reserved">Reserved</option>
                                                            <option value="Damage">Damage</option>
                                                        </select>
                                                    </td>
                                                    <td>{stockItem.orderRef}</td>
                                                    <td>
                                                        <Row>
                                                            <Col lg={6}>
                                                                <button
                                                                    className="btn btn-sm btn-primary w-100"
                                                                    onClick={() => updateStatus(stockItem.pid_Id, stockItem.status)}
                                                                >
                                                                    Update
                                                                </button>
                                                            </Col>
                                                            <Col lg={6}>
                                                                <button
                                                                    className="btn btn-sm btn-danger w-100"
                                                                    onClick={() => deleteStock(stockItem.pid_Id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </Col>
                                                        </Row>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-center">No stock details available</p>
                                    )}
                                </div>
                                </Col>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={activeTab}>
                            {/* --- Booked Orders Tab --- */}
                            <TabPane tabId="2">
                                <Col lg="12">
                                    <h4 className="mb-3 text-center topic">Booked Orders</h4>
                                    <div className="item-details">
                                        {orders && orders.length > 0 ? (
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Bill Number</th>
                                                        <th>Total</th>
                                                        <th>Expected Date</th>
                                                        <th>Order Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map((order) => (
                                                        <tr key={order.OrID}>
                                                            <td>{order.OrID}</td>
                                                            <td>{order.billnumber}</td>
                                                            <td>{order.total}</td>
                                                            <td>
                                                                {new Date(order.expectedDate).toLocaleDateString()}
                                                            </td>
                                                            <td>{order.orStatus}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p className="text-center">No booked orders available</p>
                                        )}
                                    </div>
                                </Col>
                            </TabPane>
                        </TabContent>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default ItemDetails;
import React, {useState, useEffect, useRef} from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { toast } from "react-toastify";
import { Container, Row, Col, Form, FormGroup, Label,Table, Input, Button, ModalHeader, ModalBody, ModalFooter, Modal, Card, CardBody, CardTitle, CardText} from "reactstrap";
 import "../style/placeorder.css";
import AddNewItem from "../pages/AddNewItem";
import AddNewCoupone from "../pages/AddNewCoupone";
import AddNewBank from "../pages/AddNewBank";
import AddNewAccountNumber from "../pages/AddNewAccountNumber";
import Helmet from "../components/Helmet/Helmet";
import Swal from "sweetalert2";
import FinalInvoice1 from "./FinalInvoice1";
import MakeDeliveryNoteNow from "./MakeDeliveryNoteNow";
import ReceiptView from "./ReceiptView";
import DeliveryNoteViewNow from "./DeliveryNoteViewNow";
import { v4 as uuidv4 } from 'uuid';
import MakeGatePassNow from "./MakeGatePassNow";
import GatePassView from "./GatepassView";

const OrderInvoice = ({ onPlaceOrder }) => {
    const [formData, setFormData] = useState({c_ID:"",title:"",FtName: "", SrName: "", phoneNumber: "",occupation:"",workPlace:"",issuable:"",payment:"", subPayment: '',billNumber: null, 
        otherNumber: "", address: "", city: "",orderDate:"", district: "", specialNote: "", dvStatus: "", expectedDate: "", couponCode: "",balance:"",advance:"", courierCharge:""});
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [sellingPrice, setSellingPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItems1, setSelectedItems1] = useState([]);
    const [selectedItem2 , setSeletedItem2] = useState([]);
    const selectedItem2Ref = useRef([]);
    const [selectedItemsQty, setSelectedItemsQTY] = useState([]);
    const [interestValue , setInterestValue] = useState(0);
    const [rate , setRate] = useState(0);
    const [netAmount , setNetAmount] = useState(0);
    const [orderId , setOrderID] = useState("");
    const [transferBank , setTranferBank] = useState("");
    const [transferAccount , setTransferAccount] = useState("");
    const [chequeAmount , setChequeAmount] = useState(0);
    const [bank , setBank] = useState("");
    const [branch , setBranch] = useState("");
    const [chequeNumber , setChequeNumber] = useState("");
    const [accountNumber , setAccountNumber] = useState("");
    const [chequeDate , setChequeDate] = useState("");
    const [combinedCardBalance , setCombinedCardBalance] = useState(0);
    const [combinedChequeBalance , setCombinedChequeBalance] = useState(0);
    const [combinedCreditBalance , setCombinedCreditBalance] = useState(0);
    const [combinedTransferBalance , setCombinedTranferBalance] = useState(0);
    const [cardPortion, setCardPortion] = useState(0);
    const [chequePortion, setChequePortion] = useState(0);
    const [creditPortion , setCreditPortion] = useState(0);
    const [transferPortion , setTransferPortion] = useState(0);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Fixed: should be a string
    const [coupons, setCoupons] = useState([]);
    const [deliveryDates, setDeliveryDates] = useState([]);
    const [deliveryPrice, setDeliveryPrice] = useState("0");
    const [districts, setDistricts] = useState([]);
    const [deliveryRates, setDeliveryRates] = useState({});
    const [discountAmount, setDiscountAmount] = useState(0);
    const [specialdiscountAmount, setSpecialDiscountAmount] = useState(0);
    const [itemdiscountAmount, setItemDiscountAmount] = useState(0);
    const [totalItemPrice, setTotalItemPrice] = useState(0);
    const [totalItemPricebeforeDiscount, setTotalItemPricebeforeDiscount] = useState(0);
    const [totalBillPrice, setTotalBillPrice] = useState(0);
    const [fulltotalPay , setFullTotalPay] = useState(0);
    const [creditAmount , setCreditAmount] = useState(0);
    const [cardPayment , setCardPayment] = useState(0);
    const [creditExpectedDate , setCreditExpectedDate] = useState('');
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]); // Stores search results
    const [errors, setErrors] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNewCustomer, setIsNewCustomer] = useState(true); // State to determine new or previous customer
    const [availableDelivery, setAvailableDelivery] = useState(null);
    const [orderType, setOrderType] = useState("Walking");
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [setShowBank , setSetShowBank] = useState(false);
    const [setShowAccountnumber , setSetShowAccountNumber] = useState(false);
    const [discount, setDiscount] = useState("0");
    const [advance, setAdvance] = useState();
    const [balance, setBalance] = useState("0");
    const [grossBillTotal , setGrossBillTotal] = useState(0);
    const [previousbalance , setPreviousBalance] = useState(0);
    const [grossAmount, setGrossAmount] = useState(0);
    const [balance1, setBalance1] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [saleteam , setSaleTeam] = useState([]);
    const [receiptData, setReceiptData] = useState(null);
    const [showReceiptView, setShowReceiptView] = useState(false);
    const [showDeliveryView, setShowDeliveryView] = useState(false);
    const [showGatepassView, setGatePassView] = useState(false);
    const [receiptDataD, setReceiptDataD] = useState(null);
    const [showStockModal1, setShowStockModal1] = useState(false);
    const [showStockModal2, setShowStockModal2] = useState(false);
    const [selectedItemForReserve, setSelectedItemForReserve] = useState(null);
    const [selectedItemForProduction , setSelectedItemForProduction] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const debounceTimeout = useRef(null);
    const [itemdetails, setItemDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);
    const [productionData, setProductionData] = useState({itemId: '', supplierId: '', qty: '', expecteddate: '', specialnote: ''});
    const [processedItems, setProcessedItems] = useState([]);
    const [PurchaseId, setPurchaseId] = useState("");
    const [cheques, setCheques] = useState([]);
    const [Banks, setBanks] = useState([]);
    const [accountNumbers, setAccountNumbers] = useState([]);
    const [selectedBankId, setSelectedBankId] = useState("");
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [order, setOrder] = useState([]);
    const [fetchedForSearch, setFetchedForSearch] = useState(false);
    const fixedRate = 2.5;
    
    const [ChequeBalance, setChequeBalance] = useState(0);
    const subPaymentOptions = {
            Cash: ['Cash', 'Transfer'],
            Card: ['Debit Card', 'Credit Card'],
            // Cheque: ['Bank Cheque', 'Post-dated Cheque'],
            // Credit: ['30 Days', '60 Days'],
            Combined: ['Cash & Card','Cash & Cheque','Cash & Credit','Cash & Transfer']
    };
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const [RecepitId , setRecepitId] = useState("");        
                
    const fetchRecepitID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/newRecepitID");
            const data = await response.json();
            if (data.nextRepid) {
                setRecepitId(data.nextRepid);
                return data.nextRepid;  // Return the value for immediate use
            } else {
                toast.error("Server did not return a valid Recepit ID.");
                return null;
            }
        } catch (err) {
            console.error("Error fetching Recepit ID:", err);
            toast.error("Failed to load Recepit ID.");
            return null;
        }
    };

    const fetchInvoiceID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/newinvoiceID");
            const data = await response.json();
            if (data.nextRepid) {
                return data.nextRepid;  // Return the value for immediate use
            } else {
                toast.error("Server did not return a valid Invoice ID.");
                return null;
            }
        } catch (err) {
            console.error("Error fetching Inoice ID:", err);
            toast.error("Failed to load Invoice ID.");
            return null;
        }
    };

    useEffect(() => {
        fetchItems();fetchCoupons();fetchCustomers();fetchBankDetails();fetchPurchaseID();fetchDeliveryRates();fetchOrderID();
    }, []);

    const fetchOrderID = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/orders/new-id");
            const data = await response.json();
            if (data) {
                setOrderID(data.orderID);
            } else {
                toast.error("Server did not return a valid order ID.");
                return null;
            }
        } catch (err) {
            console.error("Error fetching Inoice ID:", err);
            toast.error("Failed to load Invoice ID.");
            return null;
        }
    };
   
    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitems");
            const data = await response.json();
            setItems(data || []);
            return data || [];
        } catch (error) {
            toast.error("Error fetching items.");
            return [];
        }
    };
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
            toast.error("Error fetching bank details.");
            return { banks: [], accounts: [] };
        }
    };
    const fetchCoupons = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/coupon-details");
            const data = await response.json();
            setCoupons(data.data || []);
        } catch (error) {
            toast.error("Error fetching coupons.");
        }
    };
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/allcustomers`);
            const data = await response.json();

            if (response.ok) {
                // If the response is OK, assume data is either an array or empty
                setCustomers(data || []);
                setFilteredCustomers(data || []);
                setError(""); // Clear any previous error
            } else {
                // Only show error if backend explicitly says something went wrong (e.g., 500)
                setCustomers([]);
                setFilteredCustomers([]);
                setError(data.message || "Something went wrong.");
            }
        } catch (error) {
            // Network or unexpected error
            setCustomers([]);
            setFilteredCustomers([]);
            setError("Error fetching customers.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (orderType === "Walking") {
            setFormData((prev) => ({ ...prev, type: "Walking", category: "Cash" }));
        } else if (orderType === "On-site") {
            setFormData((prev) => ({ ...prev, type: "Online", category: "Cash" }));
        }
    }, [orderType]);

    useEffect(() => {
        const total = cheques.reduce((sum, cheque) => {
            const amount = parseFloat(cheque.amount) || 0;
            return sum + amount;
        }, 0);
        setChequeBalance(total);
    }, [cheques]);
    useEffect(() => {
        calculateTotalPrice();
    }, [formData.payment, formData.subPayment,selectedItems, deliveryPrice, discountAmount,advance,balance,previousbalance,specialdiscountAmount,formData.courierCharge,formData.dvStatus]);
    const calculateTotalPrice = () => {
        const isCardPayment = formData.payment === "Card" &&
            (formData.subPayment === "Debit Card" || formData.subPayment === "Credit Card");

        // Total price before discount
        const totalBeforeDiscount = selectedItems.reduce((total, item) => {
            const unitPrice = item.originalPrice ?? item.price;
            return total + unitPrice * item.qty;
        }, 0);
        setTotalItemPricebeforeDiscount(totalBeforeDiscount);

        // Total item discount
        const totalItemDiscount = selectedItems.reduce((total, item) => {
            const specialDiscount = item.discount || 0;
            return total + specialDiscount * item.qty;
        }, 0);
        setItemDiscountAmount(totalItemDiscount);

        // Total price after discount
        const itemTotal = selectedItems.reduce((total, item) => {
            const unitPrice = item.originalPrice ?? item.price;
            const specialDiscount = item.discount || 0;
            const discountedPrice = unitPrice - specialDiscount;
            return total + discountedPrice * item.qty;
        }, 0);
        setTotalItemPrice(itemTotal);
    
        let grossTotal = 0;

        if(formData.dvStatus === 'Delivery'){
            grossTotal =itemTotal - Number(discountAmount || 0) - Number(specialdiscountAmount || 0) + Number(deliveryPrice || 0);
        }else if(formData.dvStatus === 'Courier'){
            grossTotal = itemTotal - Number(discountAmount || 0) - Number(specialdiscountAmount || 0) + Number(formData.courierCharge || 0);
        }else if(formData.dvStatus === 'Pickup'){
            grossTotal = itemTotal - Number(discountAmount || 0) - Number(specialdiscountAmount || 0) ;
        }
        const total = grossTotal - Number(previousbalance || 0);

        setTotalBillPrice(total);
        setGrossAmount(total);
        setGrossBillTotal(grossTotal);

        const adv = parseFloat(advance) || 0;

        if (isCardPayment) {
            const interestOnPaid = (adv * fixedRate) / 100;
            const netPaid = adv + interestOnPaid;

            const interestOnBill = (grossTotal * fixedRate) / 100;
            const netBill = grossTotal + interestOnBill;

            const balance = netPaid - netBill;

            setBalance(balance.toFixed(2));
            setBalance1(balance.toFixed(2));
        } else {
            const remaining = adv - total;
            setBalance(remaining.toFixed(2));
            setBalance1(remaining.toFixed(2));
        }
    };
    useEffect(() => {
        const numericBill = parseFloat(totalBillPrice) || 0;
        const cardPay = parseFloat(cardPayment) || 0;
        const cashAmount = parseFloat(formData.cashAmount || 0);
        const cardCash = parseFloat(combinedCardBalance) || 0;
        const chequeCash = parseFloat(combinedChequeBalance) || 0;
        const creditAdvance = parseFloat(creditAmount) || 0;
        const transferAdvance = parseFloat(combinedTransferBalance) || 0;
        const chequeManualPay = parseFloat(ChequeBalance) || 0;
        const totalChequeAmount = cheques.reduce((sum, chq) => sum + (parseFloat(chq.amount) || 0), 0);

        const isCardPayment = formData.payment === "Card" &&
            (formData.subPayment === "Debit Card" || formData.subPayment === "Credit Card");

        const isCombinedCashCard = formData.payment === "Combined" &&
            formData.subPayment === "Cash & Card";

        const isCombinedCashCheque = formData.payment === "Combined" &&
            formData.subPayment === "Cash & Cheque";

        const isCombinedCashCredit = formData.payment === "Combined" &&
            formData.subPayment === "Cash & Credit";

        const isCombinedCashTransfer = formData.payment === "Combined" &&
            formData.subPayment === "Cash & Transfer";

        const isCreditPayment = formData.payment === "Credit";
        const isChequePayment = formData.payment === "Cheque";

        if (isCardPayment) {
            const interestOnCardPay = (cardPay * fixedRate) / 100;
            const netCardPay = cardPay + interestOnCardPay;

            const interestOnBill = (numericBill * fixedRate) / 100;
            const netBillPay = numericBill + interestOnBill;

            const balanceValue = netCardPay - netBillPay;

            setRate(fixedRate);
            setInterestValue(interestOnCardPay);
            setNetAmount(netCardPay);
            setAdvance(cardPay);
            setBalance(balanceValue.toFixed(2));
            setCardPortion(cardPay);
            setFullTotalPay(netCardPay);
        }
        else if (isChequePayment) {
            const totalPaid = totalChequeAmount;
            const newBalance = totalPaid - parseFloat(grossAmount);

            setAdvance(totalPaid);
            setBalance(newBalance.toFixed(2));
            setBalance1(newBalance.toFixed(2));
        }

        else if (isCombinedCashCard) {
            const cardAmount = numericBill - cardCash;
            const interest = (cardAmount * fixedRate) / 100;
            const cardTotal = cardAmount + interest;
            const fullPaid = cardCash + cardAmount;
            const fullTotal = cardCash + cardTotal;

            setRate(fixedRate);
            setInterestValue(interest);
            setNetAmount(cardTotal);
            setCardPortion(cardAmount);
            setAdvance(fullPaid);
            setBalance((0).toFixed(2));
            setFullTotalPay(fullTotal);
        }

        else if (isCombinedCashCheque) {
            const totalPaid = chequeCash + totalChequeAmount;
            const balanceRemaining = totalPaid - numericBill;

            setChequePortion(totalChequeAmount);
            setAdvance(totalPaid);
            setBalance(balanceRemaining.toFixed(2));
            setBalance1(balanceRemaining.toFixed(2));
            setFullTotalPay(numericBill);
        }

        else if (isCreditPayment) {
            const balance = creditAdvance - numericBill;
            setAdvance(creditAdvance);
            setBalance(balance.toFixed(2));
        }

        else if (isCombinedCashCredit) {
            const fullPaid = combinedCreditBalance;
            const balance = fullPaid - numericBill;

            setCreditPortion(numericBill - fullPaid);
            setAdvance(fullPaid);
            setBalance(balance.toFixed(2));
            setFullTotalPay(numericBill);
        }

        else if (isCombinedCashTransfer) {
            const cashPart = parseFloat(combinedTransferBalance) || 0;
            const transferPart = parseFloat(transferPortion) || 0;
            const fullPaid = cashPart + transferPart;
            const bal = fullPaid - numericBill;

            setAdvance(fullPaid);
            setBalance(bal.toFixed(2));
            setFullTotalPay(numericBill);
        }

        else {
            setRate(0);
            setInterestValue(0);
            setNetAmount(0);
            setCardPortion(0);
            setAdvance();
            setBalance((0).toFixed(2));
            setFullTotalPay(0);
        }
    }, [formData.payment, formData.subPayment, formData.cashAmount,cardPayment, totalBillPrice,cheques,grossAmount,combinedCardBalance,combinedTransferBalance,combinedChequeBalance, creditAmount, ChequeBalance,transferPortion ]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(name, value);

        setFormData((prev) => {
            let updatedForm = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };
            // If switching to Pickup, reset all Delivery-related fields
            if (name === "dvStatus" && value === "Pickup") {
                updatedForm = {
                    ...updatedForm,
                    dvtype: "",
                    district: "",
                    // address: "",
                    isAddressChanged: false,
                    newAddress: "",
                    expectedDate: "",
                    deliveryCharge: "",
                };
                // setDeliveryPrice(0);
            }
            // If switching to Direct Delivery, reset some fields
            if (name === "dvtype" && value === "Direct") {
                updatedForm = {
                    ...updatedForm,
                    district: "",
                    expectedDate: "",
                    deliveryCharge: "",
                };
            }

            if (name === "dvtype" && value === "Courier") {
                updatedForm = {
                    ...updatedForm,
                    expectedDate: "",
                    courierCharge:""
                };
            }
            // If Address change is unchecked, clear new address
            if (name === "isAddressChanged" && !checked) {
                updatedForm.newAddress = "";
            }
            return updatedForm;
        });
        // Handle delivery price updates
        if (name === "district") {
            setDeliveryPrice(deliveryRates[value] || 0);
            fetchDeliveryDates(value);
        }
        // If entering Direct delivery charge manually
        if (name === "deliveryCharge" && formData.dvtype === "Direct") {
            setDeliveryPrice(value);
        }
        if (name === "courierCharge") {
            setDeliveryPrice(value);
        }
        // Check delivery availability for Direct
        if (name === "expectedDate" && formData.dvtype === "Direct") {
            checkDeliveryAvailability(value);
        }
        // Handle coupon code
        if (name === "couponCode") {
            const selectedCoupon = coupons.find((c) => c.coupon_code === value);
            // Set discount amount
            setDiscountAmount(selectedCoupon ? selectedCoupon.discount : 0);
            // If a valid coupon is found, set the saleteam info
            if (selectedCoupon) {
                setSaleTeam([
                    {
                        id: selectedCoupon.sales_team_id,
                        name: selectedCoupon.employee_name
                    }
                ]);
            } else {
                setSaleTeam([]); // Clear if no matching coupon
            }
        }
    };
    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            // Reset subPayment when payment changes
            ...(name === 'payment' && { subPayment: '' })
        }));
    };
    const secondOptions = subPaymentOptions[formData.payment] || [];
    const checkDeliveryAvailability = async (date) => {
        try {
            // Mock API call to check delivery availability (Replace with real API)
            const response = await fetch(`http://localhost:5001/api/admin/main/check-delivery?date=${date}`);
            const result = await response.json();
            setAvailableDelivery(result.available);
        } catch (error) {
            console.error("Error checking delivery availability:", error);
        }
    };
    const fetchDeliveryDates = async (district) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/delivery-schedule?district=${district}`);
            const data = await response.json();setDeliveryDates(data.upcomingDates || []);
        } catch (error) {
            toast.error("Error fetching delivery dates.");
            setDeliveryDates([]);
        }
    };
    const fetchDeliveryRates = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/delivery-rates");
            const data = await response.json();

            if (data.success) {
                const districtList = data.data.map((rate) => rate.district);
                const rateMap = {};
                data.data.forEach((rate) => {
                    rateMap[rate.district] = rate.amount; // Store delivery price for each district
                });
                setDistricts(districtList);
                setDeliveryRates(rateMap);
            }
        } catch (error) {
            toast.error("Error fetching delivery rates.");
        }
    };    
    // 🔍 Handle search input change
    const handleSearchChange = async (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        console.log(value);

        // ✅ If search just started (and not yet fetched), fetch fresh data once
        if (value.trim() && !fetchedForSearch) {
            const latestItems = await fetchItems();
            console.log(latestItems);
            setFetchedForSearch(true); // only once per session
            setFilteredItems(filterItems(latestItems, value));
        } else {
            // Just filter locally
            setFilteredItems(filterItems(items, value));
        }

        // 🧼 Reset fetched flag if search is cleared
        if (!value.trim()) {
            setFetchedForSearch(false);
            setFilteredItems(items);
        }
    };
    // 🔍 Filtering helper
    const filterItems = (data, value) => {
        if (!value.trim()) return data;
        return data.filter(item =>
            item.I_Id.toString().toLowerCase().includes(value) ||
            item.I_name.toLowerCase().includes(value)
        );
    };
    // Fetch items only once, e.g., in useEffect
    useEffect(() => {
        const fetchItemsOnce = async () => {
            const data = await fetchItems(); // Assume fetchItems returns data
            setItems(data);
            setFilteredItems(data); // Initially show all
        };
        fetchItemsOnce();
    }, []);
    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setQuantity(1);
        setSearchTerm("");
        setFilteredItems([]);
    };
    const handleAddToOrder = async () => {
        const updatedItems = await fetchItems();  // Wait for the updated items list

        if (!selectedItem) return;

        // Use `updatedItems` to find the selected item
        const updatedSelectedItem = updatedItems.find(item => item.I_Id === selectedItem.I_Id);

        if (!updatedSelectedItem) {
            toast.error("Selected item not found in updated list.");
            return;
        }

        // Check if the item is issuable: Now or Later
        if (!formData.issuable || formData.issuable.trim() === "") {
            toast.error("Please select whether the item is issuable: Now or Later.");
            return;
        }

        // Stock check (if issuable is 'Now')
        if (formData.issuable === 'Now') {
            if (updatedSelectedItem.availableQty < quantity) {
                Swal.fire("There are not enough stocks for the requirement.");
                return;
            }
        }

        // Calculate discount and price
        const specialDiscount = parseFloat(discount) || 0;
        const discountedPrice = updatedSelectedItem.price - specialDiscount;

        // Update `selectedItems` array
        const existingIndex = selectedItems.findIndex(item => item.I_Id === updatedSelectedItem.I_Id);
        let updatedSelectedItems = [...selectedItems];

        if (existingIndex !== -1) {
            updatedSelectedItems[existingIndex].qty += quantity;
            updatedSelectedItems[existingIndex].discount = specialDiscount;
            updatedSelectedItems[existingIndex].price = discountedPrice;
            updatedSelectedItems[existingIndex].originalPrice = updatedSelectedItem.price;
        } else {
            updatedSelectedItems.push({
                ...updatedSelectedItem,
                qty: quantity,
                discount: specialDiscount,
                price: discountedPrice,
                originalPrice: updatedSelectedItem.price,
                itemName: updatedSelectedItem.I_name,
                unitPrice: updatedSelectedItem.price,
            });
        }

        setSelectedItems(updatedSelectedItems);

        // Generate new items (1 per quantity)
        const newFlatItems = Array.from({ length: quantity }, () => ({
            ...updatedSelectedItem,
            uid: uuidv4(),
            qty: 1,
            discount: specialDiscount,
            price: discountedPrice,
            originalPrice: updatedSelectedItem.price,
            itemName: updatedSelectedItem.I_name,
            unitPrice: updatedSelectedItem.price,
            status: formData.issuable === "Later" ? "Booked" : "",
        }));

        // Update selectedItemsQty
        setSelectedItemsQTY(prev => [...prev, ...newFlatItems]);

        // ✅ Automatically add to processedItems as "Booked" if issuable is "Later"
        if (formData.issuable === "Later") {
            const bookedItems = newFlatItems.map(item => ({
                I_Id: item.I_Id,
                material: item.material,
                uid: item.uid,
                unitPrice: item.unitPrice,
                discount: item.discount || 0,
                status: "Booked"
            }));

            setProcessedItems(prev => [...prev, ...bookedItems]);

            console.log("✅ Booked Items Auto Added:", bookedItems);
        }

        // Reset form states
        setSelectedItem(null);
        setDiscount(0);
        setQuantity(1);
        setSellingPrice(0);
    };
    const handleStatusChange = (index, newStatus, item) => {
        const updatedItems = [...selectedItemsQty];
        const updatedItem = { ...updatedItems[index], status: newStatus };
        updatedItems[index] = updatedItem;
        setSelectedItemsQTY(updatedItems);

        const identifier = updatedItem.uid;

        const removeByUid = (array) => array.filter(i => i.uid !== identifier);

        setProcessedItems(prev => removeByUid(prev)); // clear from any status

        if (newStatus === "Booked") {
            const strippedItem = {
                I_Id: updatedItem.I_Id,
                material: updatedItem.material,
                uid: updatedItem.uid,
                unitPrice: updatedItem.unitPrice,
                discount: updatedItem.discount || 0,
                status: "Booked"
            };
            setProcessedItems(prev => [...prev, strippedItem]);
        } else if (newStatus === "Reserved") {
            setSelectedItemForReserve(updatedItem);
            setShowStockModal1(true);
        } else if (newStatus === "Production") {
            fetchSuppliers(updatedItem.I_Id);
            setSelectedItemForProduction(updatedItem);
            setShowStockModal2(true);
        }

        setTimeout(() => {
            console.log("📦 All Processed Items:", processedItems);
            console.log("🔒 Reserved:", processedItems.filter(i => i.status === "Reserved"));
            console.log("🏭 Production:", processedItems.filter(i => i.status === "Production"));
            console.log("📦 Booked:", processedItems.filter(i => i.status === "Booked"));
        }, 200);
    };
    const handleRemoveItem = (index) => {
        const updatedItems = [...selectedItems];
        const removedItem = updatedItems.splice(index, 1)[0]; // Remove and capture the item

        setSelectedItems(updatedItems);

        // Remove all entries in selectedItemsQTY with the same I_Id
        setSelectedItemsQTY(prev =>
            prev.filter(item => item.I_Id !== removedItem.I_Id)
        );
    };
    const fetchSuppliers = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/item-suppliers?I_Id=${id}`);
            if (!response.ok) throw new Error("Failed to fetch supplier details.");
            const data = await response.json();
            setSuppliers(data.suppliers);
        } catch (err) {
            console.error("Error fetching supplier details:", err);
            setError(err.message);
        } finally {
            setLoadingSuppliers(false);
        }
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setProductionData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };
    const handleCustomerBalanceAction = (balanceValue, paymentAmt, billValue) => {
        const remaining = parseFloat(balanceValue);
        const grossvalue = parseFloat(paymentAmt);
        const BillValue = parseFloat(billValue);

        return new Promise((resolve) => {
            if (remaining > 0) {
                Swal.fire({
                    title: "<strong>Customer <u>Overpaid</u></strong>",
                    icon: "success",
                    html: `Customer has overpaid <b>Rs.${remaining.toFixed(2)}</b>. What would you like to do?`,
                    showCancelButton: true,
                    confirmButtonText: "💸 Handover to Customer",
                    cancelButtonText: "💼 Pass to Account"
                }).then((result) => {
                    if (result.isConfirmed) {
                        resolve({
                            finalBalance: 0,
                            action: "handover",
                            paymentAmount: grossvalue,
                            cashReturn: remaining,
                            advance: BillValue,
                            balance: 0,
                        });
                    } else {
                        resolve({
                            finalBalance: remaining,
                            action: "pass",
                            paymentAmount: paymentAmt,
                            cashReturn: 0,
                            advance: BillValue,
                            balance: 0,
                        });
                    }
                });
            } else if (remaining < 0) {
                Swal.fire({
                    title: "<strong>Customer <u>Owes</u> Balance</strong>",
                    icon: "warning",
                    html: `Customer still owes <b>Rs.${Math.abs(remaining).toFixed(2)}</b>. What would you like to do?`,
                    showCancelButton: true,
                    confirmButtonText: "📝 Pass to Account",
                    cancelButtonText: "❌ Ignore"
                }).then((result) => {
                    if (result.isConfirmed) {
                        resolve({
                            finalBalance: remaining,
                            action: "pass",
                            paymentAmount: paymentAmt,
                            cashReturn: 0,
                            advance: paymentAmt,
                            balance: remaining,
                        });
                    } else {
                        resolve({
                            finalBalance: remaining,
                            action: "ignore",
                            paymentAmount: paymentAmt,
                            cashReturn: 0,
                            advance: billValue,
                            balance: 0,
                        });
                    }
                });
            } else {
                resolve({
                    finalBalance: 0,
                    action: "none",
                    paymentAmount: paymentAmt,
                    cashReturn: 0,
                    advance: paymentAmt,
                    balance: 0,
                });
            }
        });
    };
    const handleSubmit = async (e) => { 
        e.preventDefault();

        // Basic validation
        if (!formData.FtName || !formData.phoneNumber || !formData.orderDate) {
            toast.error("Please fill all details.");
            return;
        }
        if (! selectedItems.length === 0) {
            toast.error("Please add at least one item.");
            return;
        }

        if (formData.dvStatus === "Delivery" && formData.dvtype === "Combined" &&
            (!formData.address || !formData.district || !formData.expectedDate)) {
            toast.error("Please complete all delivery details.");
            return;
        }
        // ✅ Handle customer balance adjustment first
       const {
        finalBalance,
        action,
        paymentAmount: updatedPaymentAmount,
        cashReturn: updatedCashReturn,
        advance: updatedAdvance,
        balance: updatedBalance,
    } = await handleCustomerBalanceAction(balance, advance, grossBillTotal);
        let cardPayment = null;
        let cashPayment = null;
        let tranferPayment = null;
        let chequePayment = null;
        let cashCardPayment = null;
        let creditPayment = null;
        let combinedChequePayment = null;
        let combinedCreditPayment = null;
        let combinedTransferPayment = null;

        if (formData.payment === "Cheque") {
            chequePayment = {
                total: parseFloat(ChequeBalance || 0).toFixed(2),
                cheques: cheques.map(chq => ({
                    amount: parseFloat(chq.amount || 0).toFixed(2),
                    chequeNumber: chq.chequeNumber,
                    bank: chq.bank,
                    branch: chq.branch,
                    accountNumber: chq.accountNumber,
                    chequeDate: chq.chequeDate,
                })),
            };
        }
        if (formData.payment === "Cash" && formData.subPayment === 'Transfer') {
            tranferPayment = {
               bank : transferAccount,
            };
        }
         if (formData.payment === "Cash" && formData.subPayment === 'Cash') {
            cashPayment = {
               type : formData.payment,
               subtype : formData.subPayment,
               payment : formData.advance,
            };
        }
        if (formData.payment === 'Card') {
            cardPayment = {
                // amount : parseFloat(totalBillPrice).toFixed(2),
                interestValue: parseFloat(interestValue).toFixed(2),
                type: formData.subPayment,
                netAmount: parseFloat(netAmount).toFixed(2),
                rate: parseFloat(rate).toFixed(2),
            };
        }
        if (formData.payment === "Credit") {
            creditPayment = {
                amount: parseFloat(creditAmount).toFixed(2),
                balance : parseFloat(balance).toFixed(2),
                expectdate: creditExpectedDate,
            };
        }
        if (formData.payment === 'Combined' && formData.subPayment === 'Cash & Card') {
            cashCardPayment = {
                cardBalance: parseFloat(cardPortion).toFixed(2),
                interestValue: parseFloat(interestValue).toFixed(2),
                type: formData.subPayment,
                netAmount: parseFloat(netAmount).toFixed(2),
                rate: parseFloat(rate).toFixed(2),
                fullpaidAmount : parseFloat(fulltotalPay),
            };
        }
        if (formData.payment === 'Combined' && formData.subPayment === 'Cash & Cheque') {
            combinedChequePayment = {
                chequeBalance: parseFloat(chequePortion || 0).toFixed(2),
                cashBalance: parseFloat(combinedChequeBalance || 0).toFixed(2),
                type: formData.subPayment,
                cheques: cheques.map(chq => ({
                    amount: parseFloat(chq.amount || 0).toFixed(2),
                    chequeNumber: chq.chequeNumber,
                    bank: chq.bank,
                    branch: chq.branch,
                    accountNumber: chq.accountNumber,
                    chequeDate: chq.chequeDate,
                })),
            };
        }
        if (formData.payment === 'Combined' && formData.subPayment === 'Cash & Credit') {
            combinedCreditPayment = {
                creditBalance: parseFloat(creditPortion).toFixed(2),
                cashBalance: parseFloat(combinedCreditBalance).toFixed(2),
                type: formData.subPayment,
                expectedDate: creditExpectedDate
            };
        }
        if (formData.payment === 'Combined' && formData.subPayment === 'Cash & Transfer') {
            combinedTransferPayment = {
                cashAmount: parseFloat(combinedTransferBalance) || 0,
                transferAmount: parseFloat(transferPortion) || 0,
                bank: transferBank || '',
            };
        }

        // ✅ Assemble and clean the final form data
       const updatedFormData = {
            ...formData,
            advance: parseFloat(updatedAdvance || 0).toFixed(2),
            balance: parseFloat(updatedBalance || 0).toFixed(2),
            city: formData.address,orderId,
            cashPayment, cardPayment, chequePayment, cashCardPayment,
            tranferPayment, creditPayment,
            combinedChequePayment, combinedCreditPayment, combinedTransferPayment,
        };

        // ✅ Calculate totals correctly
        const itemList = selectedItems.map(item => {
            const unitPrice = parseFloat(item.originalPrice || item.price || 0);
            const discount = parseFloat(item.discount || 0);
            const grossPrice = unitPrice - discount;
            const netPrice = grossPrice * item.qty;

            return {
                I_Id: item.I_Id,
                itemName:item.itemName,
                material: item.material,
                qty: item.qty,
                price: netPrice,
                discount: discount,
            };
        });
        const items = selectedItems.map(item => {
            const unitPrice = parseFloat(item.originalPrice || item.price || 0);
            const discount = parseFloat(item.discount || 0);
            const grossPrice = unitPrice - discount;
            const netPrice = grossPrice * item.qty;

            return {
                itemId: item.I_Id,
                itemName:item.itemName,
                color: item.color,
                quantity: item.qty,
                unitPrice: unitPrice,
                grossprice:grossPrice,
                price: netPrice,
                discount: discount,
                
            };
        });
        const items2 = selectedItems.map(item => {
            const unitPrice = parseFloat(item.originalPrice || item.price || 0);
            const discount = parseFloat(item.discount || 0);
            const grossPrice = unitPrice - discount;
            const netPrice = grossPrice * item.qty;

            return {
                itemId: item.I_Id,
                itemName:item.itemName,
                color: item.color,
                quantity: item.qty,
                unitPrice: netPrice,
                discount: discount,
                price: item.unitPrice,
            };
        });

        // ✅ Calculate totalItemPrice and totalBillPrice from selectedItems
        const totalItemPrice = itemList.reduce((sum, item) => sum + parseFloat(item.price), 0);
        let totalBillPrice =0;
        console.log(formData.dvStatus);
        if(formData.dvStatus === "Delivery"){
            console.log(totalItemPrice,deliveryPrice,discountAmount,specialdiscountAmount);
            totalBillPrice = totalItemPrice + parseFloat(deliveryPrice || 0) - parseFloat(discountAmount || 0) - parseFloat(specialdiscountAmount || 0);
        }else if(formData.dvStatus === "Courier"){
            console.log(totalItemPrice,formData.courierCharge,discountAmount,specialdiscountAmount);
            totalBillPrice = totalItemPrice + parseFloat(formData.courierCharge || 0) - parseFloat(discountAmount || 0) - parseFloat(specialdiscountAmount || 0);
        }else if(formData.dvStatus === "Pickup"){
            console.log(totalItemPrice,discountAmount,specialdiscountAmount);
            totalBillPrice = totalItemPrice - parseFloat(discountAmount || 0) - parseFloat(specialdiscountAmount || 0);
        }
        const orderData = {
        ...updatedFormData,
        isNewCustomer,
        orderType,
        items: itemList,
        deliveryPrice,
        discountAmount,
        totalItemPrice: totalItemPrice.toFixed(2),
        totalBillPrice: totalBillPrice.toFixed(2),
        itemdiscountAmount,specialdiscountAmount,
        previousbalance: previousbalance,
        grossAmount: grossAmount,
        customerBalanceDecision: action,
        finalCustomerBalance: finalBalance,
        paymentAmount: parseFloat(updatedPaymentAmount),
        cashReturn: parseFloat(updatedCashReturn),
    };
        const fullOrderData = {
            ...orderData,
            processedItems,
        };
        console.log(fullOrderData);
        const advance1 = parseFloat(advance) || 0;
        const balance1 = parseFloat(balance) || 0;
        const newTotalOrder = parseFloat(totalItemPrice) - parseFloat(discountAmount);
        const TotalOrder = parseFloat(totalItemPrice) + parseFloat(deliveryPrice);
        const customerBalance = parseFloat(finalBalance);
        const billPrice = parseFloat(totalBillPrice) || 0;
        const payAmount = parseFloat(updatedPaymentAmount);
        let billBalance = 0;

        if (billPrice === payAmount || billPrice < payAmount) {
            billBalance = 0;
        } else if (billPrice > payAmount) {
            billBalance = billPrice - payAmount;
        }

        console.log("📝 Sending Full Order Data:", fullOrderData);
        try {
            if (formData.issuable === 'Later') {
                try {
                    const fullOrderData = {
                        ...orderData,
                        processedItems,
                    };

                    console.log("📝 Sending Full Order Data:", fullOrderData);

                    const response = await fetch("http://localhost:5001/api/admin/main/later-order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(fullOrderData),
                    });

                    const result = await response.json();
                    console.log("📝 API Response:", result); // Log the response to check its structure
                    
                    if (response.ok && result.success && result.data) {
                        toast.success(`Order placed successfully! Order ID: ${orderId}`); 
                        setOrder(fullOrderData);
                    } else {
                        toast.error(result.message || "Failed to place the order.");
                        console.error("❌ Order Error:", result.message || result);
                    }

                } catch (error) {
                    toast.error("An error occurred while placing the order.");
                    console.error("❌ Network/Server Error:", error);
                }
            } else if (formData.issuable === 'Now') {
                const response = await fetch("http://localhost:5001/api/admin/main/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                const result = await response.json();
                console.log("📝 API Response:", result); // Log the response to check its structure

                if (response.ok && result.success && result.data) {
                    const { orderId } = result.data;
                    toast.success("Order placed successfully!");
                    setOrder(fullOrderData);
                } else {
                    toast.error(result.message || "Something went wrong. Please try again.");
                }
            }   

        } catch (error) {
            console.error("Error submitting order data:", error);
            toast.error("Error submitting order data. Please try again.");
        }
    };
    const generateBill = async () => {
        const receiptId = await fetchRecepitID();  // Wait for ID
        const invoiceId = await fetchInvoiceID();
        console.log(receiptId,invoiceId);
        const delprice =
        formData.dvStatus === 'Courier'
            ? formData.courierCharge
            : formData.dvStatus === 'Delivery'
            ? deliveryPrice
            : 0;

        const items = selectedItems.map(item => {
            const unitPrice = parseFloat(item.originalPrice || item.price || 0);
            const discount = parseFloat(item.discount || 0);
            const grossPrice = unitPrice - discount;
            const netPrice = grossPrice * item.qty;

            return {
                itemId: item.I_Id,
                itemName:item.itemName,
                color: item.color,
                quantity: item.qty,
                unitPrice: unitPrice,
                grossprice:grossPrice,
                price: netPrice,
                discount: discount,
                
            };
        });
        if(formData.issuable === 'Later'){
            const updatedData = {
                recepitId: receiptId,
                invoiceId:invoiceId,
                orID: orderId,
                orderDate: formData.orderDate,
                expectedDate: formData.expectedDate || '',
                customerName: `${formData.title || ''} ${formData.FtName || ''} ${formData.SrName || ''}`.trim(),
                contact1: formData.phoneNumber || '',
                contact2: formData.otherNumber || '',
                address: formData.address || '',
                balance: parseFloat(order.balance),
                delStatus: formData.dvStatus || '', 
                delPrice: parseFloat(delprice || 0),
                deliveryStatus: formData.dvStatus || '',
                couponediscount: parseFloat(discountAmount || 0),
                specialdiscount : parseFloat(specialdiscountAmount ||0),
                subtotal: parseFloat(totalItemPrice || 0),
                total: parseFloat(totalBillPrice || 0),
                advance: parseFloat(order.advance || 0),
                payStatus: order.paymentType || (order.advance > 0 ? 'Advanced' : 'Pending'),
                stID: saleteam[0]?.id || '',
                paymentAmount: parseFloat(order.paymentAmount || 0),
                cashReturn: parseFloat(order.cashReturn),
                issuable: order.issuable,
                salesperson: saleteam[0]?.name || '',
                items: items,
                customerBalanceDecision: order.customerBalanceDecision,
                finalCustomerBalance: order.finalCustomerBalance,
                specialNote: formData.specialNote,
                billNumber: formData.billNumber || '-',
            };
            console.log(updatedData);
            setReceiptData(updatedData);
            setShowReceiptView(true);
        }else{
            const newOrder = {
                recepitId: receiptId,
                invoiceId:invoiceId,
                orderId: orderId,
                orderDate:order.orderDate,
                expectedDate: formData.expectedDate || '',
                phoneNumber: formData.phoneNumber,
                otherNumber: formData.otherNumber,
                Address: formData.address,
                payStatus: formData.advance > 0 ? 'Advanced' : 'Pending',
                deliveryStatus: formData.dvStatus,
                deliveryCharge: parseFloat(delprice || 0),
                couponediscount: discountAmount,
                ItemDiscount: itemdiscountAmount,
                specialDiscount: specialdiscountAmount,
                advance: parseFloat(order.advance),
                items: items,
                balance: parseFloat(order.balance),
                totalPrice: totalBillPrice,
                customerName: formData.title+ " "+ formData.FtName + " " + formData.SrName,
                customerBalanceDecision: order.customerBalanceDecision,
                finalCustomerBalance: order.finalCustomerBalance,
                specialNote: formData.specialNote,
                billNumber: formData.billNumber || '-',
                stID: saleteam[0]?.id || '',
                salesperson: saleteam[0]?.name || '',
                paymentAmount: parseFloat(order.paymentAmount || 0),
            };
            setSelectedOrder(newOrder);
            // Optionally, open invoice modal here
            setShowModal2(true);
        }
        
    };
    const handleSubmit3 = async (formData) => {
         const receiptId = await fetchRecepitID();
         const invoiceId = await fetchInvoiceID();
        console.log(formData,receiptId,invoiceId);
        // Optional: Clean or format the items if needed
        const filteredSelectedItems = (formData.selectedItems || []).map(item => ({
            I_Id: item.I_Id,
            stock_Id: item.stock_Id,
            pc_Id: item.pc_Id,
            pid_Id: item.pid_Id,
            price: item.price,
            material: item.material,
            datetime: item.datetime,
        }));

        // ✅ Update state with selected items
        selectedItem2Ref.current = filteredSelectedItems;

        const updatedData = {
            recepitId: receiptId,
            invoiceId:invoiceId,
            orID: selectedOrder.orderId,
            orderDate: selectedOrder.orderDate,
            customerName: formData.order.customerName || '',
            contact1: formData.order.phoneNumber || '',
            contact2: formData.order.otherNumber || '',
            address: formData.order.Address || '',
            delStatus: formData.deliveryStatus || '', // ensure it's never undefined
            delPrice: formData.delivery || 0,       // default to 0 if delivery is not provided
            deliveryStatus: formData.deliveryStatus || '',
            couponediscount: discountAmount || 0,   // provide a default if missing
            specialdiscount : parseFloat(specialdiscountAmount ||0),
            subtotal: formData.subtotal || 0,       // handle missing values
            total: formData.billTotal || 0,          // ensure no undefined values
            advance: formData.totalAdvance || 0,     // default to 0 if undefined
            payStatus: formData.paymentType || '',   // default to empty string if undefined
            stID: saleteam[0]?.id || '',            // ensure stID is not undefined
            paymentAmount: formData.totalAdvance || 0,
            selectedItems: filteredSelectedItems,
            balance: formData.billTotal - formData.totalAdvance || 0, // calculate balance safely
            salesperson: saleteam[0]?.name || '',    // ensure salesperson has a value
            items: selectedOrder.items,
            specialNote: formData.specialNote,
            billNumber: formData.billNumber || '-',
            expectedDate: formData.expectedDate || '',
        };
        console.log(updatedData);
         try {
                // Make API request to the /isssued-order endpoint
                const response = await fetch('http://localhost:5001/api/admin/main/issued-items-Now', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
                const result = await response.json();
                if (response.ok) {
                    toast.success("Update order Successfully");
                    setReceiptData(updatedData);  // Set data for receipt
                    setShowReceiptView(true);         // Show receipt view
                } else {
                    console.error("Error:", result.message);
                }
            } catch (error) {
                console.error("Error making API request:", error.message);
            }

        // Optional: send to API if needed
    };
    const handleSubmit2 = async (formData1) => {
        const collectingbalance=parseFloat(totalBillPrice) - parseFloat(advance);
        const updatedReceiptData = {
            order:{
                orderId: selectedOrder.orderId,
                billNumber:selectedOrder.billNumber,
                customerName:formData.title+ " "+formData.FtName+" "+formData.SrName,
                balance: parseFloat(balance) || 0,
                address:formData.address,
                contact1:formData.phoneNumber,
                contact2:formData.otherNumber,
                total:totalBillPrice,
                advance:advance,
                selectedItem: selectedItem2Ref.current,
            },
            vehicleId: formData1.vehicleId,
            driverName: formData1.driverName,
            driverId: formData1.driverId,
            hire: formData1.hire || 0,
            dnNumber: formData1.dnNumber,
            balanceToCollect:  parseFloat(collectingbalance) || 0,
            selectedDeliveryDate: formData.expectedDate, // Default to today's date if empty
            district: formData.district || "Unknown",
        };
        console.log(formData1);
        console.log(updatedReceiptData);
        try {
            // Prepare the data for the API request
            const deliveryNoteData = {
                driverName: formData1.driverName,
                driverId: formData1.driverId,
                vehicleName: formData1.vehicleId, // Ensure correct field name
                hire: formData1.hire || 0,
                dnNumber: formData1.dnNumber,
                date: updatedReceiptData.selectedDeliveryDate,
                order:{
                    orderId: selectedOrder.orderId,
                    balance: parseFloat(balance) || 0,
                    address:formData.address,
                    contact1:formData.phoneNumber,
                    contact2:formData.otherNumber,
                    billNumber:selectedOrder.billNumber,
                },
                district: formData.district || "Unknown",
                balanceToCollect: formData.balanceToCollect || 0,
            };
            //Make the API call
            const response = await fetch("http://localhost:5001/api/admin/main/create-delivery-note-now", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deliveryNoteData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error creating delivery note.");
            }

            toast.success("Delivery note created successfully.");
            setReceiptDataD(updatedReceiptData);
            setShowModal3(false);
            setShowDeliveryView(true);
        } catch (error) {
            console.error("Error while submitting delivery note:", error);
            toast.error(error.message || "An unexpected error occurred while submitting the delivery note.");
        }
    };
    const handleSubmit4 = async (formData1) => {
        const updatedReceiptData = {
            order:{
                orderId: selectedOrder.orderId,
                customerName:formData.title+ " "+formData.FtName+" "+formData.SrName,
                balance: parseFloat(balance) || 0,
                address:formData.address,
                contact1:formData.phoneNumber,
                contact2:formData.otherNumber,
                total:totalBillPrice,
                advance:advance,
                selectedItem: selectedItem2Ref.current,
            },
            vehicleId: formData1.vehicleId,
        };
        console.log(updatedReceiptData);
        try {
            // Prepare the data for the API request
            const gatepassData = {

                order:{
                    orderId: selectedOrder.orderId,
                    orderDate: selectedOrder.orderDate,
                    balance: parseFloat(balance) || 0,
                    address:formData.address,
                    contact1:formData.phoneNumber,
                    contact2:formData.otherNumber,
                    selectedItem:selectedItem2,
                },
                vehicleId: formData1.vehicleId,
            };
            console.log(gatepassData);
            //Make the API call
            const response = await fetch("http://localhost:5001/api/admin/main/create-gate-pass-now", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gatepassData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error creating gatepass.");
            }

            toast.success("Gate pass created successfully.");

            setReceiptDataD(updatedReceiptData);
            setShowModal4(false);
            setGatePassView(true);
        } catch (error) {
            console.error("Error while submitting delivery note:", error);
            toast.error(error.message || "An unexpected error occurred while submitting the delivery note.");
        }

    };
    const viewHandle = async (formData) => {
        setShowModal2(false);
        setShowModal3(true);
    };
    const viewHandle1 = async (formData) => {
        setShowModal2(false);
        setShowModal4(true);
    };
    const handleClear = () => {
        setTimeout(() => window.location.reload(), 500);
    };
    const handleSelectCustomer = (customer) => {
        setFormData((prevData) => ({
            ...prevData,
            c_ID: customer.c_ID,
            title: customer.title,
            FtName: customer.FtName ,
            SrName: customer.SrName,
            phoneNumber: customer.contact1,
            otherNumber: customer.contact2,
            address: customer.address,
            city: customer.city,
            district: customer.district,
            specialNote: customer.specialNote,
            id: customer.id,
            balance: customer.balance,
            type: customer.type,
            category: customer.category,
            occupation : customer.occupation,
            workPlace : customer.workPlace
        }));

        // Clear search term to hide dropdown
        setSearchTerm("");
        setFilteredCustomers([]);
    };
    const setCustomer = (value) => {
        if (value === "New") {
            setIsNewCustomer(true);
        } else {
            setIsNewCustomer(false);
        }
        // handleClear(); // Call handleClear when switching customer type
    };
    const handlePhoneNumberBlur = async (phoneNumber) => {
        if (!phoneNumber) return;
        try {
            const response = await fetch(`http://localhost:5001/api/admin/main/customer/check-customer?phone=${phoneNumber}`);
            const data = await response.json();
            if (data.exists) {
                toast.info(`Customer already exists: ${data.customerName}`);
                setCustomer("Previous");
                handleSelectCustomer(data.data);
                setPreviousBalance(data.data.balance);
            } else {
                toast.success("Customer does not exist, continue creating order.");
                setCustomer("New");
            }
        } catch (error) {
            console.error("Error checking customer:", error.message);
            toast.error("Failed to check customer.");
        }
    };
    const handleShopNameBlur = async (shopName, type) => {
        if (!shopName || !type) return;

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/customer/check-shop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type, shopName }),
            });

            const data = await response.json();

            if (data.exists && data.results.length > 0) {
                const customer = data.results[0];
                toast.info(`Customer already exists: ${customer.customerName}`);
                setCustomer("Previous");
                handleSelectCustomer(customer.data);
                setPreviousBalance(customer.data.balance);
            } else {
                toast.success("Customer does not exist, continue creating order.");
                setCustomer("New");
            }
        } catch (error) {
            console.error("Error checking customer:", error.message);
            toast.error("Failed to check customer.");
        }
    }
    const handleButtonClick = () => {
        setShowModal(true);
    };
    const handleAddNewCoupon = () => {
        setShowModal1(true);
    };
    const handleAddNewBank = () => {
        setSetShowBank(true);
    };
    const handleAddNewAccountNumber = () => {
        setSetShowAccountNumber(true);
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
    const handleAddItem = async (newItem) => {
        console.log(newItem);
        try {
            // 1️⃣ Validate required fields
            const requiredFields = ["I_Id", "I_name", "price", "cost", "s_Id", "minQty", "startStock"];
            for (const field of requiredFields) {
                if (!newItem[field]) {
                    toast.error(`⚠️ ${field} is required.`);
                    return;
                }
            }

            // 2️⃣ Validate numeric fields
            const numericFields = ["price", "cost", "minQty", "startStock"];
            for (const field of numericFields) {
                if (isNaN(Number(newItem[field]))) {
                    toast.error(`⚠️ ${field} must be a valid number.`);
                    return;
                }
            }

            // 3️⃣ Prepare material
            const materialToSend = newItem.material ;

            // 4️⃣ Prepare payload
            const payload = {
                ...newItem,
                material: materialToSend,
                sub_two: newItem.sub_two || "None",
            };

            // 5️⃣ Calculate stock totals
            const cost = Number(newItem.cost);
            const quantity = Number(newItem.startStock);
            const itemTotal = cost * quantity;

            const orderData = {
                purchase_id: PurchaseId,
                supplier_id: newItem.s_Id,
                date: currentDate,
                time: currentTime,
                itemTotal,
                delivery: 0,
                invoice: "-",
                items: [
                    {
                        I_Id: newItem.I_Id,
                        material: materialToSend,
                        color: newItem.color || "N/A",
                        unit_price: Number(newItem.price),
                        price: cost,
                        quantity,
                        total_price: itemTotal.toFixed(2)
                    }
                ]
            }; 

            // 6️⃣ Submit Item (JSON)
            const submitResponse = await fetch("http://localhost:5001/api/admin/main/add-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const submitData = await submitResponse.json();
            if (!submitResponse.ok) {
                toast.error(submitData.message || "❌ Failed to add item.");
                return;
            }
            toast.success("✅ Item added successfully!");

            // 7️⃣ Submit Stock Addition (JSON)
            const stockResponse = await fetch("http://localhost:5001/api/admin/main/addStock2", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const stockResult = await stockResponse.json();
            if (!stockResponse.ok) {
                toast.error(stockResult.message || "❌ Failed to save purchase.");
                return;
            }
            toast.success("✅ Purchase saved successfully!");

            fetchItems(); // Refresh items

        } catch (error) {
            console.error("❌ Error submitting form:", error);
            toast.error("❌ An unexpected error occurred.");
        }
    }; 
    const handleAddCoupon = async (newCoupon) => {
        const { couponCode, saleteamCode, discount } = newCoupon;
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/coupone", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ couponCode, saleteamCode, discount }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Coupon ${couponCode} added successfully!`);
                fetchCoupons();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error submitting coupon:", error);
            alert("Failed to add coupon. Please try again.");
        }
    };
    const handleAddBank = async (newBank) => {
        const { bank, branch } = newBank;
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/shop-banks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bank, branch }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(`Bank added successfully!`);
                fetchBankDetails();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error submitting coupon:", error);
            alert("Failed to add coupon. Please try again.");
        }
    };
    const handleAddAccountNumber = async (newAccountNumber) => {
        const { sbID, number } = newAccountNumber;

        try {
            const response = await fetch("http://localhost:5001/api/admin/main/account-numbers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sbID, number }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Account number added successfully!");
                fetchBankDetails();  // Refresh bank & account data
            } else {
                alert(`Error: ${data.error || "Something went wrong"}`);
            }
        } catch (error) {
            console.error("Error adding account number:", error);
            alert("Failed to add account number. Please try again.");
        }
    };
    const handleProduction = (e) => {
        e.preventDefault();

        if (!selectedItemForProduction) return;

        const updatedItem = {
            I_Id: selectedItemForProduction.I_Id,
            material: selectedItemForProduction.material,
            uid: selectedItemForProduction.uid,
            unitPrice: selectedItemForProduction.unitPrice,
            discount: selectedItemForProduction.discount || 0,
            productionData: { ...productionData },
            status: "Production"
        };

        setProcessedItems(prev => [
            ...prev.filter(i => i.uid !== updatedItem.uid),
            updatedItem
        ]);

        setSelectedItemsQTY(prev =>
            prev.map(i => i.uid === updatedItem.uid ? { ...i, status: "Production" } : i)
        );

        setSelectedItemForProduction(null);
        setProductionData({
            supplierId: "",
            qty: "",
            expectdate: "",
            specialnote: ""
        });
        setShowStockModal2(false);
    };
    const ReservedItem = async (selectedItems, selectedItemForReserve) => {
        if (!selectedItems || selectedItems.length === 0 || !selectedItemForReserve) return;

        const reservedWithPid = selectedItems.map(item => ({
            I_Id: selectedItemForReserve.I_Id,
            material: selectedItemForReserve.material,
            uid: selectedItemForReserve.uid,
            unitPrice: selectedItemForReserve.unitPrice,
            discount: selectedItemForReserve.discount || 0,
            pid_Id: item.pid_Id,
            status: "Reserved"
        }));

        setProcessedItems(prev => [
            ...prev.filter(i => !reservedWithPid.find(r => r.uid === i.uid)),
            ...reservedWithPid
        ]);

        setShowStockModal1(false);
    };
   const handleSearchChange1 = (e) => {
        const term = e.target.value.trim();
        setSearchTerm(term);

        const normalize = (str) => (str || "").toLowerCase().trim();

        // Split input by dashes: e.g. BA2D-5-PC_134
        const [itemIdPart, stockIdPart, batchIdPart] = term.split("-");

        const filtered = itemdetails.filter((item) => {
            const matchItemId = itemIdPart ? normalize(item.I_Id).includes(normalize(itemIdPart)) : true;
            const matchStockId = stockIdPart ? normalize(item.stock_Id).includes(normalize(stockIdPart)) : true;
            const matchBatchId = batchIdPart ? normalize(item.pc_Id).includes(normalize(batchIdPart)) : true;

            return matchItemId && matchStockId && matchBatchId;
        });

        setFilteredItems(filtered);
        setDropdownOpen(term !== "" && filtered.length > 0);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            const itemId = selectedItemForReserve?.itemId || selectedItemForReserve?.I_Id;
            fetchStockDetails(itemId);
        }, 500);
    };
    const fetchStockDetails = async (itemId) => {
        if (!itemId) {
            setItemDetails([]);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:5001/api/admin/main/get-stock-detail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setItemDetails(data.stockDetails || []);

            if (!data.stockDetails?.length) {
                toast.error("No stock details found.");
            }
        } catch (error) {
            toast.error("Error fetching stock: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSelectedItem = (item) => {
        const alreadySelected = selectedItems1.some(
            (selected) => selected.I_Id === item.I_Id && selected.pc_Id === item.pc_Id
        );

        if (!alreadySelected) {
            setSelectedItems1([...selectedItems1, { ...item, qty: 1, price: item.price || 0 }]);
        }

        setSearchTerm("");
        setFilteredItems([]);
        setDropdownOpen(false);
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
    const handleRemoveSelectedItem = (indexToRemove) => {
        const updatedItems = selectedItems1.filter((_, index) => index !== indexToRemove);
        setSelectedItems1(updatedItems);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Helmet title="Place order">
            <div id="order" className="order-container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Order Invoice</h1>
                <Form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className='order-details'>
                        <h2 className="text-xl font-bold mb-2">Invoice  --  {orderId}</h2>
                        {/* <h4>{orderId}</h4> */}
                        <hr/>
                        <Row>
                            <Col md={6}>
                                <Label className="fw-bold">Select Order Type</Label>
                                <div className="d-flex gap-3">
                                    <div>
                                        <Input
                                            type="radio"
                                            name="orderType"
                                            value="Walking"
                                            checked={orderType === "Walking"} // Check if this radio button is selected
                                            onChange={() => setOrderType("Walking")} // Update the state when selected
                                        />{" "}
                                        Walking
                                    </div>
                                    <div>
                                        <Input
                                            type="radio"
                                            name="orderType"
                                            value="On-site"
                                            checked={orderType === "On-site"} // Check if this radio button is selected
                                            onChange={() => setOrderType("On-site")} // Update the state when selected
                                        />{" "}
                                        On-Line
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div>
                                    <Label className="fw-bold">Placing Date</Label>
                                    <Input
                                        type="date"
                                        name="orderDate"
                                        value={formData.orderDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Label className="fw-bold">Issuable</Label>
                                
                                <Input type="select" name="issuable" id="issuable" value={formData.issuable}
                                       onChange={handleChange} required>
                                    <option >--Select--</option>
                                    <option value="Now">Now</option>
                                    <option value="Later">Later</option>
                                </Input>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="fw-bold">Bill Number(If have)</Label>
                                    <Input
                                        type="text"
                                        name="billNumber"
                                        value={formData.billNumber}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <h2 className="text-l font-bold mb-2 mt-2">Customer Details</h2>
                        <hr/>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="fw-bold">Category</Label>
                                    <Input type="select" name="category" id="category" value={formData.category}
                                           onChange={handleChange} required>
                                        <option value="">Select Category</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Credit">Credit</option>
                                        <option value="Loyal">Loyal</option>
                                    </Input>
                                </FormGroup>
                            </Col>

                            <Col md={6}>
                                <FormGroup>
                                    <Label className="fw-bold">Type</Label>
                                    <Input type="select" name="type" id="type" value={formData.type}
                                           onChange={handleChange} required>
                                        <option value="">Select type</option>
                                        <option value="Walking">Walking</option>
                                        <option value="On site">On site</option>
                                        <option value="Shop">Shop</option>
                                        <option value="Force">Force</option>
                                        <option value="Hotel">Hotel</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        {/* Show t_name input only for Shop, Force, Hotel */}
                        {["Shop", "Force", "Hotel"].includes(formData.type) && (
                            <FormGroup>
                                <Label for="t_name" className="fw-bold">{formData.type} Name</Label>
                                <Input type="text" name="t_name" value={formData.t_name} onChange={handleChange}
                                       onBlur={() => handleShopNameBlur(formData.t_name,formData.type)}
                                       required/>
                                {errors.t_name && <small className="text-danger">{errors.t_name}</small>}
                            </FormGroup>
                        )}
                        {["Walking", "On site"].includes(formData.type) && (
                            <>
                                <FormGroup>
                                    <Label for="occupation" className="fw-bold">Occupation</Label>
                                    <Input type="text" name="occupation" value={formData.occupation}
                                           onChange={handleChange} />
                                    {errors.occupation &&
                                        <small className="text-danger">{errors.occupation}</small>}
                                </FormGroup>
                                <FormGroup>
                                    <Label for="workPlace" className="fw-bold">Work Place</Label>
                                    <Input type="text" name="workPlace" value={formData.workPlace}
                                           onChange={handleChange} />
                                    {errors.workPlace && <small className="text-danger">{errors.workPlace}</small>}
                                </FormGroup>
                            </>
                        )}
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="fw-bold">Phone Number</Label>
                                    <Input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={() => handlePhoneNumberBlur(formData.phoneNumber)}
                                        required
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={6}>
                                <FormGroup>
                                    <Label className="fw-bold">Optional Number</Label>
                                    <Input
                                        type="text"
                                        name="otherNumber"
                                        value={formData.otherNumber}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <FormGroup className="mt-2">
                                    <Label for="type" className="fw-bold">Title</Label>
                                    <Input type="select" name="title" id="title" value={formData.title}
                                           onChange={handleChange} required>
                                        <option value="">Title</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Dr">Dr</option>
                                        <option value="Rev">Rev</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label className="fw-bold">First Name</Label>
                                    <Input type="text" name="FtName" value={formData.FtName} onChange={handleChange}
                                           required/>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label className="fw-bold">Last Name</Label>
                                    <Input type="text" name="SrName" value={formData.SrName} onChange={handleChange}/>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className="fw-bold">NIC</Label>
                                    <Input type="text" name="id" value={formData.id} onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            {!isNewCustomer && (
                                <Col md={6}>
                                    <FormGroup>
                                        <Label className="fw-bold">Previous Balance</Label>
                                        <Input type="text" name="balance" value={formData.balance}
                                               onChange={handleChange} required/>
                                    </FormGroup>
                                </Col>
                            )}
                        </Row>
                        <FormGroup>
                            <Label className="fw-bold">Address</Label>
                            <Input type="text" name="address" value={formData.address} onChange={handleChange}
                                   required/>
                        </FormGroup>

                    </div>
                    <div className='order-details'>
                        <h2 className="text-xl font-bold mb-2">Order Details</h2>
                        <hr/>
                        <FormGroup>
                            <Label className="fw-bold">Item Selection</Label>

                            {/* Search + Button Row */}
                            <div className="d-flex gap-2 align-items-start mb-2">
                                <Input
                                    type="text"
                                    placeholder="Search items"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    style={{flex: 4}}
                                />
                                <button
                                    type="button"  // <-- Add this line
                                    className="btn btn-primary"
                                    style={{flex: 1, whiteSpace: "nowrap"}}
                                    onClick={handleButtonClick}
                                >
                                    Add New
                                </button>
                            </div>

                            {/* Filtered List */}
                            {searchTerm && filteredItems.length > 0 && (
                                <div className="border rounded bg-white shadow-sm max-h-40 overflow-auto">
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.I_Id}
                                            onClick={() => handleSelectItem(item)}
                                            className="dropdown-item px-3 py-2 border-bottom cursor-pointer hover:bg-light"
                                            style={{cursor: 'pointer'}}
                                        >
                                            {item.I_name} - Rs.{item.price}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FormGroup>
                        <FormGroup className="flex flex-col mb-4">
                            {/* Row 1: Item Info */}
                            <div className="w-full px-2 mb-2">
                                <label className="block text-sm font-medium text-gray-700">Item</label>
                                <input
                                    type="text"
                                    value={selectedItem ? `${selectedItem.I_name} - Rs.${selectedItem.price}` : ""}
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                    disabled
                                />
                            </div>
                        </FormGroup>
                
                        <FormGroup className="flex flex-col mb-4">
                            <div className="item-entry-row">
                                {/* Unit Price */}
                                <div className="item-entry-field">
                                    <label>Unit Price</label>
                                    <input
                                        type="number"
                                        value={selectedItem ? selectedItem.price : ""}
                                        disabled
                                    />
                                </div>

                                {/* Selling Price */}
                                <div className="item-entry-field">
                                    <label>Selling Price</label>
                                    <input
                                        type="text"
                                        value={sellingPrice}
                                        onChange={(e) => {
                                        let value = e.target.value;

                                        // Remove leading zero unless it's "0." for decimals
                                        if (value.startsWith("0") && !value.startsWith("0.")) {
                                            value = value.replace(/^0+/, "");
                                        }

                                        if (/^\d*\.?\d*$/.test(value)) {
                                            setSellingPrice(value);

                                            if (selectedItem && value !== "") {
                                            const discountValue = (
                                                selectedItem.price - parseFloat(value)
                                            ).toFixed(2);

                                            setDiscount(discountValue > 0 ? discountValue : "");
                                            } else {
                                            setDiscount("");
                                            }
                                        }
                                        }}
                                    />
                                </div>

                                {/* Item Discount */}
                                <div className="item-entry-field">
                                    <label>Item Discount</label>
                                    <input
                                        type="text"
                                        value={discount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*\.?\d*$/.test(value)) {
                                                setDiscount(value);
                                                if (selectedItem && value !== "") {
                                                    const priceAfterDiscount = (selectedItem.price - parseFloat(value)).toFixed(2);
                                                    setSellingPrice(priceAfterDiscount > 0 ? priceAfterDiscount : "0");
                                                }
                                            }
                                        }}
                                        placeholder="Enter discount"
                                    />
                                </div>

                                {/* Qty */}
                                <div className="item-entry-field">
                                    <label>Qty</label>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setQuantity(value);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (quantity === "" || parseInt(quantity) < 1) {
                                                setQuantity("1");
                                            }
                                        }}
                                        placeholder="Enter qty"
                                    />
                                </div>

                                {/* Total */}
                                <div className="item-entry-field">
                                    <label>Total</label>
                                    <input
                                        type="number"
                                        value={
                                            selectedItem && sellingPrice
                                                ? (parseFloat(sellingPrice) * parseInt(quantity || 1)).toFixed(2)
                                                : ""
                                        }
                                        disabled
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="item-entry-actions">
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        disabled={!selectedItem}
                                        onClick={() => {
                                            setSelectedItem(null);
                                            setDiscount("0");
                                            setQuantity("1");
                                            setSellingPrice("");
                                        }}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        type="button"
                                        id="addOrderDetail"
                                        className="add-btn"
                                        onClick={handleAddToOrder}
                                    >
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        </FormGroup>

                        {/* Order Details Table */}
                        <div className="overflow-auto max-w-full">
                            <table className="min-w-[600px] bg-white border rounded-lg shadow-md mb-6 mt-3">
                                <thead className="bg-blue-500 text-white">
                                <tr>
                                    <th>Product</th>
                                    <th>Unit Price</th>
                                    <th>Special Discount</th>
                                    <th>Gross Total</th>
                                    <th>Qty</th>
                                    <th>Net Total</th>
                                    <th>Remove</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedItems.length > 0 ? (
                                    selectedItems.map((item, index) => {
                                        const unitPrice = item.originalPrice || item.price;
                                        const discount = item.discount || 0;
                                        const grossTotal = unitPrice - discount;
                                        const netTotal = grossTotal * item.qty;

                                        return (
                                            <tr key={index}>
                                                <td className="">{item.I_name}</td>
                                                <td>Rs.{unitPrice.toFixed(2)}</td>
                                                <td>Rs.{discount.toFixed(2)}</td>
                                                <td>Rs.{grossTotal.toFixed(2)}</td>
                                                <td>{item.qty}</td>
                                                <td className="font-semibold text-green-700">Rs.{netTotal.toFixed(2)}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Remove Item"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-3 text-gray-500">
                                            No items added yet.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        {formData.issuable === "Later" && (
                            <div className="overflow-auto max-w-full">
                                <table className="min-w-[600px] bg-white border rounded-lg shadow-md mb-6 mt-3">
                                    <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th>Id</th>
                                        <th>Product</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedItemsQty.length > 0 ? (
                                        selectedItemsQty.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.I_name}</td>
                                                <td>
                                                    <select
                                                        className="border border-gray-300 rounded p-1"
                                                        value={item.status || ""}
                                                        onChange={(e) => handleStatusChange(index, e.target.value, item)}
                                                    >
                                                        <option value="">Select Status</option>
                                                        <option value="Booked">Booked</option>
                                                        <option value="Reserved">Reserved</option>
                                                        <option value="Production">Production</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center text-gray-500 py-2">No items added yet.</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <FormGroup>
                            <Label className="fw-bold">Special Note</Label>
                            <Input type="textarea" name="specialNote" onChange={handleChange}></Input>
                        </FormGroup>
                    </div>
                    
                    <div className="order-details">
                        <h2 className="text-xl font-bold mb-2">Delivery Details</h2>
                        <hr/>
                        <FormGroup>
                            <Label className="fw-bold">Delivery Method</Label>
                            <div className="d-flex gap-3">
                                <Label>
                                    <Input type="radio" name="dvStatus" value="Delivery"
                                           onChange={handleChange}/> Delivery
                                </Label>
                                <Label>
                                    <Input type="radio" name="dvStatus" value="Pickup" onChange={handleChange}/> Pickup
                                </Label>
                                <Label>
                                    <Input type="radio" name="dvStatus" value="Courier" onChange={handleChange}/> Courier
                                </Label>
                            </div>
                        </FormGroup>
                        {formData.dvStatus === "Delivery" && (
                            <FormGroup>
                                <Label className="fw-bold">Delivery Type</Label>
                                <div className="d-flex gap-3">
                                    <Label>
                                        <Input type="radio" name="dvtype" value="Direct"
                                               onChange={handleChange}/> Direct
                                    </Label>
                                    <Label>
                                        <Input type="radio" name="dvtype" value="Combined"
                                               onChange={handleChange}/> Combined
                                    </Label>
                                </div>
                            </FormGroup>
                        )}
                        {formData.dvtype === "Direct" && (
                            <>
                                <FormGroup>
                                    <Label className="fw-bold">Address</Label>
                                    <Input type="text" name="address" value={formData.address} onChange={handleChange}
                                           readOnly/>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="isAddressChanged"
                                               checked={formData.isAddressChanged || false} onChange={handleChange}/>
                                        Changed Address
                                    </Label>
                                </FormGroup>
                                {formData.isAddressChanged && (
                                    <FormGroup>
                                        <Label className="fw-bold">New Address</Label>
                                        <Input type="text" name="newAddress" value={formData.newAddress || ""}
                                               onChange={handleChange} required/>
                                    </FormGroup>
                                )}
                                <FormGroup>
                                    <Label className="fw-bold">Expected Date</Label>
                                    <Input type="date" name="expectedDate" onChange={handleChange}/>
                                </FormGroup>
                                {formData.expectedDate && (
                                    <p className={`text-${availableDelivery ? "success" : "danger"}`}>
                                        {availableDelivery ? "Delivery is available on this date" : "No delivery available on this date"}
                                    </p>
                                )}
                                <FormGroup>
                                    <Label className="fw-bold">Delivery Charge</Label>
                                    <Input type="text" name="deliveryCharge" onChange={handleChange}/>
                                </FormGroup>
                            </>
                        )}
                        {formData.dvtype === "Combined" && (
                            <>
                                <FormGroup>
                                    <Label className="fw-bold">Address</Label>
                                    <Input type="text" name="address" value={formData.address} onChange={handleChange}
                                           required/>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name="isAddressChanged"
                                               checked={formData.isAddressChanged || false} onChange={handleChange}/>
                                        Changed Address
                                    </Label>
                                </FormGroup>
                                {formData.isAddressChanged && (
                                    <FormGroup>
                                        <Label className="fw-bold">New Address</Label>
                                        <Input type="text" name="newAddress" value={formData.newAddress || ""}
                                               onChange={handleChange} required/>
                                    </FormGroup>
                                )}
                                <FormGroup>
                                    <Label className="fw-bold">District</Label>
                                    <Input type="select" name="district" value={formData.district}
                                           onChange={handleChange} required>
                                        <option value="">Select District</option>
                                        {districts.map((district) => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                {deliveryDates.length > 0 ? (
                                    <FormGroup>
                                        <Label className="fw-bold">Expected Delivery Date</Label>
                                        <Input type="select" name="expectedDate" onChange={handleChange}>
                                            <option value="">Select Date</option>
                                            {deliveryDates.map((date, index) => (
                                                <option key={index} value={date}>{date}</option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                ) : (
                                    <FormGroup>
                                        <Label className="fw-bold">Expected Delivery Date</Label>
                                        <Input type="date" name="expectedDate" onChange={handleChange}></Input>
                                    </FormGroup>
                                )}
                            </>
                        )}
                        {formData.dvStatus === "Courier" && (
                            <>
                                <FormGroup>
                                    <Label className="fw-bold">Expected Date</Label>
                                    <Input type="date" name="expectedDate" onChange={handleChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label className="fw-bold">Courier Charge</Label>
                                    <Input type="text" name="courierCharge" onChange={handleChange}/>
                                </FormGroup>
                            </>
                        )}
                        {formData.dvStatus === "Pickup" && (
                            <>
                                <FormGroup>
                                    <Label className="fw-bold">City</Label>
                                    <Input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label className="fw-bold">Expected Date</Label>
                                    <Input
                                        type="date"
                                        name="expectedDate"
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </>
                        )}
                        
                    </div>

                    <div className="order-details">
                        <h2 className="text-xl font-bold mb-2">Discount Details</h2>
                        <hr/>

                        <FormGroup>
                            <Label className="fw-bold">Coupon Code</Label>
                            <Row>
                                <Col md={8}>
                                    <Input type="select" name="couponCode" onChange={handleChange}>
                                        <option value="">Select Coupon</option>
                                        {coupons.map((coupon) => (
                                            <option key={coupon.id} value={coupon.coupon_code}>
                                                {coupon.coupon_code} == ({coupon.employee_name} {coupon.discount} Off)
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                                <Col md={4}>
                                    <Button color="primary" block onClick={handleAddNewCoupon}>
                                        Add New
                                    </Button>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Label className="fw-bold">Special Discount</Label>
                            <Input
                                type="text"
                                name="specialDiscount"
                                value={specialdiscountAmount}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    setSpecialDiscountAmount(value);
                                }}
                            />
                        </FormGroup>
                    </div>
                    <div className="order-details mt-4 border rounded-lg p-4 bg-white shadow-sm w-full max-w-md">
                        <div className="custom-line-items space-y-2">
                            {[
                                { label: 'Total Amount  ()', value: totalItemPricebeforeDiscount },
                                { label: 'Item Discount  (➖)', value: itemdiscountAmount },
                                { label: 'Total Item Price  ()', value: totalItemPrice },
                                { label: 'Coupon Discount   (➖)', value: discountAmount },
                                { label: 'Special Discount   (➖)', value: specialdiscountAmount },
                                { label: 'Delivery Fee      (➕)', value: deliveryPrice },
                                
                                
                                
                            ].map((item, index) => (
                                <div key={index} className="custom-line-item flex justify-between border-b pb-1">
                                    <span className="custom-label">{item.label}</span>
                                    <span className="custom-value">Rs.{item.value}</span>
                                </div>
                            ))}

                            <div className="custom-total flex justify-between font-semibold border-t pt-3 mt-3">
                                <span className="custom-label">Bill Amount</span>
                                <span className="custom-value">Rs.{grossBillTotal}</span>
                            </div>

                            {[
                                { label: 'Previous OutStanding  (➕/➖)', value: previousbalance },
                            ].map((item, index) => (
                                <div key={index} className="custom-line-item flex justify-between border-b pb-1">
                                    <span className="custom-label">{item.label}</span>
                                    <span className="custom-value">Rs.{item.value}</span>
                                </div>
                            ))}
                            <div className="custom-total flex justify-between font-semibold border-t pt-3 mt-3">
                                <span className="custom-label">Gross Amount</span>
                                <span className="custom-value">Rs.{totalBillPrice}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-details">
                        <h2 className="text-xl font-bold mb-2">Payment Methods</h2>
                        <hr/>
                        <Row>
                            <Label className="fw-bold">Payment Method</Label>
                            <Col md={6}>
                                <FormGroup>
                                    <Input
                                        type="select"
                                        name="payment"
                                        id="payment"
                                        value={formData.payment}
                                        onChange={handleChange}
                                        required
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
                                        onChange={handleChange1}
                                       
                                        disabled={!formData.payment}
                                    >
                                        <option value="">Select Sub Option</option>
                                        {secondOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        {formData.payment === "Cash" && (formData.subPayment === "Cash") && (
                            <>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net Amount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Payment Amount</span>
                                    <span className="custom-info-value">
                                        <Input
                                            type="text"
                                            name="advance"
                                            value={advance}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Allow only numbers and a single dot
                                                if (/^\d*\.?\d*$/.test(val)) {
                                                    setAdvance(val);
                                                }
                                            }}
                                            required
                                            className="w-full text-right" // Optional: Align input text to the right
                                        />
                                    </span>
                                </div>

                            <div className="custom-info-row">
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>
                            </>
                        )}

                        {formData.payment === "Cash" && formData.subPayment === "Transfer" && (
                            <>
                                {/* Net Amount */}
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net Amount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
                                </div>

                                {/* Payment Amount */}
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Payment Amount</span>
                                    <span className="custom-info-value">
                                        <Input
                                            type="text"
                                            name="advance"
                                            value={advance}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d*\.?\d*$/.test(val)) {
                                                    setAdvance(val);
                                                }
                                            }}
                                            required
                                            className="w-full text-right"
                                        />
                                    </span>
                                </div>

                                {/* Bank Dropdown + Add */}
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

                                        <button
                                            type="button"
                                            onClick={handleAddNewBank}
                                            className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                                        >
                                            <span className="text-xl mr-1">➕</span>
                                        </button>
                                    </span>
                                </div>

                                {/* Account Number Dropdown + Add */}
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


                                        <button
                                            type="button"
                                            onClick={handleAddNewAccountNumber}
                                            className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                                        >
                                            <span className="text-xl mr-1">➕</span>
                                        </button>
                                    </span>
                                </div>

                                {/* Balance */}
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>
                            
                            </>
                        )}
                        {formData.payment === "Card" &&
                            (formData.subPayment === "Debit Card" || formData.subPayment === "Credit Card") && (
                                <>
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
                                                        setAdvance(val); // Reflect in general payment state
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
                                        <span className="custom-info-label">Balance</span>
                                        <span className="custom-info-value">Rs.{balance}</span>
                                    </div>
                                </>
                            )}
                        {formData.payment === "Cheque" && (
                            <>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net Amount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
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
                                        setAdvance(val); // Reflect in general payment state
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
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>
                                    <div className="custom-info-row">
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
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
                        {formData.payment === "Credit" && (
                            <>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net Amount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
                                </div>
                                <div className="custom-info-row">
                                <span className="custom-info-label">Payment Amount</span>
                                <span className="custom-info-value">
                                    <Input
                                    type="text"
                                    name="amount"
                                    value={creditAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*\.?\d*$/.test(val)) {
                                        setCreditAmount(val);
                                        setAdvance(val); // Reflect in general payment state
                                        }
                                    }}
                                    required
                                    className="w-full text-right"
                                    />
                                </span>
                                </div>

                                <div className="custom-info-row">
                                <span className="custom-info-label">Expected Date</span>
                                <span className="custom-info-value">
                                    <Input
                                    type="date"
                                    name="expectedDate"
                                    value={creditExpectedDate}
                                    onChange={(e) => setCreditExpectedDate(e.target.value)}
                                    required
                                    className="w-full text-right"
                                    />
                                </span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>
                            </>
                        )}
                        {formData.payment === "Combined" && (formData.subPayment === "Cash & Card") && (
                            <>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net Amount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Cash Amount</span>
                                    <span className="custom-info-value">
                                        <Input
                                            type="text"
                                            name="advance"
                                            value={combinedCardBalance}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Allow only numbers and a single dot
                                                if (/^\d*\.?\d*$/.test(val)) {
                                                    setCombinedCardBalance(val);
                                                }
                                            }}
                                            required
                                            className="w-full text-right" // Optional: Align input text to the right
                                        />
                                    </span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Card Balance</span>
                                    <span className="custom-info-value">Rs.{parseFloat(cardPortion).toFixed(2)}</span>
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
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>
                            </>
                        )}
                        {formData.payment === "Combined" && formData.subPayment === "Cash & Cheque" && (
                            <>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net Amount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
                                </div>

                                <div className="custom-info-row">
                                    <span className="custom-info-label">Cash Amount</span>
                                    <span className="custom-info-value">
                                        <Input
                                            type="text"
                                            name="cashAmount"
                                            value={combinedChequeBalance}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d*\.?\d*$/.test(val)) {
                                                    setCombinedChequeBalance(val);
                                                }
                                            }}
                                            className="w-full text-right"
                                        />
                                    </span>
                                </div>

                                <div className="custom-info-row">
                                    <span className="custom-info-label">Cheque Balance</span>
                                    <span className="custom-info-value">Rs.{(grossAmount - parseFloat(combinedChequeBalance || 0)).toFixed(2)}</span>
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
                                    <span className="custom-info-value">Rs.{balance}</span>
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
                        {formData.payment === "Combined" && formData.subPayment === "Cash & Credit" && (
                            <>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net AMount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Cash Amount</span>
                                    <span className="custom-info-value">
                                        <Input
                                            type="text"
                                            name="advance"
                                            value={combinedCreditBalance}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d*\.?\d*$/.test(val)) {
                                                    setCombinedCreditBalance(val);
                                                }
                                            }}
                                            required
                                            className="w-full text-right"
                                        />
                                    </span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Credit Balance</span>
                                    <span className="custom-info-value">
                                        Rs.{parseFloat(creditPortion).toFixed(2)}
                                    </span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Expected Date</span>
                                    <span className="custom-info-value">
                                        <Input
                                            type="date"
                                            name="expectedDate"
                                            value={creditExpectedDate}
                                            onChange={(e) => setCreditExpectedDate(e.target.value)}
                                            required
                                            className="w-full text-right"
                                        />
                                    </span>
                                </div>
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>
                            </>
                        )}
                        {formData.payment === "Combined" && formData.subPayment === "Cash & Transfer" && (
                            <>
                                {/* Net Amount */}
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Net Amount</span>
                                    <span className="custom-info-value">Rs.{grossAmount}</span>
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

                                        <button
                                            type="button"
                                            onClick={handleAddNewBank}
                                            className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                                        >
                                            <span className="text-xl mr-1">➕</span>
                                        </button>
                                    </span>
                                </div>

                                {/* Account Number Dropdown */}
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Account Number</span>
                                    <span className="custom-info-value flex items-center gap-2">
                                        <select
                                            className="w-full text-right"
                                            value={selectedAccount}
                                            onChange={(e) => setSelectedAccount(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Account</option>
                                            {availableAccounts.map((acc) => (
                                                <option key={acc.acnID} value={acc.number}>
                                                    {acc.number}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            onClick={handleAddNewAccountNumber}
                                            className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                                        >
                                            <span className="text-xl mr-1">➕</span>
                                        </button>
                                    </span>
                                </div>

                                {/* Balance */}
                                <div className="custom-info-row">
                                    <span className="custom-info-label">Balance</span>
                                    <span className="custom-info-value">Rs.{balance}</span>
                                </div>

                            </>
                        )}
                    </div>
                    <Row>
                        <Col md="4"><Button type="submit" color="primary" block>Place Order</Button></Col>
                        <Col md="4">
                            <Button
                                type="button"
                                color="secondary"
                                block
                                onClick={generateBill}
                                disabled={order.length === 0}
                            >
                                Print Bill
                            </Button>
                        </Col>

                        <Col md="4"><Button type="button" color="danger" block onClick={handleClear}>Clear</Button></Col>
                    </Row>
                </Form>

                {showModal && (
                    <AddNewItem
                        setShowModal={setShowModal}
                        handleSubmit2={handleAddItem}
                    />
                )}

                {showModal1 && (
                    <AddNewCoupone
                        setShowModal1={setShowModal1}
                        handleSubmit2={handleAddCoupon}
                    />
                )}

                {setShowBank && (
                    <AddNewBank
                        setShowBank={setSetShowBank}
                        handleSubmitBank={handleAddBank}
                    />
                )}

                {setShowAccountnumber && (
                    <AddNewAccountNumber
                        setShowAccountNumber = {setSetShowAccountNumber}
                        handleSubmitAccountNumber= {handleAddAccountNumber}
                    />
                )}


                {showModal2 && selectedOrder && (
                    <FinalInvoice1
                        selectedOrder={selectedOrder}
                        setShowModal2={setShowModal2}
                        handlePaymentUpdate={handleSubmit3}
                        handleDeliveryNote={viewHandle}
                        handleGatePass={viewHandle1}
                    />
                )}
                {showModal3 && selectedOrder && (
                    <MakeDeliveryNoteNow
                        selectedOrders={selectedOrder}
                        setShowModal={setShowModal3}
                        handleDeliveryUpdate={handleSubmit2}
                    />
                )}
                {showReceiptView && (
                    <ReceiptView
                        receiptData={receiptData}
                        setShowReceiptView={setShowReceiptView}
                    />
                )}
                
                {showModal4 && selectedOrder && (
                    <MakeGatePassNow
                        selectedOrders={selectedOrder}
                        setShowModal={setShowModal4}
                        handleGatepassUpdate={handleSubmit4}
                    />
                )}
                {showDeliveryView && (
                    <DeliveryNoteViewNow
                        receiptData={receiptDataD}
                        setShowDeliveryView={setShowDeliveryView}
                    />
                )}
                {showGatepassView && (
                    <GatePassView
                        receiptData={receiptDataD}
                        setShowDeliveryView={setGatePassView}
                    />
                )}
                <Modal isOpen={showStockModal1} toggle={() => setShowStockModal1(!showStockModal1)}>
                    <ModalHeader toggle={() => setShowStockModal1(!showStockModal1)}>
                        Special Reserved
                    </ModalHeader>
                    <ModalBody>
                        {selectedItemForReserve && (
                            <div className="mb-3">
                                <strong>Selected Item ID:</strong>{" "}
                                {selectedItemForReserve.itemId || selectedItemForReserve.I_Id || "N/A"}
                            </div>
                        )}

                        <FormGroup style={{ position: "relative" }}>
                            <Label>Search Item by ID</Label>
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange1}
                                placeholder="Search: e.g. BA2D-5-PC_134"
                                autoComplete="off"
                            />
                            {dropdownOpen && filteredItems.length > 0 && (
                                <div
                                    className="dropdown"
                                    style={{
                                        position: "absolute",
                                        zIndex: 100,
                                        backgroundColor: "white",
                                        border: "1px solid #ddd",
                                        width: "100%",
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.I_Id + item.stock_Id}
                                            onClick={() => handleSelectedItem(item)}
                                            className="dropdown-item"
                                            style={{ padding: "8px", cursor: "pointer" }}
                                        >
                                            {item.I_Id} - {item.stock_Id} - {item.pc_Id}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FormGroup>

                        <Label className="mt-3">Selected Items</Label>
                        <table className="selected-items-table">
                            <thead>
                                <tr>
                                    <th>Item ID</th>
                                    <th>Stock ID</th>
                                    <th>Batch ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems1.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.I_Id}</td>
                                        <td>{item.stock_Id}</td>
                                        <td>{item.pc_Id}</td>
                                        <td>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => handleRemoveSelectedItem(index)}
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={() => ReservedItem(selectedItems1, selectedItemForReserve)}
                        >
                            Pass
                        </Button>
                        <Button color="secondary" onClick={() => setShowStockModal1(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                 
                <Modal isOpen={showStockModal2} toggle={() => setShowStockModal2(!showStockModal2)}>
                    <ModalHeader toggle={() => setShowStockModal2(!showStockModal2)}>
                        Supplier Production
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleProduction}>
                            <FormGroup>
                                <Label for="supplierId"><strong>Select Supplier</strong></Label>
                                <Input
                                    type="select"
                                    name="supplierId"
                                    id="supplierId"
                                    value={productionData.supplierId}
                                    onChange={handleFormChange}
                                >
                                    <option value="">-- Select Supplier --</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.s_ID} value={supplier.s_ID}>
                                            {supplier.name} (ID: {supplier.s_ID}) - {supplier.contact}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>

                            <Card className="supplier-order-card">
                                <CardBody>
                                    <Row>
                                        <Col lg={6}>
                                            <FormGroup>
                                                <Label for="supplierId"><strong>Supplier ID</strong></Label>
                                                <Input
                                                    type="text"
                                                    name="supplierId"
                                                    id="supplierId"
                                                    value={productionData.supplierId}
                                                    disabled
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={6}>
                                            <FormGroup>
                                                <Label for="qty"><strong>Order Quantity</strong></Label>
                                                <Input
                                                    type="text"
                                                    name="qty"
                                                    id="qty"
                                                    value={productionData.qty}
                                                    onChange={handleFormChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Label for="expectdate"><strong>Expected Date</strong></Label>
                                        <Input
                                            type="date"
                                            name="expectdate"
                                            id="expectdate"
                                            value={productionData.expectdate}
                                            onChange={handleFormChange}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="specialnote"><strong>Special Note</strong></Label>
                                        <Input
                                            type="textarea"
                                            name="specialnote"
                                            id="specialnote"
                                            value={productionData.specialnote}
                                            onChange={handleFormChange}
                                        />
                                    </FormGroup>
                                </CardBody>
                            </Card>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleProduction}>
                            Pass
                        </Button>
                        <Button color="secondary" onClick={() => setShowStockModal2(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <Popup open={openPopup} onClose={() => setOpenPopup(false)} modal closeOnDocumentClick>
                    <div className="p-4">
                        <h4 style={{color: "red"}}>Validation Errors</h4>
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index} style={{color: "red"}}>{error}</li>
                            ))}
                        </ul>
                        <button className="btn btn-primary mt-2" onClick={() => setOpenPopup(false)}>Close</button>
                    </div>
                </Popup>
            </div>
        </Helmet>

    );
};
export default OrderInvoice;

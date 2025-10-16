import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import CashierDashboard from "../pages/Dashboard/CashierDashboard";
import SaleTeamDashboard from "../pages/Dashboard/SaleTeamDashboard";
import DriverDashboard from "../pages/Dashboard/DriverDashboard";
import ItDashboard from "../pages/Dashboard/ItDashboard";
import AllOrders from "../pages/AllOrders";
import AllProducts from "../pages/AllProducts";
import AllCustomers from "../pages/AllCustomers";
import AllSuppliers from "../pages/AllSuppliers";
import AllEmployees from "../pages/AllEmployees";
import AllVehicles from "../pages/AllVehicles";
import AllDeliveryNotes from "../pages/AllDeliveryNotes";
import OrderInvoice from "../pages/OrderInvoice";
import Orders from "../pages/OrderManagement";
import AdminHome from "../pages/AdminHome";
import LoginPage from "../pages/LoginPage";
import AllLeaves from "../pages/AllLeaves";
import AllPayments from "../pages/AllPayments";
// Details pages
import OrderDetails from "../pages/OrderDetails";
import ItemDetails from "../pages/ItemDetails";
import SupplierDetails from "../pages/Supplier";
import User from "../pages/User";
import AccepetOrderDetails from "../pages/AccepetOrder";
import ReturnedOrderDetails from "../pages/ReturnedOrder";
import CompleteOrderDetails from "../pages/CompletedOrders";
import ProdutionOrderDetails from "../pages/ProcessingOrders";
import SaleteamDetail from "../pages/SaleteamDetail";
import IssuedOrderDetails from "../pages/IssuedOrder";
import DeliveredOrderDetails from "../pages/DeliveredOrdersDetails";
import DeliveryNoteDetails from "../pages/DeliveryNoteDetails";
import DeliveryNoteDetailsDrive from "../pages/DeliveryNoteDetailsDrive";
import DeliveryNotes from "../pages/DeliveryNotes";
import GatePass from "../pages/Gatepass";
import CancelOrderDetails from "../pages/CanceledOrder";
import AdvancePayment from "../pages/AdancePayment";
import PurchaseNoteDetails from "../pages/PurchaseNoteDetails";
import AllGrahps from "../pages/AllGraphs";
import AllDeliveryNotesDrive from "../pages/AllDeliveryNotesDriver";
import TableItemPriceList from "../components/tables/TableItemPriceList";
import CustomerDetailsView from "../pages/CustomerDetailsView";
import OrderPayment from "../pages/OrderPayment";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/SignIn" />} />
            <Route path="/SignIn" element={<LoginPage />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />}>
                <Route index element={<AdminHome />} />
                <Route path="item_prices" element={<TableItemPriceList />} />
                <Route path="customers" element={<AllCustomers />} />
                <Route path="itDept" element={<AllCustomers />} />
                <Route path="products" element={<AllProducts />} />
                <Route path="orders" element={<OrderInvoice />} />
                <Route path="product_list" element={<AllOrders />} />
                <Route path="graphs" element={<AllGrahps />} />
                <Route path="suppliers" element={<AllSuppliers />} />
                <Route path="employees" element={<AllEmployees />} />
                <Route path="delivery" element={<AllDeliveryNotes />} />
                <Route path="vehicles" element={<AllVehicles />} />
                <Route path="payments" element={<AllPayments />} />

            </Route>

            <Route path="/chashier-dashboard" element={<CashierDashboard />}>
                <Route index element={<OrderInvoice />} />
                <Route path="item_prices" element={<TableItemPriceList />} />
                <Route path="orders" element={<OrderInvoice />} />
            </Route>
            <Route path="/user-dashboard" element={<SaleTeamDashboard />}>
                <Route index element={<AdminHome />} />
                <Route path="item_prices" element={<TableItemPriceList />} />
                <Route path="product_list" element={<AllOrders />} />
                <Route path="orders" element={<OrderInvoice />} />
                <Route path="leave" element={<AllLeaves />} />
            </Route>
            <Route path="/driver-dashboard" element={<DriverDashboard />}>
                <Route index element={<AdminHome />} />
                <Route path="delivery" element={<AllDeliveryNotesDrive />} />
                <Route path="leave" element={<AllLeaves />} />
            </Route>
            <Route path="/it-dashboard" element={<ItDashboard />}>
                <Route index element={<AdminHome />} />
                <Route path="leave" element={<AllLeaves />} />
            </Route>

            {/* Other non-dashboard routes */}
            <Route path="dashboard/add-products" element={<AllProducts />} />
            <Route path="dashboard/users" element={<User />} />
            <Route path="dashboard/orders" element={<Orders />} />
            <Route path="order-detail/:id" element={<OrderDetails />} />
            <Route path="accept-order-detail/:id" element={<AccepetOrderDetails />} />
            <Route path="issued-order-detail/:id" element={<IssuedOrderDetails />} />
            <Route path="deiverd-order-detail/:id" element={<DeliveredOrderDetails />}/>
            <Route path="deliveryNote-detail/:id" element={<DeliveryNoteDetails />} />
            <Route path="deliveryNote-detail-drive/:id" element={<DeliveryNoteDetailsDrive />} />
            <Route path="complete-order-detail/:id" element={<CompleteOrderDetails />} />
            <Route path="prodution-order-detail/:id" element={<ProdutionOrderDetails />} />
            <Route path="returned-order-detail/:id" element={<ReturnedOrderDetails />} />
            <Route path="cancel-order-detail/:id" element={<CancelOrderDetails />} />
            <Route path="item-detail/:id" element={<ItemDetails />} />
            <Route path="supplier-detail/:id" element={<SupplierDetails />} />
            <Route path="saleteam-detail/:id" element={<SaleteamDetail />} />
            <Route path="create-delivery-note" element={<DeliveryNotes />} />
            <Route path="create-gatepass" element={<GatePass />} />
            <Route path="place-order" element={<OrderInvoice />} />
            <Route path="order-payment" element={<OrderPayment />} />
            <Route path="advance" element={<AdvancePayment />} />
            <Route path="purchase-detail/:id" element={<PurchaseNoteDetails />} />
            <Route path="/customer-details/:c_ID" element={<CustomerDetailsView />} />

        </Routes>
    );
};

export default Router

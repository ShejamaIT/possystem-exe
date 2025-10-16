import React, { useState } from 'react';
import '../style/OrderManagement .css'
const OrderManagement = () => {
    const [orderData, setOrderData] = useState({
        orderId: '',
        orderDate: '',
        customerId: '',
        customerName: '',
        customerContact: '',
        stockId: '',
        productId: '',
        productDetail: '',
        availableQty: 0,
        productSellingPrice: 0,
        quantity: 1,
        total: 0,
        paymentMethod: '',
        amountPaid: 0,
        balance: 0,
        bankNo: '',
        bankName: '',
    });

    const [orderDetails, setOrderDetails] = useState([]);
    const [paymentMethodVisible, setPaymentMethodVisible] = useState(false);
    const [isCashPayment, setIsCashPayment] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData({ ...orderData, [name]: value });
    };

    const handleAddOrderDetail = () => {
        const newOrderDetail = {
            productId: orderData.productId,
            productDetail: orderData.productDetail,
            productSellingPrice: orderData.productSellingPrice,
            quantity: orderData.quantity,
        };

        setOrderDetails([...orderDetails, newOrderDetail]);
        calculateTotal(newOrderDetail);
    };

    const calculateTotal = (newOrderDetail) => {
        const totalAmount = orderDetails.reduce((acc, item) => acc + item.productSellingPrice * item.quantity, 0);
        setOrderData({ ...orderData, total: totalAmount + newOrderDetail.productSellingPrice * newOrderDetail.quantity });
    };

    const handlePaymentMethodChange = (e) => {
        const method = e.target.value;
        setOrderData({ ...orderData, paymentMethod: method });
        setPaymentMethodVisible(true);
        setIsCashPayment(method === 'CASH');
    };

    return (
        <div id="order" className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Order Management</h1>
            <form id="orderForm" className="mb-8">
                {/* Order ID */}
                <div className="mb-4">
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">Order ID</label>
                    <input type="text" id="orderId" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.orderId} disabled />
                </div>

                {/* Order Date */}
                <div className="mb-4">
                    <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700">Order Date</label>
                    <input type="date" id="orderDate" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.orderDate} disabled />
                </div>

                {/* Customer Selection */}
                <div className="mb-4">
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer ID</label>
                    <select id="customerId" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.customerId} onChange={handleChange}>
                        {/* Options for customers */}
                    </select>
                    <div id="customerDetails" className="mt-2">
                        <p id="customerName" className="text-sm text-gray-600">{orderData.customerName}</p>
                        <p id="customerContact" className="text-sm text-gray-600">{orderData.customerContact}</p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Order Details</h2>
                    <div className="flex mb-4">
                        <div className="w-1/3">
                            <label htmlFor="stockId" className="block text-sm font-medium text-gray-700">Stock ID</label>
                            <select id="stockId" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.stockId} onChange={handleChange}>
                                {/* Options for stock */}
                            </select>
                        </div>
                        <div className="w-1/3 mx-2">
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product ID</label>
                            <input type="text" id="productId" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.productId} disabled />
                        </div>
                        <div className="w-1/3 mx-2">
                            <label htmlFor="productDetail" className="block text-sm font-medium text-gray-700">Product Detail</label>
                            <input type="text" id="productDetail" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.productDetail} disabled />
                        </div>
                    </div>

                    {/* Available Quantity and Selling Price */}
                    <div className="flex mb-4">
                        <div className="w-1/3 mx-2">
                            <label htmlFor="availableQty" className="block text-sm font-medium text-gray-700">Available Quantity</label>
                            <input type="text" id="availableQty" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.availableQty} disabled />
                        </div>
                        <div className="w-1/3 mx-2">
                            <label htmlFor="productSellingPrice" className="block text-sm font-medium text-gray-700">Product Unit Selling Price</label>
                            <input type="text" id="productSellingPrice" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.productSellingPrice} disabled />
                        </div>
                        <div className="w-1/3">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input type="text" id="quantity" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.quantity} onChange={handleChange} />
                        </div>
                    </div>

                    <button type="button" id="addOrderDetail" className="bg-green-500 text-white p-2 rounded-md" onClick={handleAddOrderDetail}>Add to Order</button>

                    {/* Order Details Table */}
                    <table className="min-w-full bg-white border rounded-lg shadow-md mb-6 mt-3">
                        <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-2">Product ID</th>
                            <th className="px-4 py-2">Product Details</th>
                            <th className="px-4 py-2">Unit Selling Price</th>
                            <th className="px-4 py-2">Quantity</th>
                        </tr>
                        </thead>
                        <tbody id="orderDetailsTable">
                        {orderDetails.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{item.productId}</td>
                                <td className="px-4 py-2">{item.productDetail}</td>
                                <td className="px-4 py-2">{item.productSellingPrice}</td>
                                <td className="px-4 py-2">{item.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Total Price */}
                    <div className="mt-4">
                        <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total</label>
                        <input type="text" id="total" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.total} disabled />
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select id="paymentMethod" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.paymentMethod} onChange={handlePaymentMethodChange}>
                        <option value="">Select Payment Option</option>
                        <option value="CASH">Cash</option>
                        <option value="CARD">Card</option>
                    </select>
                </div>

                {/* Cash Payment Details */}
                {isCashPayment && (
                    <div id="cashDetails" className="mb-4">
                        <div className="mb-4">
                            <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">Amount Paid</label>
                            <input type="text" id="amountPaid" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.amountPaid} onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="balance" className="block text-sm font-medium text-gray-700">Balance</label>
                            <input type="text" id="balance" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.balance} disabled />
                        </div>
                    </div>
                )}

                {/* Card Payment Details */}
                {!isCashPayment && (
                    <div id="cardDetails" className="mb-4">
                        <div className="mb-4">
                            <label htmlFor="bankNo" className="block text-sm font-medium text-gray-700">Card Last Four Digits</label>
                            <input type="text" id="bankNo" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.bankNo} onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                            <input type="text" id="bankName" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={orderData.bankName} onChange={handleChange} />
                        </div>
                    </div>
                )}

                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Submit Order</button>
            </form>
        </div>
    );
};

export default OrderManagement;

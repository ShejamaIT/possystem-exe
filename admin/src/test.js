// Get one order in-detail
router.get("/order-details", async (req, res) => {
    try {
        const { orID } = req.query;
        if (!orID) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        // Fetch Order Info along with Sales Team details (Employee Name)
        const orderQuery = `
            SELECT
                o.OrID, o.orDate, o.customerEmail, o.contact1, o.contact2, o.orStatus, o.delStatus,
                o.delPrice, o.discount, o.total, o.advance , o.balance, o.payStatus, o.expectedDate,
                o.specialNote, o.ordertype, s.stID, e.name AS salesEmployeeName
            FROM Orders o
                     LEFT JOIN sales_team s ON o.stID = s.stID
                     LEFT JOIN Employee e ON s.E_Id = e.E_Id
            WHERE o.OrID = ?`;

        const [orderResult] = await db.query(orderQuery, [orID]);

        if (orderResult.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const orderData = orderResult[0];

        // Fetch Ordered Items with Updated Stock Fields
        const itemsQuery = `
            SELECT
                od.I_Id,
                i.I_name,
                i.color,
                od.qty,
                od.tprice,
                i.price AS unitPrice,
                i.bookedQty,
                i.availableQty,
                i.stockQty
            FROM Order_Detail od
                     JOIN Item i ON od.I_Id = i.I_Id
            WHERE od.orID = ?`;
        const [itemsResult] = await db.query(itemsQuery, [orID]);

        // Prepare the order response
        const orderResponse = {
            orderId: orderData.OrID,
            orderDate: new Date(orderData.orDate).toLocaleDateString('en-CA'), // Fix date issue
            customerEmail: orderData.customerEmail,
            ordertype: orderData.ordertype,
            phoneNumber: orderData.contact1,
            optionalNumber: orderData.contact2,
            orderStatus: orderData.orStatus,
            deliveryStatus: orderData.delStatus,
            deliveryCharge: orderData.delPrice,
            discount: orderData.discount,
            totalPrice: orderData.total,
            advance: orderData.advance,
            balance: orderData.balance,
            payStatus : orderData.payStatus,
            expectedDeliveryDate: new Date(orderData.expectedDate).toLocaleDateString('en-CA'), // Fix date issue
            specialNote: orderData.specialNote,
            salesTeam: orderData.salesEmployeeName ? { employeeName: orderData.salesEmployeeName } : null,
            items: [],
        };

        // If order is "Accepted", fetch booked items and accept_orders
        if (orderData.orStatus === "Accepted") {
            for (const item of itemsResult) {
                let itemReceived = "No";
                let itemStatus = "Incomplete";

                // Fetch accept order data
                const acceptQuery = `SELECT itemReceived, status FROM accept_orders WHERE orID = ? AND I_Id = ?`;
                const [acceptResult] = await db.query(acceptQuery, [orID, item.I_Id]);
                if (acceptResult.length > 0) {
                    itemReceived = acceptResult[0].itemReceived;
                    itemStatus = acceptResult[0].status;
                }

                orderResponse.items.push({
                    itemId: item.I_Id,
                    itemName: item.I_name,
                    price: item.tprice,
                    color: item.color,
                    quantity: item.qty,
                    unitPrice: item.unitPrice,
                    booked: item.bookedQty > 0, // true if the item is booked
                    bookedQuantity: item.bookedQty,
                    availableQuantity: item.availableQty, // Updated field from Item table
                    stockQuantity: item.stockQty,
                    itemReceived: itemReceived,
                    itemStatus: itemStatus
                });
            }
        } else {
            // If order is not "Accepted", return normal item details
            orderResponse.items = itemsResult.map(item => ({
                itemId: item.I_Id,
                itemName: item.I_name,
                quantity: item.qty,
                price: item.tprice,
                color: item.color,
                unitPrice: item.unitPrice,
                bookedQuantity: item.bookedQty,
                availableQuantity: item.availableQty, // Updated field
                stockQuantity: item.stockQty
            }));
        }

        // If it's a delivery order, fetch delivery details
        if (orderData.delStatus === "Delivery") {
            const deliveryQuery = `
                SELECT dv_id, address, district, contact, status, schedule_Date
                FROM delivery
                WHERE orID = ?`;

            const [deliveryResult] = await db.query(deliveryQuery, [orID]);

            if (deliveryResult.length > 0) {
                const deliveryData = deliveryResult[0];
                orderResponse.deliveryInfo = {
                    deliveryId: deliveryData.dv_id,
                    address: deliveryData.address,
                    district: deliveryData.district,
                    status: deliveryData.status,
                    scheduleDate: deliveryData.schedule_Date,
                };
            }
        }

        return res.status(200).json({
            success: true,
            message: "Order details fetched successfully",
            order: orderResponse
        });

    } catch (error) {
        console.error("Error fetching order details:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching order details",
            details: error.message,
        });
    }
});


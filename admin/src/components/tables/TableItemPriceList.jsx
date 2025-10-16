import React, { useState, useEffect } from "react";
import "../../style/TableItemPriceList.css"; // <-- Updated filename
import { useNavigate } from "react-router-dom";

const TableItemPriceList = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitems");
            const data = await response.json();

            if (data.length > 0) {
                setItems(data);
                setFilteredItems(data);
            } else {
                setItems([]);
                setFilteredItems([]);
                setError("No items available.");
            }
        } catch (error) {
            setItems([]);
            setFilteredItems([]);
            setError("Error fetching items.");
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredData = items.filter((item) =>
            item.I_Id.toString().toLowerCase().includes(query) ||
            item.I_name.toLowerCase().includes(query) ||
            item.price.toString().toLowerCase().includes(query)
        );

        setFilteredItems(filteredData);
    };

    return (
        <div className="table-price-list-container">
            <h4 className="table-title">All Items Prices</h4>

            <input
                type="text"
                placeholder="Search by Item ID or Name or Price..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>Item Id</th>
                        <th>Item Name</th>
                        <th>Price</th>
                        <th>Stock QTY</th>
                        <th>Available QTY</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="loading-message">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="5" className="error-message">{error}</td>
                        </tr>
                    ) : filteredItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="no-data-message">No items found</td>
                        </tr>
                    ) : (
                        filteredItems.map((item) => (
                            <tr key={item.I_Id}>
                                <td>{item.I_Id}</td>
                                <td>{item.I_name}</td>
                                <td>Rs.{item.price}</td>
                                <td>{item.stockQty}</td>
                                <td>{item.availableQty}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableItemPriceList;

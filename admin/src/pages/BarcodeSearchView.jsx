import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'reactstrap';

const BarcodeSearchView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState('');
    const inputRef = useRef();

    const normalize = (str) => (str || '').toLowerCase().trim();

    const getBase64Image = (imgObj) => {
        if (!imgObj || !imgObj.data) return null;
        const base64String = btoa(
            new Uint8Array(imgObj.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        );
        return `data:image/jpeg;base64,${base64String}`;
    };

    const handleSearch = async () => {
        const [itemIdPart, stockIdPart, pcIdPart] = searchTerm.split('-').map(part => part?.trim());

        if (!itemIdPart || !stockIdPart || !pcIdPart) {
            setError("Invalid barcode format. Use I_Id-STOCK_Id-PC_Id.");
            setSelectedItem(null);
            return;
        }

        try {
            setError('');
            const response = await fetch("http://localhost:5001/api/admin/main/item/check-stock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemIdPart,
                    stockIdPart,
                    pcIdPart
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                setSelectedItem(null);
                setError(errData.message || "Item not found.");
                return;
            }

            const data = await response.json();
            setSelectedItem(data);
            setError('');
        } catch (error) {
            console.error("Error fetching item:", error);
            setSelectedItem(null);
            setError("Error fetching item data.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
                Scan or Enter Barcode (I_Id-STOCK_Id-PC_Id)
            </h2>

            <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search e.g. DPC3D-1-PC_004"
                innerRef={inputRef}
                className="mb-4"
            />

            {error && <p className="text-red-600 mt-2">{error}</p>}

            {selectedItem && (
                <div className="mt-6 border p-4 rounded shadow bg-white">
                    <div className="flex flex-col md:flex-row items-start">
                        {selectedItem.item?.img?.data ? (
                            <div className="w-24 h-24 flex items-center justify-center overflow-hidden mr-4 mb-4 md:mb-0">
                                <img
                                    src={getBase64Image(selectedItem.item.img)}
                                    alt="Item"
                                    className="w-full h-full object-contain rounded border"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center mb-4 md:mb-0 mr-4 rounded border">
                                <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                        )}
                        <div className="flex-grow">
                            <h2 className="text-lg font-bold">{selectedItem.item.I_name}</h2>
                            <p><strong>Description:</strong> {selectedItem.item.descrip}</p>
                            <p><strong>Color:</strong> {selectedItem.item.color}</p>
                            <p><strong>Material:</strong> {selectedItem.item.material}</p>
                            <p><strong>Price:</strong> Rs.{selectedItem.item.price}</p>
                            <p><strong>Warranty:</strong> {selectedItem.item.warrantyPeriod}</p>
                            <p><strong>Stock:</strong> {selectedItem.item.stockQty} (Available: {selectedItem.item.availableQty})</p>
                            <p><strong>Status:</strong> {selectedItem.batch.status}</p>
                            <p><strong>Batch Date/Time:</strong> {new Date(selectedItem.batch.datetime).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Purchase Info */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Purchase Info</h3>
                        {selectedItem.mainSupplier ? (
                            <div className="text-sm text-gray-700">
                                <p><strong>Supplier Name:</strong> {selectedItem.mainSupplier.name}</p>
                                <p><strong>Contact:</strong> {selectedItem.mainSupplier.contact} / {selectedItem.mainSupplier.contact2}</p>
                                <p><strong>Address:</strong> {selectedItem.mainSupplier.address}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Purchase info not found.</p>
                        )}
                    </div>

                    {/* Purchase Details */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Purchase Details</h3>
                        {selectedItem.purchaseDetails && selectedItem.purchaseDetails.length > 0 ? (
                            <ul className="list-disc pl-6 text-sm text-gray-800">
                                {selectedItem.purchaseDetails.map((pd, idx) => (
                                    <li key={idx} className="mt-2">
                                        <p><strong>Unit Price:</strong> Rs.{pd.unitPrice}</p>
                                        <p><strong>Received Count:</strong> {pd.rec_count}</p>
                                        <p><strong>Total:</strong> Rs.{pd.total}</p>
                                        <p><strong>Stock Range:</strong> {pd.stock_range}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No purchase detail found.</p>
                        )}
                    </div>

                    {/* Other Suppliers */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Other Suppliers</h3>
                        {selectedItem.otherSuppliers?.length > 0 ? (
                            <ul className="list-disc pl-6">
                                {selectedItem.otherSuppliers.map((s) => (
                                    <li key={s.s_ID}>
                                        {s.name} — Unit Cost: Rs.{s.unit_cost}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No other suppliers found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarcodeSearchView;

import React from 'react';
import '../style/ProductList.css';
import { Table } from 'reactstrap';

const ProductList = () => {
    return (
        <div className="product-list-content" id="product-list">
            <section className="intro">
                <div className="bg-image h-100" style={{ backgroundColor: '#f5f7fa' }}>
                    <div className="mask d-flex align-items-center h-100">
                        <div className="container-fluid mt-5">

                            <div className="row">
                                {/* Gender Card */}
                                <DataCard
                                    title="Pending Orders"
                                    tableId="gender-table-body"
                                    columns={["Gender Code", "Gender Description", "Update", "Delete"]}
                                    buttonText="Add New Gender"
                                    modalId="genderModal"
                                />

                                {/* Occasion Card */}
                                <DataCard
                                    title="Accept Orders"
                                    tableId="occasion-table-body"
                                    columns={["Occasion Code", "Occasion Description", "Update", "Delete"]}
                                    buttonText="Add New Occasion"
                                    modalId="occasionModal"
                                />
                            </div>

                            <div className="row">
                                {/* Variety Card */}
                                <DataCard
                                    title="Variety Details"
                                    tableId="variety-table-body"
                                    columns={["Variety Code", "Variety Description", "Update", "Delete"]}
                                    buttonText="Add New Variety"
                                    modalId="varietyModal"
                                />

                                {/* Size Card */}
                                <DataCard
                                    title="Size Details"
                                    tableId="size-table-body"
                                    columns={["Size Code", "Size Description", "Update", "Delete"]}
                                    buttonText="Add New Size"
                                    modalId="sizeModal"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const DataCard = ({ title, tableId, columns, buttonText, modalId }) => (
    <div className="col-md-6 mb-4">
        <div className="card">
            <div className="card-body p-0">
                <h5 className="card-title text-center mt-3">{title}</h5>
                <div className="table-responsive table-scroll" style={{ height: '300px' }}>
                    <Table striped responsive className="mb-0">
                        <thead style={{ backgroundColor: '#002d72', textAlign: 'center' }}>
                        <tr>
                            {columns.map((col, idx) => <th key={idx} scope="col">{col}</th>)}
                        </tr>
                        </thead>
                        <tbody id={tableId}>
                        {/* Dynamic rows will go here */}
                        </tbody>
                    </Table>
                </div>
            </div>
            {/*<button className="btn btn-success add-btn mt-3 mx-auto d-block" style={{ width: '200px' }}*/}
            {/*        data-toggle="modal" data-target={`#${modalId}`}>*/}
            {/*    {buttonText}*/}
            {/*</button>*/}
        </div>
    </div>
);

export default ProductList;

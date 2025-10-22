import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import userImg from '../assets/images/user-icon.png';
import '../style/order.css';
import Helmet from "../components/Helmet/Helmet";
import user from "./User";

const Orders = () =>{

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:4000/order", { withCredentials: true });
            setOrders(response.data.data);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllOrders();
    }, []);


    return (
      <Helmet>
          <section>
              <Container>
                  <Row>
                      <Col lg="12">
                          <h4 className="fw-bold">Orders</h4>
                      </Col>
                      <Col lg="12" className="pt-5">
                          {loading ? (
                              <h5 className="pt-5 fw-bold">Loading...</h5>
                          ) : (
                              <table className="table table-bordered">
                                  <thead>
                                  <tr>
                                      <th>Order Id</th>
                                      <th>Customer Name</th>
                                      <th>Customer Address</th>
                                      <th>Customer Contact</th>
                                      <th>Item/Items</th>
                                      <th>Total Amount</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {orders.length > 0 ? (
                                      orders.map(order => (
                                          <tr key={order._id}>
                                              <td>{order._id}</td>
                                              <td>{order.customerName}</td>
                                              <td>{order.customerAddress+" ,"+order.city}</td>
                                              <td>{order.phoneNumber}</td>
                                              <td>{order.cartItems.length}</td>
                                              <td>{order.totalAmount}</td>
                                          </tr>
                                      ))
                                  ) : (
                                      <tr>
                                          <td colSpan="4" className="text-center">No users found</td>
                                      </tr>
                                  )}
                                  </tbody>
                              </table>
                          )}
                      </Col>
                  </Row>
              </Container>
          </section>
      </Helmet>
    );
};

export default Orders;

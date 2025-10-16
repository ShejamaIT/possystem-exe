import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import userImg from '../assets/images/user-icon.png';
import '../style/users.css';
import Helmet from "../components/Helmet/Helmet";

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:4000/users", { withCredentials: true });
            setUsers(response.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const deleteUser = async (userId) => {
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            await axios.delete(`http://localhost:4000/users/${userId}`, {
                withCredentials: true,
                headers: headers,
            });
            setUsers(users.filter(user => user._id !== userId));
            toast.success('User deleted successfully.');
        } catch (err) {
            console.log(err);
            toast.error('Failed to delete user.');
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <Helmet title='User'>
            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <h4 className="fw-bold">Users</h4>
                        </Col>
                        <Col lg="12" className="pt-5">
                            {loading ? (
                                <h5 className="pt-5 fw-bold">Loading...</h5>
                            ) : (
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <tr key={user._id}>
                                                <td><img src={userImg} alt="User" /></td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td><button className="btn btn-danger" onClick={() => deleteUser(user._id)}>Delete</button></td>
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

export default User;

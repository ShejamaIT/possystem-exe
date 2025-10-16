import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Table,
} from "reactstrap";
import { toast } from "react-toastify";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [sessionLogs, setSessionLogs] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        contact: "",
        password: "",
        role: "",
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/users");
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUsers(data.data);
        } catch (err) {
            toast.error("Failed to load users");
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/users/${userId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUserDetails(data.user);
            setSessionLogs(data.sessions);
            setFormData({
                contact: data.user.contact || "",
                password: "",
                role: data.user.type || "",
            });
            setEditMode(false);
        } catch (err) {
            toast.error("Failed to fetch user details");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!selectedUserId) return;
        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/users/${selectedUserId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("User updated successfully");
            fetchUserDetails(selectedUserId);
            fetchUsers();
        } catch (err) {
            toast.error(err.message || "Failed to update user");
        }
    };

    const handleDelete = async () => {
        if (!selectedUserId) return;
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`http://localhost:5001/api/admin/main/users/${selectedUserId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success("User deleted");
            setUserDetails(null);
            setSelectedUserId("");
            fetchUsers();
        } catch (err) {
            toast.error("Error deleting user");
        }
    };

    return (
        <Container className="mt-5">
            <h4 className="text-center mb-4">User Management</h4>

            <FormGroup>
                <Label for="userSelect">Select User</Label>
                <Input
                    type="select"
                    id="userSelect"
                    value={selectedUserId}
                    onChange={(e) => {
                        const id = e.target.value;
                        setSelectedUserId(id);
                        fetchUserDetails(id);
                    }}
                >
                    <option value="">-- Select --</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.contact} - {user.type}
                        </option>
                    ))}
                </Input>
            </FormGroup>

            {userDetails && (
                <div className="mt-4">
                    <h5>User Details</h5>
                    <Form>
                        <FormGroup>
                            <Label>Contact</Label>
                            <Input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Leave blank to keep current"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Role</Label>
                            <Input
                                type="select"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            >
                                <option value="">Select role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">Sales</option>
                                <option value="DRIVER">Driver</option>
                                <option value="CHASHIER">Cashier</option>
                                <option value="OTHER">Other</option>
                            </Input>
                        </FormGroup>

                        <p><strong>Employee ID:</strong> {userDetails.E_Id}</p>

                        {!editMode ? (
                            <Row>
                                <Col md="6">
                                    <Button color="primary" block onClick={() => setEditMode(true)}>Edit</Button>
                                </Col>
                                <Col md="6">
                                    <Button color="danger" block onClick={handleDelete}>Delete</Button>
                                </Col>
                            </Row>
                        ) : (
                            <Row>
                                <Col md="6">
                                    <Button color="primary" block onClick={handleUpdate}>Save</Button>
                                </Col>
                                <Col md="6">
                                    <Button color="secondary" block onClick={() => setEditMode(false)}>Cancel</Button>
                                </Col>
                            </Row>
                        )}
                    </Form>
                </div>
            )}

            {sessionLogs.length > 0 && (
                <div className="mt-5">
                    <h5>Session Logs</h5>
                    <Table bordered responsive>
                        <thead>
                            <tr>
                                <th>Login Time</th>
                                <th>Logout Time</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {sessionLogs.map((log) => (
                                <tr key={log.SessionID}>
                                    <td>{new Date(log.LoginTime).toLocaleString()}</td>
                                    <td>{log.LogoutTime ? new Date(log.LogoutTime).toLocaleString() : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default UserManagement;

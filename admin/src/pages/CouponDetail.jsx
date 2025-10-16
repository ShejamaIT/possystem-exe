import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
} from "reactstrap";
import { toast } from "react-toastify";

const CouponDetail = () => {
  const [coupons, setCoupons] = useState([]);
  const [salesTeamMembers, setSalesTeamMembers] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    cpID: "",
    stID: "",
    discount: "",
  });
  const [editingCoupon, setEditingCoupon] = useState(null);

  // ✅ Load coupons and sales team members
  useEffect(() => {
    fetchCoupons();
    fetchSalesTeamMembers();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/admin/main/coupon-details"
      );
      const data = await response.json();
      setCoupons(data.data || []);
    } catch (error) {
      toast.error("Error fetching coupons.");
    }
  };

  const fetchSalesTeamMembers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/admin/main/salesteam"
      );
      const data = await response.json();
      if (data.data) {
        setSalesTeamMembers(data.data);
      }
    } catch (error) {
      console.error("Error fetching sales team members:", error);
    }
  };

  // ✅ Add new coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/main/coupone`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            couponCode: newCoupon.cpID,
            saleteamCode: newCoupon.stID,
            discount: newCoupon.discount,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add coupon");

      await fetchCoupons();
      setNewCoupon({ cpID: "", stID: "", discount: "" });
      toast.success("Coupon added successfully");
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error("Error adding coupon:", err);
      toast.error("Failed to add coupon");
    }
  };

  // ✅ Update coupon (including coupon ID)
  const handleUpdateCoupon = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/main/sales-coupons/${editingCoupon.old_coupon_code}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            couponCode: editingCoupon.coupon_code,
            saleteamCode: editingCoupon.sales_team_id,
            discount: editingCoupon.discount,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update coupon");

      await fetchCoupons();
      setEditingCoupon(null);
      toast.success("Coupon updated successfully");
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error("Error updating coupon:", err);
      toast.error("Failed to update coupon");
    }
  };

  // ✅ Delete coupon
  const handleDeleteCoupon = async (couponCode) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/main/sales-coupons/${couponCode}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete coupon");

      await fetchCoupons();
      toast.success("Coupon deleted successfully");
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div>
      <h4 className="sub-title">Manage Coupons (All Sales Team)</h4>

      {/* Add New Coupon */}
      <Form onSubmit={handleAddCoupon} className="mb-4">
        <Row>
          <Col md={4}>
            <FormGroup>
              <Label for="cpID">Coupon ID</Label>
              <Input
                id="cpID"
                value={newCoupon.cpID}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, cpID: e.target.value })
                }
                required
              />
            </FormGroup>
          </Col>

          <Col md={5}>
            <FormGroup>
              <Label for="stID">Sales Team Member</Label>
              <Input
                type="select"
                id="stID"
                value={newCoupon.stID}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, stID: e.target.value })
                }
                required
              >
                <option value="">Select Sales Team Member</option>
                {salesTeamMembers.map((member) => (
                  <option key={member.stID} value={member.stID}>
                    {member.employeeName} ({member.stID})
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>

          <Col md={3}>
            <FormGroup>
              <Label for="discount">Discount (Rs.)</Label>
              <Input
                type="text"
                id="discount"
                value={newCoupon.discount}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, discount: e.target.value })
                }
                required
              />
            </FormGroup>
          </Col>
        </Row>

        {/* Button in next row */}
        <Row>
          <Col md={12}>
            <Button color="primary" type="submit" block>
              Add Coupon
            </Button>
          </Col>
        </Row>
      </Form>


      {/* Coupon Table */}
      <Table bordered>
        <thead>
          <tr>
            <th>Coupon ID</th>
            <th>Sales Team Member</th>
            <th>Discount (Rs.)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((c) => (
              <tr key={c.coupon_code}>
                {/* Editable Coupon ID */}
                <td>
                  {editingCoupon?.old_coupon_code === c.coupon_code ? (
                    <Input
                      type="text"
                      value={editingCoupon.coupon_code}
                      onChange={(e) =>
                        setEditingCoupon({
                          ...editingCoupon,
                          coupon_code: e.target.value,
                        })
                      }
                    />
                  ) : (
                    c.coupon_code
                  )}
                </td>

                {/* Editable Sales Team Member */}
                <td>
                  {editingCoupon?.old_coupon_code === c.coupon_code ? (
                    <Input
                      type="select"
                      value={editingCoupon.sales_team_id}
                      onChange={(e) =>
                        setEditingCoupon({
                          ...editingCoupon,
                          sales_team_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Sales Team Member</option>
                      {salesTeamMembers.map((member) => (
                        <option key={member.stID} value={member.stID}>
                          {member.employeeName} ({member.stID})
                        </option>
                      ))}
                    </Input>
                  ) : (
                    `${c.employee_name} (${c.sales_team_id})`
                  )}
                </td>

                {/* Editable Discount */}
                <td>
                  {editingCoupon?.old_coupon_code === c.coupon_code ? (
                    <Input
                      type="text"
                      value={editingCoupon.discount}
                      onChange={(e) =>
                        setEditingCoupon({
                          ...editingCoupon,
                          discount: e.target.value,
                        })
                      }
                    />
                  ) : (
                    `Rs. ${c.discount}`
                  )}
                </td>

                <td>
                  {editingCoupon?.old_coupon_code === c.coupon_code ? (
                    <>
                      <Button
                        size="sm"
                        color="success"
                        onClick={handleUpdateCoupon}
                      >
                        Save
                      </Button>{" "}
                      <Button
                        size="sm"
                        color="secondary"
                        onClick={() => setEditingCoupon(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        color="warning"
                        onClick={() =>
                          setEditingCoupon({
                            ...c,
                            old_coupon_code: c.coupon_code, // keep original id for update
                          })
                        }
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => handleDeleteCoupon(c.coupon_code)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No coupons available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CouponDetail;

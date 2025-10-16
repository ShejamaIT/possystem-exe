import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Input,
  Label,
} from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { useNavigate, useLocation } from "react-router-dom";
import classnames from "classnames";
import { toast } from "react-toastify";
import AddSupplier from "./AddSupplier";
import SupplierDetails from "./SupplierDetails";
import UpdateSupplier from "./UpdateSupplier";

const AllSuppliers = () => {
  const [activeTab, setActiveTab] = useState("Add Supplier");
  const [nestedActiveTab, setNestedActiveTab] = useState("1");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const tabNames = ["Add Supplier", "Supplier Details", "Update Supplier"];

  // 🔹 Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/admin/main/suppliers");
      const data = await response.json();
      if (data.suppliers && data.suppliers.length > 0) {
        setSuppliers(data.suppliers);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast.error("Error fetching suppliers.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // 🔹 Handle tab changes + update URL
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`?tab=${tabName}`);
  };

  // 🔹 Handle supplier selection + update URL with supplierId
  const handleSupplierSelect = (e) => {
    const id = e.target.value;
    setSelectedSupplierId(id);
    navigate(`?tab=Supplier Details&supplierId=${id}`);
  };

  // 🔹 Read URL on page load to restore state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    const supplierId = searchParams.get("supplierId");

    if (tab && tabNames.includes(tab)) {
      setActiveTab(tab);
    }

    if (supplierId) {
      setSelectedSupplierId(supplierId);
      setActiveTab("Supplier Details"); // auto-open detail view
    }
  }, [location.search]);

  const selectedSupplier = suppliers.find((s) => s.s_ID === selectedSupplierId);

  return (
    <Helmet title={"All-Suppliers"}>
      <section>
        <Container className="dashboard">
          {/* 🔹 Main Tabs */}
          <Nav tabs>
            {tabNames.map((label, index) => (
              <NavItem key={index}>
                <NavLink
                  className={activeTab === label ? "active" : ""}
                  onClick={() => handleTabChange(label)}
                  style={{ cursor: "pointer" }}
                >
                  {label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          {/* 🔹 Main Tab Content */}
          <TabContent activeTab={activeTab}>
            {/* 🟢 Add Supplier */}
            <TabPane tabId="Add Supplier">
              <Row>
                <Col>
                  <AddSupplier
                    onAddSupplier={(newSupplier) => {
                      setSuppliers((prev) => [...prev, newSupplier]);
                      setActiveTab("Supplier Details");
                      setSelectedSupplierId(newSupplier.s_ID);
                      navigate(`?tab=Supplier Details&supplierId=${newSupplier.s_ID}`);
                    }}
                  />
                </Col>
              </Row>
            </TabPane>

            {/* 🔵 Supplier Details */}
            <TabPane tabId="Supplier Details">
              <Row className="mb-3">
                <Col md="4">
                  <Label for="supplierSelect">Select Supplier</Label>
                  <Input
                    id="supplierSelect"
                    type="select"
                    value={selectedSupplierId}
                    onChange={handleSupplierSelect}
                  >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.s_ID} value={supplier.s_ID}>
                        {supplier.s_ID} - {supplier.name}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>

              <Row>
                <Col>
                  {selectedSupplier ? (
                    <SupplierDetails supplier={selectedSupplier} />
                  ) : (
                    <p>Please select a supplier to view details.</p>
                  )}
                </Col>
              </Row>
            </TabPane>

            {/* 🟣 Update Supplier with Sub-tabs */}
            <TabPane tabId="Update Supplier">
              <Nav tabs className="mb-3">
                <NavItem>
                  <NavLink
                    className={classnames({ active: nestedActiveTab === "1" })}
                    onClick={() => setNestedActiveTab("1")}
                    style={{ cursor: "pointer" }}
                  >
                    Update Supplier
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={nestedActiveTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col>
                      <UpdateSupplier />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </TabPane>
          </TabContent>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllSuppliers;

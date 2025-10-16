import React, {useEffect, useState} from 'react';
import { Card, CardBody, Table,Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import { Line } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,} from 'chart.js';
import {PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar} from "recharts";
import '../style/HomeContent.css';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Income (Rs.)',
            },
        },
        x: {
            title: {
                display: true,
                text: 'Month',
            },
        },
    },
};
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminHome = () => {
    const [income, setIncome] = useState(0);
    const [incomeIncreased, setIncomeIncreased] = useState("no");
    const [todayInOnlineTotalPrice, setTodayInOnlineTotalPrice] = useState(0);
    const [todayInWalkingTotalPrice, setTodayInWalkingTotalPrice] = useState(0);
    const [monthlyOutOnlinePrice, setMonthlyOutOnlinePrice] = useState(0);
    const [todayInOnlinePriceIncreased, setTodayInOnlinePriceIncreased] = useState("no");
    const [todayInWalingPriceIncreased, setTodayInWalkingPriceIncreased] = useState("no");
    const [monthlyOutOnlinePriceIncreased, setMonthlyOutOnlinePriceIncreased] = useState("no");
    const [thisMonthOutTotalPrice, setThisMonthOutTotalPrice] = useState(0);
    const [thisMonthInOnlineTotalPrice, setThisMonthInOnlineTotalPrice] = useState(0);
    const [thisMonthInWalkingTotalPrice, setThisMonthInWalkingTotalPrice] = useState(0);
    const [thisMonthOutPriceIncreased, setThisMonthOutPriceIncreased] = useState("no");
    const [thisMonthInOnlinePriceIncreased, setThisMonthInOnlinePriceIncreased] = useState("no");
    const [thisMonthInWalkingPriceIncreased, setThisMonthInwalkingPriceIncreased] = useState("no");
    const [thisMonthHire, setThisMonthHire] = useState(0);
    const [hireIncreased, setHireIncreased] = useState("no");
    const [todayHire, setTodayHire] = useState(0);
    const [todayhireIncreased, settodayHireIncreased] = useState("no");
    const [walkingTotalThisMonth, setWalkingTotalThisMonth] = useState(0);
    const [onsiteTotalThisMonth, setOnsiteTotalThisMonth] = useState(0);
    const [walkingComparison, setWalkingComparison] = useState('no');
    const [onsiteComparison, setOnsiteComparison] = useState('no');
    const [items, setItems] = useState([]);
    const [mdf, setMDF] = useState([]);
    const [mm, setMM] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlywalkingData, setMonthlywalkingData] = useState([]);
    const [monthlyonlineData, setMonthlyonlineData] = useState([]);
    const [furnitures, setFurnitures] = useState([]);
    const [mattress, setMattress] = useState([]);
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSaleIncome();
        fetchItems();
        fetchmonthlyCategorySales();
        fetchOrderSummary();
        fetchMonthlyHire();
        fetchMonthlyNetTotalSummary();
        fetchmonthlyCategory();
        fetchMonthlyIncome();
    }, []);
    const fetchmonthlyCategory = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/monthly-issued-material-prices");
            const result = await response.json();

            if (result.success) {
                const chartData = [
                    { name: "MDF", value: result.MDF[0]?.totalPrice || 0 },
                    { name: "MM", value: result.MM[0]?.totalPrice || 0 },
                    { name: "Furniture", value: result.Furniture[0]?.totalPrice || 0 },
                    { name: "Mattress", value: result.Mattress[0]?.totalPrice || 0 },
                ];
                setData(chartData);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    const fetchSaleIncome = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/today-order-income");
            const data = await response.json();

            if (data.success) {
                setIncome(data.data.totalIncome);
                setIncomeIncreased(data.data.incomeIncreased); // Storing the comparison result
            }
        } catch (error) {
            console.error("Error fetching income:", error);
        }
    };
    const fetchOrderSummary = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/order-summary");
            const data = await response.json();

            if (data.success) {
                setTodayInOnlineTotalPrice(data.today.in.online);
                setTodayInWalkingTotalPrice(data.today.in.walking);
                setTodayInOnlinePriceIncreased(data.today.compare.inOnlineIncreased);
                setTodayInWalkingPriceIncreased(data.today.compare.inWalkingIncreased);
                setMonthlyOutOnlinePrice(data.thisMonth.out.online);
                setThisMonthOutTotalPrice(data.thisMonth.out.total);
                setThisMonthInWalkingTotalPrice(data.thisMonth.in.walking);
                setThisMonthInOnlineTotalPrice(data.thisMonth.in.online);
                setThisMonthInOnlinePriceIncreased(data.thisMonth.compare.inOnlineIncreased);
                setThisMonthInwalkingPriceIncreased(data.thisMonth.compare.inWalkingIncreased);
                setMonthlyOutOnlinePriceIncreased(data.thisMonth.compare.outOnlineIncreased);
                setThisMonthOutPriceIncreased(data.thisMonth.compare.outTotalIncreased);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    const fetchMonthlyHire = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/admin/main/monthly-hire-summary");
            const data = await res.json();

            if (data.success) {
                setTodayHire(data.todayHire);
                settodayHireIncreased(data.todayIncreased);
                setThisMonthHire(data.thisMonthHire);
                setHireIncreased(data.hireIncreased);
            }
        } catch (error) {
            console.error("Error fetching monthly hire summary:", error);
        }
    };
    const fetchmonthlyCategorySales = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/monthly-issued-material-prices");
            const data = await response.json();
            if (data.success) {
                setMDF(data.MDF);
                setMM(data.MM);
                setFurnitures(data.Furniture);
                setMattress(data.Mattress);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    const fetchMonthlyNetTotalSummary = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/admin/main/monthly-net-total-summary');
            const data = await response.json();

            if (data.success) {
                setWalkingTotalThisMonth(data.total.thisMonthTotal);
                setWalkingComparison(data.total.compare.increased);

                setOnsiteTotalThisMonth(data.onsite.thisMonthTotal);
                setOnsiteComparison(data.onsite.compare.increased);
            }
        } catch (error) {
            console.error("Error fetching monthly net total summary:", error);
        }
    };
     const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/allitemslessone-catgory");
            const data = await response.json();

            if (data.success) {
                setItems(data.data);
                const firstKey = Object.keys(data.data)[0];
                if (firstKey) setActiveTab(firstKey);
            } else {
                setItems({});
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const fetchMonthlyIncome = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/monthly-order-income");
            const data = await response.json();
            if (data.success) {
                setMonthlyData(data.totalIncome);
                setMonthlywalkingData(data.walkingIncome);
                setMonthlyonlineData(data.onsiteIncome);
            }
        } catch (error) {
            console.error("Error fetching income data:", error);
        }
    };

    const chartData = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
                label: 'Monthly Income (Rs.)',
                data: monthlyData,
                fill: false,
                borderColor: '#123593',
                tension: 0.4,
            },
        ],
    };

    const chartData1 = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        datasets: [
            {
            label: 'Walking Income (Rs.)',
            data: monthlywalkingData,
            fill: false,
            borderColor: '#123593', // blue line
            tension: 0.4,
            },
            {
            label: 'Online Income (Rs.)',
            data: monthlyonlineData,
            fill: false,
            borderColor: '#e63946', // red line
            tension: 0.4,
            },
        ],
    };

    return (
        <div className="home-content" id="home">
            <div className="welcome-card" style={{marginTop: '-20px'}}>
                <Card className="m-3" style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(115deg, #97abff, #123593)',
                    color: '#f5f7fa',
                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardBody>
                        <h5 className="card-title">Welcome to dashboard !</h5>
                        <p className="card-text">Hello Admin, welcome to your Shejama Group Poss dashboard !</p>
                    </CardBody>
                </Card>
            </div>

            <div className="overview-boxes">
                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Daily Online InOrders</div>
                        <div className="number">Rs.{todayInOnlineTotalPrice.toFixed(2)}</div>
                        {/* Display total price */}

                        {todayInOnlinePriceIncreased === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from yesterday</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from yesterday</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bx-cart cart four'></i>
                </div>

                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Monthly Online InOrders</div>
                        <div className="number">Rs.{thisMonthInOnlineTotalPrice.toFixed(2)}</div>
                        {/* Display total price */}

                        {thisMonthInOnlinePriceIncreased === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from last month</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from last month</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bx-cart cart two'></i>
                    {/* <i className='bx bxl-shopify cart two'></i> */}
                </div>

                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Monthly Online Outorders</div>
                        <div className="number">Rs.{monthlyOutOnlinePrice.toFixed(2)}</div>
                        {/* Display total price */}

                        {monthlyOutOnlinePriceIncreased === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from yesterday</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from yesterday</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bx-cart cart three'></i>
                </div>
                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Total shop sale</div>
                        <div className="number">Rs.{walkingTotalThisMonth.toFixed(2)}</div>

                        {walkingComparison === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from last month</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from last month</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bxs-store cart one'></i>
                </div>

            </div>
            <div className="overview-boxes">
                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Daily Walking Inorders</div>
                        <div className="number">Rs.{todayInWalkingTotalPrice.toFixed(2)}</div>

                        {todayInWalingPriceIncreased === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from yesterday</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from yesterday</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bx-cart cart One'></i>
                    {/* <i className='bx bxs-truck store3'></i> */}
                </div>
                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Monthly Walking Inorders</div>
                        <div className="number">Rs.{thisMonthInWalkingTotalPrice.toFixed(2)}</div>

                        {thisMonthInWalkingPriceIncreased === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from last month</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from last month</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bx-cart cart three'></i>
                    {/* <i className='bx bxs-truck delivery'></i> */}
                </div>
                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Monthly Hire</div>
                        <div className="number">Rs.{thisMonthHire.toFixed(2)}</div>

                        {hireIncreased === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from last month</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from last month</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bxs-truck delivery'></i>
                </div>
            
                <div className="box">
                    <div className="right-side">
                        <div className="box-topic">Monthly OutOrders</div>
                        <div className="number">Rs.{thisMonthOutTotalPrice.toFixed(2)}</div>

                        {thisMonthOutPriceIncreased === "yes" ? (
                            <div className="indicator">
                                <i className='bx bx-up-arrow-alt'></i>
                                <span className="text">Up from last month</span>
                            </div>
                        ) : (
                            <div className="indicator">
                                <i className='bx bx-down-arrow-alt down'></i>
                                <span className="text">Down from last month</span>
                            </div>
                        )}
                    </div>
                    <i className='bx bxs-store cart two'></i>
                </div>
            </div>

            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                    <h5 className="card-title text-center">Monthly Income of last 12 months</h5>
                    <div style={{ height: "300px" }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                    </CardBody>
                </Card>

                <Card className="cards chart-card">
                    <CardBody>
                    <h5 className="card-title text-center">Walking vs Online Income (last 12 months)</h5>
                    <div style={{ height: "300px" }}>
                        <Line data={chartData1} options={chartOptions} />
                    </div>
                    </CardBody>
                </Card>
            </div>

            <div className="overview row-cards">
                <Card id="outStockTable" className="cards table-card">
                    <CardBody>
                        <h5 className="card-title text-center mb-3">Low Stock Products by Category</h5>

                        {/* Tabs for each material category */}
                        <Nav tabs className="justify-content-center mb-3">
                            {Object.keys(items).length > 0 ? (
                                Object.keys(items).map((key) => (
                                    <NavItem key={key}>
                                        <NavLink
                                            className={classnames({ active: activeTab === key })}
                                            onClick={() => setActiveTab(key)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {key}
                                        </NavLink>
                                    </NavItem>
                                ))
                            ) : (
                                <p className="text-center">No low stock categories available.</p>
                            )}
                        </Nav>

                        {/* Tab Content */}
                        <TabContent activeTab={activeTab}>
                            {Object.keys(items).map((category) => (
                                <TabPane key={category} tabId={category}>
                                    <div className="out-stock-table-wrapper" style={{ maxHeight: "250px", overflowY: "auto" }}>
                                        <Table striped responsive className="mb-0 out-stock-table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">ID</th>
                                                    <th scope="col">Item</th>
                                                    <th scope="col">Available</th>
                                                    <th scope="col">Min Qty</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items[category] && items[category].length > 0 ? (
                                                    items[category].map((item) => (
                                                        <tr key={item.I_Id}>
                                                            <td>{item.I_Id}</td>
                                                            <td>{item.I_name}</td>
                                                            <td>{item.availableQty}</td>
                                                            <td>{item.stockQty}</td>
                                                            <td>
                                                                <button
                                                                    className="view-btn"
                                                                    onClick={() => navigate(`/supplier-detail/${item.I_Id}`)}
                                                                >
                                                                    👁️ Get Suppliers
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center text-muted">
                                                            No low stock items in {category}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </TabPane>
                            ))}
                        </TabContent>
                    </CardBody>
                </Card>
            </div>

            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `Rs.${value}`} />
                                <Tooltip formatter={(value) => `Rs.${value}`} />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    </CardBody>
                </Card>
                <Card id="outStockTable" className="cards table-card">
                    <CardBody>
                        <div className="overview-boxes">
                            <div className="box">
                                <div className="right-side">
                                    <div className="box-topic">Furniture Sale</div>
                                    <div className="number">Rs.{furnitures[0]?.totalPrice.toFixed(2) || 0.00}</div>

                                    {furnitures[0]?.increased === "yes" ? (
                                        <div className="indicator">
                                            <i className='bx bx-up-arrow-alt'></i>
                                            <span className="text">Up from last month</span>
                                        </div>
                                    ) : (
                                        <div className="indicator">
                                            <i className='bx bx-down-arrow-alt down'></i>
                                            <span className="text">Down from last month</span>
                                        </div>
                                    )}
                                </div>
                                <i className='bx bxs-package store'></i>
                            </div>

                            <div className="box">
                                <div className="right-side">
                                    <div className="box-topic">MDF Sale</div>
                                    <div className="number">Rs.{mdf[0]?.totalPrice.toFixed(2) || 0.00}</div>

                                    {mdf[0]?.increased === "yes" ? (
                                        <div className="indicator">
                                            <i className='bx bx-up-arrow-alt'></i>
                                            <span className="text">Up from last month</span>
                                        </div>
                                    ) : (
                                        <div className="indicator">
                                            <i className='bx bx-down-arrow-alt down'></i>
                                            <span className="text">Down from last month</span>
                                        </div>
                                    )}
                                </div>

                                <i className='bx bxs-shopping-bags store3'></i>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card id="outStockTable" className="cards table-card">
                    <CardBody>
                        <div className="overview-boxes">
                            <div className="box">
                                <div className="right-side">
                                    <div className="box-topic">MM Sale</div>
                                    <div className="number">Rs.{mm[0]?.totalPrice.toFixed(2) || 0.00}</div>

                                    {mm[0]?.increased === "yes" ? (
                                        <div className="indicator">
                                            <i className='bx bx-up-arrow-alt'></i>
                                            <span className="text">Up from last month</span>
                                        </div>
                                    ) : (
                                        <div className="indicator">
                                            <i className='bx bx-down-arrow-alt down'></i>
                                            <span className="text">Down from last month</span>
                                        </div>
                                    )}
                                </div>
                                {/*<i className='bx bxs-shopping-bags'></i>*/}
                                <i className='bx bxs-shopping-bags store1'></i>
                            </div>

                            <div className="box">
                                <div className="right-side">
                                    <div className="box-topic">Mattress Sale</div>
                                    <div className="number">Rs.{mattress[0]?.totalPrice.toFixed(2) || 0.00}</div>

                                    {mattress[0]?.increased === "yes" ? (
                                        <div className="indicator">
                                            <i className='bx bx-up-arrow-alt'></i>
                                            <span className="text">Up from last month</span>
                                        </div>
                                    ) : (
                                        <div className="indicator">
                                            <i className='bx bx-down-arrow-alt down'></i>
                                            <span className="text">Down from last month</span>
                                        </div>
                                    )}
                                </div>
                                <i className='bx bxs-package store2'></i>
                                {/*<i className='bx bxs-store '></i>*/}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default AdminHome;

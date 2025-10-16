import React, {useEffect, useState} from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,} from 'chart.js';
import {PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar} from "recharts";
import '../../style/HomeContent.css';
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

const MonthlyIncomeGraphs = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [walkingData, setWalkingData] = useState([]);
    const [onsiteData, setOnsiteData] = useState([]);
    useEffect(() => {
        fetchMonthlyIncome();
    }, []);
    const labels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const fetchMonthlyIncome = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/monthly-order-income");
            const data = await response.json();
            if (data.success) {
                setMonthlyData(data.totalIncome);
                setWalkingData(data.walkingIncome);
                setOnsiteData(data.onsiteIncome);
            }
        } catch (error) {
            console.error("Error fetching income data:", error);
        }
    };
    
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Monthly Income (Rs.)',
                data: monthlyData,
                fill: false,
                borderColor: '#123593',
                backgroundColor: '#123593',
                tension: 0.4,
            },
        ],
    };
    const chartData1 = {
        labels,
        datasets: [
            {
                label: 'Shop (Walking) Income (Rs.)',
                data: walkingData,
                fill: false,
                borderColor: '#4CAF50',
                backgroundColor: '#4CAF50',
                tension: 0.4,
            },
        ],
    };
    const chartData2 = {
        labels,
        datasets: [
            {
                label: 'On-site Income (Rs.)',
                data: onsiteData,
                fill: false,
                borderColor: '#2196F3',
                backgroundColor: '#2196F3',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="home-content" id="home">
            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                        <h5 className="card-title text-center">Monthly Income of last 12 months(Shop & Online)</h5>
                        <div style={{height: '300px'}}>
                            <Line data={chartData} options={chartOptions}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                        <h5 className="card-title text-center">Monthly Income Comparison - Last 12 Months</h5>
                        <div style={{display: 'flex', gap: '2rem', height: '300px'}}>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">Shop (Walking)</h6>
                                <Line data={chartData1} options={chartOptions}/>
                            </div>
                        </div>
                        <div style={{display: 'flex', gap: '2rem', height: '300px'}}>

                            <div style={{flex: 1}}>
                                <h6 className="text-center">On-line</h6>
                                <Line data={chartData2} options={chartOptions}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default MonthlyIncomeGraphs;

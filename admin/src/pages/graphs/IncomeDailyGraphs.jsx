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

const DailyIncomeGraphs = () => {
    const [dailyData, setDailyData] = useState([]);
    const [walkingData1, setWalkingData1] = useState([]);
    const [onsiteData1, setOnsiteData1] = useState([]);
    useEffect(() => {
        fetchDailyIncome();
    }, []);
    const labels1 = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30','31'
    ];
    const fetchDailyIncome = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/daily-order-income");
            const data = await response.json();

            if (data.success) {
                setDailyData(data.totalIncome);
                setWalkingData1(data.walkingIncome);
                setOnsiteData1(data.onsiteIncome);
            }
        } catch (error) {
            console.error("Error fetching income data:", error);
        }
    };
    const chartData3 = {
        labels: labels1,
        datasets: [
            {
                label: 'Total Daily Income (Rs.)',
                data: dailyData,
                fill: false,
                borderColor: '#a10d0d',
                tension: 0.4,
            },
        ],
    };

    const chartData4 = {
        labels: labels1,
        datasets: [
            {
                label: 'Shop (Walking) Income (Rs.)',
                data: walkingData1,
                fill: false,
                borderColor: '#937912',
                backgroundColor: '#937912',
                tension: 0.4,
            },
        ],
    };

    const chartData5 = {
        labels: labels1,
        datasets: [
            {
                label: 'On-site Income (Rs.)',
                data: onsiteData1,
                fill: false,
                borderColor: '#3d0f57',
                backgroundColor: '#3d0f57',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="home-content" id="home">
            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                        <h5 className="card-title text-center">Daily Income of this month(Shop & Online)</h5>
                        <div style={{height: '300px'}}>
                            <Line data={chartData3} options={chartOptions}/>
                        </div>
                    </CardBody>
                </Card>
            </div>
            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                        <h5 className="card-title text-center">Daily Income Comparison - This Month</h5>
                        <div style={{display: 'flex', gap: '2rem', height: '300px'}}>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">Shop (Walking)</h6>
                                <Line data={chartData4} options={chartOptions}/>
                            </div>
                        </div>
                        <div style={{display: 'flex', gap: '2rem', height: '300px'}}>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">On-line</h6>
                                <Line data={chartData5} options={chartOptions}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default DailyIncomeGraphs;

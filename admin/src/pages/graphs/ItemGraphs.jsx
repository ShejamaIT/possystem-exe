import React, { useEffect, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import '../../style/HomeContent.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const chartOptions = (xTitle, yTitle) => ({
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
                text: yTitle,
            },
        },
        x: {
            title: {
                display: true,
                text: xTitle,
            },
        },
    },
});


const ItemGraphs = () => {
    const [MDF, setMDF] = useState([]);
    const [MM, setMM] = useState([]);
    const [Mattress, setMattress] = useState([]);
    const [Furniture, setFurniture] = useState([]);
    const [MDFY, setMDFY] = useState([]);
    const [MMY, setMMY] = useState([]);
    const [MattressY, setMattressY] = useState([]);
    const [FurnitureY, setFurnitureY] = useState([]);

    const labelsMonthly = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labelsDaily = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    useEffect(() => {
        fetchMonthlyData();
        fetchDailyData();
    }, []);

    const fetchMonthlyData = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/daily-issued-material-prices");
            const data = await response.json();
            if (data.success) {
                setMDF(data.data.MDF);
                setMM(data.data.MM);
                setMattress(data.data.Mattress);
                setFurniture(data.data.Furniture);
            }
        } catch (error) {
            console.error("Error fetching income data:", error);
        }
    };

    const fetchDailyData = async () => {
        try {
            const response = await fetch("http://localhost:5001/api/admin/main/yearly-issued-material-prices");
            const data = await response.json();
            if (data.success) {
                setMDFY(data.data.MDF);
                setMMY(data.data.MM);
                setFurnitureY(data.data.Furniture);
                setMattressY(data.data.Mattress);
            }
        } catch (error) {
            console.error("Error fetching income data:", error);
        }
    };

    const renderChart = (label, data, labels, color ) => ({
        labels,
        datasets: [
            {
                label,
                data,
                borderColor: color,
                backgroundColor: color,
                fill: false,
                tension: 0.4,
            },
        ],
    });

    return (
        <div className="home-content" id="home">
            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                        <h5 className="card-title text-center">Item Category Income Comparison - This Month</h5>
                        <div style={{display: 'flex', gap: '1rem', height: '300px', marginBottom: '1rem'}}>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">MDF</h6>
                                <Line data={renderChart(`MDF - Monthly`, MDF, labelsDaily, '#2196F3')}
                                      options={chartOptions('Date','Income (Rs.)')}/>
                            </div>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">MM</h6>
                                <Line data={renderChart(`MM - Monthly`, MM, labelsDaily, '#00C49F')}
                                      options={chartOptions('Date','Income (Rs.)')}/>
                            </div>
                        </div>
                        <div style={{display: 'flex', gap: '1rem', height: '300px', marginBottom: '1rem'}}>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">Furniture</h6>
                                <Line data={renderChart(`Furniture - Monthly`, Furniture, labelsDaily, '#FF8042')}
                                      options={chartOptions('Date','Income (Rs.)')}/>
                            </div>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">Mattress</h6>
                                <Line data={renderChart(`Mattress - Monthly`, Mattress, labelsDaily, '#FFBB28')}
                                      options={chartOptions('Date','Income (Rs.)')}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="overview row-cards">
                <Card className="cards chart-card">
                    <CardBody>
                        <h5 className="card-title text-center">Item Category Income Comparison - This Year</h5>
                        <div style={{display: 'flex', gap: '1rem', height: '300px', marginBottom: '1rem'}}>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">MDF</h6>
                                <Line data={renderChart(`MDF - Yearly`, MDFY, labelsMonthly, '#a621f3')}
                                      options={chartOptions('Month','Income (Rs.)')}/>
                            </div>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">MM</h6>
                                <Line data={renderChart(`MM - Yearly`, MMY, labelsMonthly, '#c4c400')}
                                      options={chartOptions('Month','Income (Rs.)')}/>
                            </div>
                        </div>
                        <div style={{display: 'flex', gap: '1rem', height: '300px', marginBottom: '1rem'}}>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">Furniture</h6>
                                <Line data={renderChart(`Furniture - Yearly`, FurnitureY, labelsMonthly, '#ff4297')}
                                      options={chartOptions('Month','Income (Rs.)')}/>
                            </div>
                            <div style={{flex: 1}}>
                                <h6 className="text-center">Mattress</h6>
                                <Line data={renderChart(`Mattress - Yearly`, MattressY, labelsMonthly, '#28fffb')}
                                      options={chartOptions('Month','Income (Rs.)')}/>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

        </div>
    );
};

export default ItemGraphs;

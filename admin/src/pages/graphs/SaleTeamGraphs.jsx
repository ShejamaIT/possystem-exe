import React, { useEffect, useState } from 'react';
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, Input, Button } from 'reactstrap';
import {
  LineChart, Line, BarChart, Bar, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import classnames from 'classnames';
import '../../style/HomeContent.css';

// Updated color palette: 1 blue, no purple, no duplicate green
const COLORS = [
  '#1E90FF', '#00C49F', '#FF8042', '#FFBB28',
  '#FF6F91', '#F98404', '#A28FD0' , '#6DD47E'
];

const labelsMonthly = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SaleTeamGraphs = () => {
  const [mainTab, setMainTab] = useState("total");
  const [chartType, setChartType] = useState("line");
  const [graphData, setGraphData] = useState({
    onsite: { in: [], out: [] },
    walking: { in: [], out: [] },
    total: { in: [], out: [] }
  });
  const [colorMap, setColorMap] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5001/api/admin/main/sales-team-monthly-summary")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          processGraphData(data.data);
          assignColors(data.data);
        }
      })
      .catch(err => console.error("Error loading data:", err));

    // Handle print events
    const beforePrint = () => setIsPrinting(true);
    const afterPrint = () => setIsPrinting(false);

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  // --- Generate color dynamically based on number of members ---
  const generateColor = (index, total) => {
    const hue = (index / total) * 360; // evenly spaced hues
    return `hsl(${hue}, 70%, 50%)`;
  };

  // --- Assign colors to each team member dynamically ---
  const assignColors = (summary) => {
    const numMembers = summary.length;
    const map = {};

    summary.forEach((member, idx) => {
      // Use base color if available, otherwise generate one
      map[member.employeeName] = COLORS[idx] || generateColor(idx, numMembers);
    });

    setColorMap(map);
  };

  const processGraphData = (summary) => {
    const buildData = (field) =>
      labelsMonthly.map((month, monthIdx) => {
        const obj = { name: month };
        summary.forEach(member => {
          const m = member.monthlyData.find(d => d.month === monthIdx + 1);
          obj[member.employeeName] = m ? m[field] : 0;
        });
        return obj;
      });

    setGraphData({
      total: { in: buildData("inTotal"), out: buildData("outTotal") },
      walking: { in: buildData("inWalking"), out: buildData("outWalking") },
      onsite: { in: buildData("inOnsite"), out: buildData("outOnsite") },
    });
  };

  const renderLines = (sampleObj) =>
    Object.keys(sampleObj)
      .filter(key => key !== 'name')
      .map((key) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={colorMap[key] || "#ccc"}
          strokeWidth={2}
          dot={false}
        >
          {isPrinting && (
            <LabelList dataKey={key} position="top" formatter={(v) => `Rs.${v}`} />
          )}
        </Line>
      ));

  const renderBars = (sampleObj) =>
    Object.keys(sampleObj)
      .filter(key => key !== 'name')
      .map((key) => (
        <Bar
          key={key}
          dataKey={key}
          fill={colorMap[key] || "#ccc"}
        >
          {isPrinting && (
            <LabelList dataKey={key} position="top" formatter={(v) => `Rs.${v}`} />
          )}
        </Bar>
      ));

  const renderChart = (data, type) => {
    if (type === "line") {
      return (
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `Rs.${value}`} />
          <Tooltip formatter={(value) => `Rs.${value}`} />
          <Legend />
          {data.length > 0 && renderLines(data[0])}
        </LineChart>
      );
    } else {
      return (
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `Rs.${value}`} />
          <Tooltip formatter={(value) => `Rs.${value}`} />
          <Legend />
          {data.length > 0 && renderBars(data[0])}
        </BarChart>
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="home-content">
      <Card className="cards chart-card mb-4">
        <CardBody>
          {/* Tabs */}
          <Nav tabs>
            {["total", "walking", "onsite"].map(tab => (
              <NavItem key={tab}>
                <NavLink
                  className={classnames({ active: mainTab === tab })}
                  onClick={() => setMainTab(tab)}
                  style={{ cursor: "pointer" }}
                >
                  {tab === "onsite" ? "Online" :
                    tab === "walking" ? "Walking" : "Total"}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          {/* Chart Type + Print */}
          <div className="d-flex justify-content-between align-items-center my-3">
            <div>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="chartType"
                  value="line"
                  checked={chartType === "line"}
                  onChange={() => setChartType("line")}
                />
                <Label check>Line Chart</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="chartType"
                  value="bar"
                  checked={chartType === "bar"}
                  onChange={() => setChartType("bar")}
                />
                <Label check>Bar Chart</Label>
              </FormGroup>
            </div>
            <Button color="primary" onClick={handlePrint}>
              Print Chart
            </Button>
          </div>

          {/* Charts */}
          <TabContent activeTab={mainTab}>
            <TabPane tabId={mainTab} className="mt-3">
              <h5 className="text-center mb-4">
                {mainTab === "onsite" ? "Online" :
                  mainTab === "walking" ? "Walking" : "Total"} Orders
              </h5>

              <div className="mb-5">
                <h6 className="text-center">In Orders</h6>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart(graphData[mainTab].in, chartType)}
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h6 className="text-center">Out Orders</h6>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart(graphData[mainTab].out, chartType)}
                  </ResponsiveContainer>
                </div>
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default SaleTeamGraphs;
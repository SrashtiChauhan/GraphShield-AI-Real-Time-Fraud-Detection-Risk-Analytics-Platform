import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Overview() {
  const [data, setData] = useState({
    total_transactions: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
  });

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 3000);
    return () => clearInterval(interval);
  }, []);

  // chart data (dynamic)
  const chartData = [
    { name: "High", fraud: data.high_risk },
    { name: "Medium", fraud: data.medium_risk },
    { name: "Low", fraud: data.low_risk },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Total</h3>
          <p className="text-2xl font-bold">{data.total_transactions}</p>
        </div>

        <div className="bg-red-200 p-4 rounded shadow">
          <h3>High Risk</h3>
          <p className="text-2xl font-bold">{data.high_risk}</p>
        </div>

        <div className="bg-yellow-200 p-4 rounded shadow">
          <h3>Medium Risk</h3>
          <p className="text-2xl font-bold">{data.medium_risk}</p>
        </div>

        <div className="bg-green-200 p-4 rounded shadow">
          <h3>Low Risk</h3>
          <p className="text-2xl font-bold">{data.low_risk}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-4 font-semibold">Fraud Distribution</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="fraud" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
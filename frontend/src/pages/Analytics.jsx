import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics");

      const chartData = [
        { name: "High", value: res.data.high_risk },
        { name: "Medium", value: res.data.medium_risk },
        { name: "Low", value: res.data.low_risk }
      ];

      setData({
        stats: res.data,
        chart: chartData
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Analytics</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h3>Total</h3>
          <p className="text-xl font-bold">{data.stats.total_transactions}</p>
        </div>

        <div className="bg-red-200 p-4 shadow rounded">
          <h3>High Risk</h3>
          <p className="text-xl font-bold">{data.stats.high_risk}</p>
        </div>

        <div className="bg-yellow-200 p-4 shadow rounded">
          <h3>Medium Risk</h3>
          <p className="text-xl font-bold">{data.stats.medium_risk}</p>
        </div>

        <div className="bg-green-200 p-4 shadow rounded">
          <h3>Low Risk</h3>
          <p className="text-xl font-bold">{data.stats.low_risk}</p>
        </div>
      </div>

      {/* Chart */}
      <BarChart width={500} height={300} data={data.chart}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </div>
  );
}
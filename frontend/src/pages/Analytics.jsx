// // import { useEffect, useState } from "react";
// // import API from "../services/api";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid
// // } from "recharts";

// // export default function Analytics() {
// //   const [data, setData] = useState(null);

// //   useEffect(() => {
// //     fetchAnalytics();
// //   }, []);

// //   const fetchAnalytics = async () => {
// //     try {
// //       const res = await API.get("/analytics");

// //       const chartData = [
// //         { name: "High", value: res.data.high_risk },
// //         { name: "Medium", value: res.data.medium_risk },
// //         { name: "Low", value: res.data.low_risk }
// //       ];

// //       setData({
// //         stats: res.data,
// //         chart: chartData
// //       });
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   if (!data) return <p>Loading...</p>;

// //   return (
// //     <div>
// //       <h2 className="text-2xl font-bold mb-4">📊 Analytics</h2>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-3 gap-4 mb-6">
// //         <div className="bg-white p-4 shadow rounded">
// //           <h3>Total</h3>
// //           <p className="text-xl font-bold">{data.stats.total_transactions}</p>
// //         </div>

// //         <div className="bg-red-200 p-4 shadow rounded">
// //           <h3>High Risk</h3>
// //           <p className="text-xl font-bold">{data.stats.high_risk}</p>
// //         </div>

// //         <div className="bg-yellow-200 p-4 shadow rounded">
// //           <h3>Medium Risk</h3>
// //           <p className="text-xl font-bold">{data.stats.medium_risk}</p>
// //         </div>

// //         <div className="bg-green-200 p-4 shadow rounded">
// //           <h3>Low Risk</h3>
// //           <p className="text-xl font-bold">{data.stats.low_risk}</p>
// //         </div>
// //       </div>

// //       {/* Chart */}
// //       <BarChart width={500} height={300} data={data.chart}>
// //         <CartesianGrid strokeDasharray="3 3" />
// //         <XAxis dataKey="name" />
// //         <YAxis />
// //         <Tooltip />
// //         <Bar dataKey="value" />
// //       </BarChart>
// //     </div>
// //   );
// // }


import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <p>Loading...</p>;

  const chartData = [
    { name: "High", value: stats.high_risk },
    { name: "Medium", value: stats.medium_risk },
    { name: "Low", value: stats.low_risk }
  ];

  const fraudRate = ((stats.high_risk / stats.total_transactions) * 100).toFixed(2);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-6"> Fraud Analytics</h2>

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-black p-6 rounded border border-gray-700">
          <h3 className="text-gray-400">Fraud Rate</h3>
          <p className="text-4xl font-bold text-green-400">{fraudRate}%</p>
        </div>

        <div className="bg-black p-6 rounded border border-gray-700">
          <h3 className="text-gray-400">Fraud Transactions</h3>
          <p className="text-4xl font-bold text-red-400">{stats.high_risk}</p>
        </div>

      </div>

      {/* 📊 BAR CHART */}
      <div className="bg-black p-4 rounded border border-gray-700 mb-6">
        <h3 className="mb-4 text-gray-300">Risk Distribution</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 EXTRA CHART (CATEGORY SIMULATION) */}
      <div className="bg-black p-4 rounded border border-gray-700">
        <h3 className="mb-4 text-gray-300">Fraud by Category (Simulated)</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: "Food", fraud: 10 },
            { name: "Travel", fraud: 18 },
            { name: "Shopping", fraud: 25 },
            { name: "Bills", fraud: 8 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="fraud" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}


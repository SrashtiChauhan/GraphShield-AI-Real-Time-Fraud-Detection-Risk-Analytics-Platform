import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Model() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/model-stats");
      setStats(res.data);

      // 📈 track accuracy history
      setHistory((prev) => [
        ...prev.slice(-9),
        {
          time: new Date().toLocaleTimeString(),
          accuracy: res.data.accuracy
        }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 Model Monitor</h2>

      {/* 🚨 MODEL ALERT */}
      {stats.model_alert && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded shadow animate-pulse">
          ⚠ Model Accuracy Dropping! Immediate Attention Needed
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <h3>Total</h3>
          <p className="text-xl font-bold">{stats.total_transactions}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Accuracy</h3>
          <p className="text-xl font-bold text-green-600">
            {stats.accuracy}%
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Fraud Ratio</h3>
          <p className="text-xl font-bold text-red-500">
            {stats.fraud_ratio}%
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3>Drift</h3>
          <p className={`text-xl font-bold ${
            stats.drift === "HIGH"
              ? "text-red-500"
              : stats.drift === "MEDIUM"
              ? "text-yellow-500"
              : "text-green-500"
          }`}>
            {stats.drift}
          </p>
        </div>

      </div>

      {/* 📈 ACCURACY TREND */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-4 font-semibold">Accuracy Over Time</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="time" />
            <YAxis domain={[80, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="accuracy" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
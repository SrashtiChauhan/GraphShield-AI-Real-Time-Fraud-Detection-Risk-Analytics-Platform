import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", fraud: 4 },
  { name: "Tue", fraud: 7 },
  { name: "Wed", fraud: 3 },
  { name: "Thu", fraud: 8 },
  { name: "Fri", fraud: 5 },
];

export default function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Total Transactions</h3>
          <p className="text-2xl font-bold">12,430</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Fraud Detected</h3>
          <p className="text-2xl font-bold text-red-500">320</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">High Risk Alerts</h3>
          <p className="text-2xl font-bold text-yellow-500">89</p>
        </div>

      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-4 font-semibold">Fraud Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
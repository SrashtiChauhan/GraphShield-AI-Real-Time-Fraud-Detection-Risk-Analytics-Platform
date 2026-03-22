import { useEffect, useState } from "react";
import API from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();

    const interval = setInterval(() => {
      fetchTransactions();
    }, 3000); // every 3 sec

    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {/* 🚨 ALERT BANNER */}
      {transactions.length > 0 && transactions[0].risk_level === "HIGH" && (
        <div className="mb-4 p-3 bg-red-500 text-white rounded shadow">
          ⚠ High Risk Transaction Detected!
        </div>
      )}

      {/* 📊 TABLE */}
      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Location</th>
            <th className="p-2">Risk</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx, index) => {
            let colorClass = "";

            if (tx.risk_level === "HIGH") {
              colorClass = "bg-red-200 text-red-800";
            } else if (tx.risk_level === "MEDIUM") {
              colorClass = "bg-yellow-200 text-yellow-800";
            } else {
              colorClass = "bg-green-200 text-green-800";
            }

            return (
              <tr key={index} className="text-center border-t hover:bg-gray-50">
                <td className="p-2">{tx.user_id}</td>
                <td className="p-2 font-semibold">₹{tx.amount}</td>
                <td className="p-2">{tx.location}</td>

                <td className="p-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                    {tx.risk_level}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
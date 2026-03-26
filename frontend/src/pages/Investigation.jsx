import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function Investigation() {
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);

  const [params] = useSearchParams();
  const txIdFromURL = params.get("tx");

  // =========================
  // 📥 FETCH TRANSACTIONS
  // =========================
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🔍 FETCH SINGLE TX
  // =========================
  const fetchTransactionById = async (id) => {
    try {
      const res = await API.get(`/transaction/${id}`);
      setSelected(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // 🟢 INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchTransactions();

    // auto refresh every 5 sec
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // 🔗 HANDLE URL PARAM (FROM ALERT CLICK)
  // =========================
  useEffect(() => {
    if (txIdFromURL) {
      fetchTransactionById(txIdFromURL);
    }
  }, [txIdFromURL]);

  // =========================
  // 🖱 CLICK HANDLER
  // =========================
  const handleClick = (id) => {
    fetchTransactionById(id);
  };

  // =========================
  // 🎨 RISK COLOR
  // =========================
  const getRiskColor = (risk) => {
    if (risk === "HIGH") return "text-red-600";
    if (risk === "MEDIUM") return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🔍 Investigation</h2>

      <div className="grid grid-cols-2 gap-4">

        {/* LEFT PANEL */}
        <div className="bg-white p-4 shadow rounded h-[450px] overflow-auto">
          <h3 className="font-semibold mb-2">Transactions</h3>

          {transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => handleClick(tx.id)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                selected?.id === tx.id ? "bg-blue-100" : ""
              }`}
            >
              <p>
                <b>User {tx.user_id}</b>
              </p>

              <p className="text-sm text-gray-500">
                ₹{tx.amount} •{" "}
                <span className={getRiskColor(tx.risk_level)}>
                  {tx.risk_level}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Details</h3>

          {!selected ? (
            <p className="text-gray-500">Select a transaction</p>
          ) : (
            <div className="space-y-2">

              <p><b>ID:</b> {selected.id}</p>
              <p><b>User:</b> {selected.user_id}</p>

              <p>
                <b>Amount:</b>{" "}
                <span className="font-semibold">₹{selected.amount}</span>
              </p>

              <p>
                <b>Risk:</b>{" "}
                <span className={getRiskColor(selected.risk_level)}>
                  {selected.risk_level}
                </span>
              </p>

              <p><b>Location:</b> {selected.location}</p>
              <p><b>Device:</b> {selected.device_id}</p>

              <p>
                <b>Fraud Probability:</b>{" "}
                {selected.fraud_probability}
              </p>

              <p className="text-sm text-gray-500">
                <b>Time:</b>{" "}
                {new Date(selected.timestamp).toLocaleString()}
              </p>

              {/* 🚨 EXTRA ALERT */}
              {selected.risk_level === "HIGH" && (
                <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                  ⚠ This transaction is HIGH RISK. Investigate immediately.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Investigation() {
  const [transactions, setTransactions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };

  const handleClick = async (id) => {
    console.log("CLICKED ID:", id); // 🔥 DEBUG

    try {
      const res = await API.get(`/transaction/${id}`);
      console.log("DATA:", res.data); // 🔥 DEBUG

      setSelected(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🔍 Investigation</h2>

      <div className="grid grid-cols-2 gap-4">

        {/* LEFT */}
        <div className="bg-white p-4 shadow rounded h-[400px] overflow-auto">
          <h3 className="font-semibold mb-2">Transactions</h3>

          {transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => handleClick(tx.id)}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
            >
              <p><b>User {tx.user_id}</b></p>
              <p className="text-sm text-gray-500">
                ₹{tx.amount} • {tx.risk_level}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold mb-2">Details</h3>

          {!selected ? (
            <p className="text-gray-500">Select a transaction</p>
          ) : (
            <div>
              <p><b>ID:</b> {selected.id}</p>
              <p><b>User:</b> {selected.user_id}</p>
              <p><b>Amount:</b> ₹{selected.amount}</p>
              <p><b>Risk:</b> {selected.risk_level}</p>
              <p><b>Location:</b> {selected.location}</p>
              <p><b>Device:</b> {selected.device_id}</p>
              <p><b>Fraud:</b> {selected.fraud_probability}</p>
              <p><b>Time:</b> {selected.timestamp}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
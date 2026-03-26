import { useEffect, useState, useRef } from "react";
import API from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [flash, setFlash] = useState(false);

  // store previous alerts count
  const prevCount = useRef(0);

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/alerts");

      // 🔥 detect NEW alert
      if (res.data.length > prevCount.current) {
        triggerAlertEffect();
      }

      prevCount.current = res.data.length;
      setAlerts(res.data);

    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // 🔴 FLASH + 🔊 SOUND
  const triggerAlertEffect = () => {
    setFlash(true);

    // 🔊 sound
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
    );
    audio.play();

    // stop flash after 1 sec
    setTimeout(() => setFlash(false), 1000);
  };

  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🔗 open transaction details
  const openTransaction = (txId) => {
    window.location.href = `/investigation?tx=${txId}`;
  };

  return (
    <div className={`p-5 ${flash ? "bg-red-200 transition" : ""}`}>
      <h2 className="text-2xl font-bold mb-4">🚨 Fraud Alerts</h2>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts yet</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => openTransaction(alert.transaction_id)}
              className="bg-red-100 border-l-4 border-red-500 p-4 rounded shadow cursor-pointer hover:bg-red-200 transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-red-700">
                  ⚠ High Risk Alert
                </h3>
                <span className="text-sm text-gray-500">
                  ID: {alert.id}
                </span>
              </div>

              <p className="mt-2">
                <b>Transaction ID:</b> {alert.transaction_id}
              </p>

              <p>
                <b>Risk Level:</b>{" "}
                <span className="text-red-600 font-semibold">
                  {alert.risk_level}
                </span>
              </p>

              <p>
                <b>Reason:</b> {alert.reason}
              </p>

              {alert.created_at && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
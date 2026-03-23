import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">GraphShield</h2>

      <ul className="space-y-4">
        <li><Link to="/">Overview</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/alerts">Alerts</Link></li>
        <li><Link to="/investigation">Investigation</Link></li>
        {/* <li><Link to="/network">Fraud Network</Link></li> */}
        <li><Link to="/analytics">Analytics</Link></li>
        <li><Link to="/model">Model Monitor</Link></li>
        <li><Link to="/graph">Fraud Network</Link></li>
      </ul>
    </div>
  );
}
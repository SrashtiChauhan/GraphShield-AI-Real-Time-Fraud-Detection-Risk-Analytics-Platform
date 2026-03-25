import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Graph from "./pages/Graph";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Alerts from "./pages/Alerts";
import Investigation from "./pages/Investigation";
import Analytics from "./pages/Analytics";
import Model from "./pages/Model";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <Routes>

        {/* 🔓 PUBLIC ROUTES (NO LOGIN REQUIRED) */}
        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* default → login */}
            <Route path="*" element={<Login />} />
          </>
        )}

        {/* 🔐 PROTECTED ROUTES (LOGIN REQUIRED) */}
        {isAuthenticated && (
          <>
            <Route path="/" element={<Layout><Overview /></Layout>} />
            <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
            <Route path="/graph" element={<Layout><Graph /></Layout>} />
            <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
            <Route path="/investigation" element={<Layout><Investigation /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/model" element={<Layout><Model /></Layout>} />

            {/* fallback */}
            <Route path="*" element={<Layout><Overview /></Layout>} />
          </>
        )}

      </Routes>
    </Router>
  );
}

export default App;
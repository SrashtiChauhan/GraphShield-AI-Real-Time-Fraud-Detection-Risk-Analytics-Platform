import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Graph from "./pages/Graph";
import Login from "./pages/Login";
import Alerts from "./pages/Alerts";
import Investigation from "./pages/Investigation";
import Analytics from "./pages/Analytics";
import Model from "./pages/Model";

function App() {
  // check if user is logged in
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* 🔐 If NOT logged in → show only login */}
        {!isAuthenticated ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            {/* ✅ Protected routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <Overview />
                </Layout>
              }
            />
            <Route
              path="/transactions"
              element={
                <Layout>
                  <Transactions />
                </Layout>
              }
            />
            <Route
              path="/graph"
              element={
                <Layout>
                  <Graph />
                </Layout>
              }
            />

            {/* optional fallback */}
            <Route
              path="*"
              element={
                <Layout>
                  <Overview />
                </Layout>
              }
            />
            <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
<Route path="/investigation" element={<Layout><Investigation /></Layout>} />
<Route path="/analytics" element={<Layout><Analytics /></Layout>} />
<Route path="/model" element={<Layout><Model /></Layout>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
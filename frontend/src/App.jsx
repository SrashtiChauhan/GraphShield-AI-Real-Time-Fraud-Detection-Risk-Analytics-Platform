import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

        {/* 🔓 PUBLIC ROUTES */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout><Overview /></Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/transactions"
          element={
            isAuthenticated ? (
              <Layout><Transactions /></Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/graph"
          element={
            isAuthenticated ? (
              <Layout><Graph /></Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/alerts"
          element={
            isAuthenticated ? (
              <Layout><Alerts /></Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/investigation"
          element={
            isAuthenticated ? (
              <Layout><Investigation /></Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/analytics"
          element={
            isAuthenticated ? (
              <Layout><Analytics /></Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/model"
          element={
            isAuthenticated ? (
              <Layout><Model /></Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🔁 FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
        />

      </Routes>
    </Router>
  );
}

export default App;
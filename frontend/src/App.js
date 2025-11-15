import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import CandidatesList from "./components/Dashboard/CandidatesList";
import Profile from "./components/Profile/Profile";
import Results from "./components/Results/Results";
import AddCandidate from './components/Admin/AddCandidate';
import EditCandidateWrapper from "./components/Admin/EditCandidateWrapper";

// PRIVATE route wrapper: checks JWT
function PrivateRoute({ children }) {
  const jwt = localStorage.getItem("token");
  return jwt ? children : <Navigate to="/login" />;
}

// ADMIN-only route wrapper: checks user role
function AdminRoute({ children }) {
  const userStr = localStorage.getItem("user");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  return user?.role === "admin"
    ? children
    : <Navigate to="/dashboard" />;
}

// After login/signup, call this to navigate to dashboard

export default function App() {
  return (
    
    <BrowserRouter>
    <div className="animated-bg" />
      <Routes>
        {/* Redirect root to signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Open routes */}
        <Route path="/signup" element={<WithRedirectWrapper component={Signup} />} />
        <Route path="/login" element={<WithRedirectWrapper component={Login} />} />

        {/* User protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <CandidatesList />
            </PrivateRoute>
          }
        />
        {/* User protected profile/results */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <Results />
            </PrivateRoute>
          }
        />
        {/* ADMIN protected add-candidate route */}
        <Route
          path="/add-candidate"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AddCandidate />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
    path="/edit-candidate/:candidateId"
    element={
      <PrivateRoute>
        <AdminRoute>
          <EditCandidateWrapper />
        </AdminRoute>
      </PrivateRoute>
    }
  />
        {/* Catch-all to redirect unknown routes to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

// Helper: wraps Signup/Login for redirect after auth
function WithRedirectWrapper({ component: Component }) {
  // Use this in your Signup/Login to navigate to /dashboard after successful action
  const navigate = useNavigate();
  return <Component navigate={navigate} />;
}

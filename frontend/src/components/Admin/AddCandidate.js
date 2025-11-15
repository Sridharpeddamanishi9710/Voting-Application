import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./AddCandidate.css";

export default function AddCandidate({ onAdded }) {
  const [form, setForm] = useState({ name: "", party: "", age: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Check admin access
  const userStr = localStorage.getItem("user");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  // Idle detection logic
  const resetIdleTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      navigate("/dashboard");
    }, 10000); // 10 seconds idle
  };

  useEffect(() => {
    resetIdleTimer();
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line
  }, []);

  if (!isAdmin) {
    return (
      <div className="add-candidate-container">
        <div className="add-candidate-error" style={{margin:'38px 0', fontSize:'1.1rem', fontWeight:'600'}}>
          Access denied: Only admin users can add candidates.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    resetIdleTimer();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetIdleTimer();
    setLoading(true);
    setMsg("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      await api.post("/candidate", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Candidate added!");
      setForm({ name: "", party: "", age: "" });
      if (onAdded) onAdded();

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error adding candidate"
      );
    }
    setLoading(false);
  };

  return (
    <div className="add-candidate-container">
      <form className="add-candidate-form" onSubmit={handleSubmit}>
        <h3>Add Candidate</h3>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          required
          onChange={handleChange}
        />
        <input
          name="party"
          placeholder="Party"
          value={form.party}
          required
          onChange={handleChange}
        />
        <input
          name="age"
          placeholder="Age"
          value={form.age}
          required
          type="number"
          min="18"
          onChange={handleChange}
        />
        <button type="submit" className="add-candidate-btn" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
        {msg && <div className="add-candidate-msg">{msg}</div>}
        {error && <div className="add-candidate-error">{error}</div>}
      </form>
    </div>
  );
}

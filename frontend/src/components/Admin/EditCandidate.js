import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./EditCandidate.css";

export default function EditCandidate({ candidateId, onEdited }) {
  const [form, setForm] = useState({ name: "", party: "", age: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchCandidate() {
      setFetching(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/candidate", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = res.data.find(c => c._id === candidateId || c.id === candidateId);
        if (found) setForm({ name: found.name, party: found.party, age: found.age });
        else setError("Candidate not found");
      } catch (err) {
        setError("Error loading candidate details.");
      }
      setFetching(false);
    }
    if (candidateId) fetchCandidate();
  }, [candidateId]);

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
      await api.put(`/candidate/${candidateId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Candidate updated!");
      if (onEdited) onEdited();
      setTimeout(() => navigate("/dashboard"), 1200); // show msg, then redirect
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error updating candidate"
      );
    }
    setLoading(false);
  };

  if (!candidateId) return <div className="edit-candidate-card">No candidate selected...</div>;
  if (fetching) return <div className="edit-candidate-card">Loading candidate details...</div>;
  if (error) return <div className="edit-candidate-card"><div className="edit-candidate-error">{error}</div></div>;

  return (
    <div className="edit-candidate-card" onClick={resetIdleTimer}>
      <form className="edit-candidate-form" onSubmit={handleSubmit}>
        <h3>Edit Candidate</h3>
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
        <button type="submit" className="edit-candidate-btn" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        {msg && <div className="edit-candidate-msg">{msg}</div>}
        {error && <div className="edit-candidate-error">{error}</div>}
      </form>
    </div>
  );
}

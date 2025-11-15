import React, { useState } from "react";

// Make sure "api" is imported correctly from your API setup:
import api from "../../api"; // or "../api" based on your folder structure

export default function VoteButton({ candidateId, disabled, onVote }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Debug log (you should check this in browser console)
  console.log("Attempting to vote for candidateId:", candidateId);

  const handleVote = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/candidate/vote/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message || "Voted!");
      if (onVote) onVote();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Vote error"
      );
    }
    setLoading(false);
  };

  return (
    <span style={{ marginLeft: 12 }}>
      <button
        disabled={disabled || loading}
        onClick={handleVote}
        style={{ padding: "5px 15px" }}
      >
        {loading ? "Voting..." : "Vote"}
      </button>
      {message && <span style={{ color: "green", marginLeft: 8 }}>{message}</span>}
      {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
    </span>
  );
}

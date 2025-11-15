import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import './CandidatesList.css';

export default function CandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVoted, setIsVoted] = useState(false);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/candidate", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCandidates(res.data);

        const prof = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsVoted(Boolean(prof.data.user?.isVoted));
      } catch (err) {
        setError("Failed to load candidates");
      }
    }
    load();
  }, []);

  const vote = async (cand) => {
    const candidateId = cand._id || cand.id;
    if (!candidateId) {
      setError("Invalid candidate ID");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/candidate/vote/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message || "Voted!");
      setIsVoted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Vote error");
    }
  };

  return (
    <div className="candidates-container">
      <h2>Candidates</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      {isAdmin && (
        <button className="add-candidate-btn" onClick={() => navigate("/add-candidate")}>
          Add Candidate
        </button>
      )}
      {candidates.length === 0 && !error && (
        <div className="no-candidates">No candidates found.</div>
      )}
      <div className="candidate-list">
        {candidates.map((cand, idx) => (
          <div
            key={cand._id || cand.id}
            className="candidate-card"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div>
              <span className="cand-name">{cand.name}</span>
              <span className="cand-party">{cand.party}</span>
            </div>
            <div className="cand-actions">
              <button
                disabled={isVoted}
                className="vote-btn"
                onClick={() => vote(cand)}
              >
                Vote
              </button>
              {isAdmin && (
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-candidate/${cand._id}`)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-nav">
        <button onClick={() => navigate("/results")}>View Results</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</button>
      </div>
    </div>
  );
}

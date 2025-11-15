import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./Results.css";

export default function Results() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/candidate/vote/count")
      .then(res => setResults(res.data));
  }, []);

  return (
    <div className="results-container">
      <h2>Vote Results</h2>
      {results.length === 0 ? (
        <div className="no-results">No results to display.</div>
      ) : (
        <div className="results-list">
          {results.map((item, idx) => (
            <div className="results-card" key={idx} style={{ animationDelay: `${idx * 0.12}s` }}>
              <div className="result-party">{item.party}</div>
              <div className="result-votes">{item.count} Votes</div>
            </div>
          ))}
        </div>
      )}
      <div className="results-nav">
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</button>
      </div>
    </div>
  );
}

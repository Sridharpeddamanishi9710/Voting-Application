import React, { useState } from "react";
import api from "../../api";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css"

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    aadharCardNumber: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const change = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      await api.post("/user/signup", form);
      setMsg("Signup successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1000); // Redirect after 1 sec
    } catch (err) {
      setError(err?.response?.data?.error || "Signup error");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={submit}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={change}
            required
            autoComplete="name"
            placeholder="Your Name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
            autoComplete="email"
            placeholder="you@email.com"
          />
        </div>
        <div className="form-group">
          <label>Aadhaar Number</label>
          <input
            name="aadharCardNumber"
            value={form.aadharCardNumber}
            onChange={change}
            required
            placeholder="1234 5678 9012"
            pattern="\d{12}"
            title="12 digit Aadhaar number"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            required
            autoComplete="new-password"
            placeholder="Create password"
          />
        </div>
        <button type="submit">Sign Up</button>
        {error && <div className="error">{error}</div>}
        {msg && <div className="success">{msg}</div>}
        <div className="nav-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
}

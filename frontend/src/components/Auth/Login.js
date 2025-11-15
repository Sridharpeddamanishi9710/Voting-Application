import React, { useState } from "react";
import api from "../../api";
import { useNavigate, Link } from "react-router-dom";
import './Login.css'; // or App.css/global styles

export default function Login() {
  const [form, setForm] = useState({
    aadharCardNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Login error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submit}>
        <h2>Log In</h2>
        <div className="form-group">
          <label>Aadhaar Number</label>
          <input
            name="aadharCardNumber"
            value={form.aadharCardNumber}
            onChange={change}
            required
            autoComplete="username"
            placeholder="Enter Aadhaar Number"
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
            autoComplete="current-password"
            placeholder="Enter password"
          />
        </div>
        <button type="submit">Log In</button>
        {error && <div className="error">{error}</div>}
        <div className="nav-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

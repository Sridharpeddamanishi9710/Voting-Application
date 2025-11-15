import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    aadharCardNumber: "",
    password: "",
    role: "voter",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/user/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.response));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup error");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 350, margin: "40px auto", padding: 20, boxShadow: "0 0 6px #ccc" }}>
      <h2 style={{ textAlign: "center" }}>Signup</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={change} required style={{ width: "100%", margin: "8px 0", padding: 7 }} />
      <input name="age" placeholder="Age" value={form.age} onChange={change} required type="number" style={{ width: "100%", margin: "8px 0", padding: 7 }} />
      <input name="email" placeholder="Email" value={form.email} onChange={change} type="email" style={{ width: "100%", margin: "8px 0", padding: 7 }} />
      <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={change} type="text" style={{ width: "100%", margin: "8px 0", padding: 7 }} />
      <input name="address" placeholder="Address" value={form.address} onChange={change} required style={{ width: "100%", margin: "8px 0", padding: 7 }} />
      <input name="aadharCardNumber" placeholder="Aadhaar Card Number" value={form.aadharCardNumber} onChange={change} required style={{ width: "100%", margin: "8px 0", padding: 7 }} />
      <input name="password" placeholder="Password" value={form.password} onChange={change} type="password" required style={{ width: "100%", margin: "8px 0", padding: 7 }} />
      <label>
        Role:
        <select name="role" value={form.role} onChange={change} style={{ width: "100%", margin: "8px 0", padding: 7 }}>
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button type="submit" style={{ width: "100%", margin: "12px 0", padding: 8 }}>
        Signup
      </button>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <p style={{ textAlign: "center", marginTop: 16 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

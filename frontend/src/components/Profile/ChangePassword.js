import React, { useState } from "react";
import api from "../../api";

/**
 * ChangePassword component:
 * - Calls /user/profile/password with old and new password.
 * - Notifies parent via onSuccess callback (optional).
 */
export default function ChangePassword({ onSuccess }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await api.put("/user/profile/password", form);
      setMessage("Password changed!");
      if (onSuccess) onSuccess();
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Password update failed"
      );
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "18px 0" }}>
      <h4>Change Password</h4>
      <input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        value={form.currentPassword}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0" }}
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={form.newPassword}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0" }}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </button>
      {message && <div style={{ color: "green", marginTop: 8 }}>{message}</div>}
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}

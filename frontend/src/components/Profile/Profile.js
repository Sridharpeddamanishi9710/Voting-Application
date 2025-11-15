import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.user);
      } catch (err) {
        setError("Failed to load profile.");
      }
    }
    fetchProfile();
  }, []);

  const handlePwdChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      await api.post("/user/change-password", { password: newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg("Password changed successfully!");
      setShowChangePwd(false);
      setNewPassword("");
    } catch (err) {
      setError(err?.response?.data?.error || "Error changing password.");
    }
    setLoading(false);
  };

  if (!profile) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h3>Profile</h3>
      <div className="profile-field"><strong>Name:</strong> {profile.name}</div>
      <div className="profile-field"><strong>Email:</strong> {profile.email}</div>
      <div className="profile-field"><strong>Aadhaar:</strong> {profile.aadharCardNumber}</div>
      <div className="profile-field"><strong>Role:</strong> {profile.role}</div>
      <div className="profile-actions">
        {/* Show Change Password button or password form */}
        {!showChangePwd ? (
          <button onClick={() => setShowChangePwd(true)}>
            Change Password
          </button>
        ) : (
          <form className="change-pwd-form" onSubmit={handlePwdChange}>
            <input
              type="password"
              value={newPassword}
              required
              placeholder="Enter new password"
              onChange={e => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Changing..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => setShowChangePwd(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
      {msg && <div className="msg">{msg}</div>}
      {error && <div className="error">{error}</div>}

      <div className="profile-nav">
        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </div>
    </div>
  );
}

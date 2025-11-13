import React, { useState } from "react";
import "./../styles.css";
import { register as apiRegister } from "../api";

export default function Register({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRegister(name, email, password);
      console.log("Registration successful:", response);
      alert(`Welcome ${response.user.name}! Registration successful!`);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div className="page-wrap">
      <div className="left-col">
        <h1 className="title">Create Account</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Name</label>
          <div className="input-pill">
            <span className="input-icon">👤</span>
            <input
              type="text"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label className="label">Email</label>
          <div className="input-pill">
            <span className="input-icon">📧</span>
            <input
              type="email"
              value={email}
              placeholder="email@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="label">Password</label>
          <div className="input-pill">
            <span className="input-icon">🔒</span>
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              placeholder="Enter your password (min 6 chars)"
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPwd((s) => !s)}
              aria-label="Toggle password visibility"
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          </div>

          <button className="primary-btn" type="submit">
            Sign Up
          </button>

          <p className="signup">
            Already have an account?{" "}
            <a href="#Login"  onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
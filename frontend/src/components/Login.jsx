import React, { useState } from "react";
import "./../styles.css";
import { login as apiLogin } from "../api";

export default function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiLogin(email, password);
      console.log("Login successful:", response);
      alert(`Welcome ${response.user.name}!`);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="page-wrap">
      <div className="left-col">
        <h1 className="title">Welcome Coders!!</h1>

        <form className="form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
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

            <div className="forgot-row">
              <a className="forgot" href="#forgot">
                Forgot Password?
              </a>
            </div>

            <button className="primary-btn" type="submit">
              Login
            </button>

            <p className="signup">
              Don't have an account?{" "}
              <a
                href="#Register"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToRegister();
                }}
              >
                Sign up
              </a>
          </p>
        </form>
      </div>
    </div>
  );
}
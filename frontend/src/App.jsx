import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./styles.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login"); // "login" or "register"

  return (
    <>
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/login.mp4" type="video/mp4" />
        </video>
      </div>

      {currentPage === "login" && (
        <Login onSwitchToRegister={() => setCurrentPage("register")} />
      )}
      {currentPage === "register" && (
        <Register onSwitchToLogin={() => setCurrentPage("login")} />
      )}
    </>
  );
}

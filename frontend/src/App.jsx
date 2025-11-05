import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./styles.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login"); // "login" or "register"

  return (
    <>
      {currentPage === "login" && (
        <Login onSwitchToRegister={() => setCurrentPage("register")} />
      )}
      {currentPage === "register" && (
        <Register onSwitchToLogin={() => setCurrentPage("login")} />
      )}
    </>
  );
}

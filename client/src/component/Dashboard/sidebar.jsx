import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const Sidebar = () => {
  const navigate = useNavigate()
  return (
    <div
      className="d-flex flex-column shadow"
      style={{
        width: "220px",
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid #e0e0e0",
        padding: "20px",
        height:"100%"
      }}
    >
      {/* Sidebar Header */}
      <div className="mb-4">
        <h4 className="text-center" style={{ color: "#333",marginTop:"20px",fontFamily:"initial",marginBottom:"80px" }}>
          Admin Dashboard
        </h4>
      </div>

      {/* Sidebar Links */}
      <ul className="nav flex-column">
      <li className="nav-item mb-3">
          <a
            href="/dashboard"
            className="nav-link text-dark px-3 py-2 rounded hover-style"
            style={{
              fontSize: "1.1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
              fontFamily:"cursive"
            }}
          >
            <i className="bi bi-people-fill me-2"></i> Signin Page
          </a>
        </li>
        <li className="nav-item mb-3">
          <a
            href="/dashboard/user"
            className="nav-link text-dark px-3 py-2 rounded hover-style"
            style={{
              fontSize: "1.1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
              fontFamily:"cursive"
            }}
          >
            <i className="bi bi-people-fill me-2"></i> Users Page
          </a>
        </li>
        <li className="nav-item mb-3">
          <a
            href="/dashboard/prof"
            className="nav-link text-dark px-3 py-2 rounded hover-style"
            style={{
              fontSize: "1.1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
               fontFamily:"cursive"
            }}
          >
            <i className="bi bi-person-workspace me-2"></i> Prof Page
          </a>
        </li>
        <li className="nav-item mb-3">
          <a
            href="/dashboard/course"
            className="nav-link text-dark px-3 py-2 rounded hover-style"
            style={{
              fontSize: "1.1rem",
              fontWeight: "500",
              transition: "all 0.3s ease",
               fontFamily:"cursive"
            }}
          >
            <i className="bi bi-person-workspace me-2"></i> Course Page
          </a>
        </li>
      </ul>
    </div>
   );
};


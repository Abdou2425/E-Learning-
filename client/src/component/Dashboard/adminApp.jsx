import React from "react";
import "./admin.css";
import { Sidebar } from "./sidebar.jsx";
import { Outlet } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
export function Adminapp() {
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
      <div style={{ flexShrink: 0, flexBasis: "auto" }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, height: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

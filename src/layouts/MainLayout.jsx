import React from "react";
import { Outlet, Link } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <nav style={{ padding: "1rem", background: "#f4f4f4" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/payments">Payments</Link> |{" "}
        <Link to="/logs">Logs</Link> |{" "}
        <Link to="/configurations">Configurations</Link> |{" "}
        <Link to="/testcases">Test Cases</Link>
      </nav>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;

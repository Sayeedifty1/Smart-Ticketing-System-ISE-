/**
 * Layout
 * ------
 * Wraps all pages with the shared Navbar and renders the current route below it.
 */

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-transit-dark">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

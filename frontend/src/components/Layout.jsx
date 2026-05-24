// src/components/Layout.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

// Routes that are part of the authenticated dashboard
const DASHBOARD_ROUTES = ["/dashboard"];

export default function Layout({ children }) {
    const { user, theme } = useAuth();
    const { pathname } = useLocation();

    const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));
    const showSidebar = user && isDashboard;

    // Apply theme attribute on <html> so CSS vars cascade everywhere
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    if (showSidebar) {
        return (
            <div className="app-shell">
                <Sidebar />
                <main className="main-content">{children}</main>
            </div>
        );
    }

    return <>{children}</>;
}

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Tenants from "./scenes/tenants";
import Both from "./scenes/both";
import Owners from "./scenes/owners";
import Property from "./scenes/Property";
import Active from "./scenes/Active";
import Account from "./scenes/Account";
import Rented from "./scenes/Rented";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Terms from "./scenes/Terms";
import Login from "./scenes/Login";
import NotificationsPage from "./scenes/notification";
import Commision from "./scenes/commision";
import DisputesPage from "./scenes/disputes";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (e.g., via a token in localStorage)
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {isAuthenticated && (
              <Topbar onLogout={handleLogout} setIsSidebar={setIsSidebar} />
            )}
            <Routes>
              {/* If not authenticated, show the login page */}
              <Route
                path="/"
                element={
                  !isAuthenticated ? (
                    <Login onLogin={() => setIsAuthenticated(true)} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/commision"
                element={isAuthenticated ? <Commision /> : <Navigate to="/" />}
              />

              <Route
                path="/tenants"
                element={isAuthenticated ? <Tenants /> : <Navigate to="/" />}
              />
              <Route
                path="/owners"
                element={isAuthenticated ? <Owners /> : <Navigate to="/" />}
              />
              <Route
                path="/both"
                element={isAuthenticated ? <Both /> : <Navigate to="/" />}
              />
              <Route
                path="/active"
                element={isAuthenticated ? <Active /> : <Navigate to="/" />}
              />
              <Route
                path="/account"
                element={isAuthenticated ? <Account /> : <Navigate to="/" />}
              />
              <Route
                path="/property"
                element={isAuthenticated ? <Property /> : <Navigate to="/" />}
              />
              
              <Route
                path="/rented"
                element={isAuthenticated ? <Rented /> : <Navigate to="/" />}
              />
              <Route
                path="/terms"
                element={isAuthenticated ? <Terms /> : <Navigate to="/" />}
              />
            
            <Route
                path="/disputes"
                element={isAuthenticated ? <DisputesPage /> : <Navigate to="/" />}
              />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

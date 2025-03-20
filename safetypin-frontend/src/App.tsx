import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Theme
import theme from "./theme";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import { AuthProvider } from "./components/auth/AuthContext";

// Layout
import Layout from "./components/layout/Layout";

// Dashboard Components
import Dashboard from "./components/dashboard/Dashboard";
import ServerList from "./components/sftp/ServerList";
import ServerDetails from "./components/sftp/ServerDetails";
import ServerProvision from "./components/sftp/ServerProvision";
import WebClient from "./components/sftp/WebClient";
import Profile from "./components/settings/Profile";
import Security from "./components/settings/Security";
import Billing from "./components/settings/Billing";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            
            <Route path="/servers" element={
              <Layout>
                <ServerList />
              </Layout>
            } />
            
            <Route path="/servers/new" element={
              <Layout>
                <ServerProvision />
              </Layout>
            } />
            
            <Route path="/servers/:id" element={
              <Layout>
                <ServerDetails />
              </Layout>
            } />
            
            <Route path="/web-client/:id" element={
              <Layout>
                <WebClient />
              </Layout>
            } />
            
            <Route path="/profile" element={
              <Layout>
                <Profile />
              </Layout>
            } />
            
            <Route path="/security" element={
              <Layout>
                <Security />
              </Layout>
            } />
            
            <Route path="/billing" element={
              <Layout>
                <Billing />
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
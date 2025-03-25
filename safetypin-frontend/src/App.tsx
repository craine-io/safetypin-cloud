import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import APITest from './components/APITest';
import { AuthProvider } from './components/auth/AuthContext';
import ForgotPassword from './components/auth/ForgotPassword';
// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
// Dashboard Components
import Dashboard from './components/dashboard/Dashboard';
// Layout
import Layout from './components/layout/Layout';
// Import both billing components
import Billing from './components/settings/Billing';
import BillingOSS from './components/settings/BillingOSS';
import Profile from './components/settings/Profile';
import Security from './components/settings/Security';
import ServerDetails from './components/sftp/ServerDetails';
import ServerList from './components/sftp/ServerList';
import ServerProvision from './components/sftp/ServerProvision';
import WebClient from './components/sftp/WebClient';
import { features } from './config/features';
// Theme
import theme from './theme';

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

            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />

            <Route
              path="/api-test"
              element={
                <Layout>
                  <APITest />
                </Layout>
              }
            />

            <Route
              path="/servers"
              element={
                <Layout>
                  <ServerList />
                </Layout>
              }
            />

            <Route
              path="/servers/new"
              element={
                <Layout>
                  <ServerProvision />
                </Layout>
              }
            />

            <Route
              path="/servers/:id"
              element={
                <Layout>
                  <ServerDetails />
                </Layout>
              }
            />

            <Route
              path="/web-client/:id"
              element={
                <Layout>
                  <WebClient />
                </Layout>
              }
            />

            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />

            <Route
              path="/security"
              element={
                <Layout>
                  <Security />
                </Layout>
              }
            />

            <Route
              path="/billing"
              element={<Layout>{features.billing ? <Billing /> : <BillingOSS />}</Layout>}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

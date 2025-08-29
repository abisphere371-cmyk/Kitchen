import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginForm from './components/LoginForm'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Kitchen from './pages/Kitchen'
import Orders from './pages/Orders'
import Staff from './pages/Staff'
import Delivery from './pages/Delivery'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route 
              path="inventory" 
              element={
                <ProtectedRoute requiredRole={['admin', 'inventory_manager']}>
                  <Inventory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="kitchen" 
              element={
                <ProtectedRoute requiredRole={['admin', 'kitchen_staff']}>
                  <Kitchen />
                </ProtectedRoute>
              } 
            />
            <Route path="orders" element={<Orders />} />
            <Route 
              path="staff" 
              element={
                <ProtectedRoute requiredRole={['admin']}>
                  <Staff />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="delivery" 
              element={
                <ProtectedRoute requiredRole={['admin', 'delivery_staff']}>
                  <Delivery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="reports" 
              element={
                <ProtectedRoute requiredRole={['admin', 'inventory_manager']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
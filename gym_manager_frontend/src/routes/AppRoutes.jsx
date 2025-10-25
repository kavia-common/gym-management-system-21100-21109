import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleGuard from '../components/auth/RoleGuard';

// Lazy-loaded page components
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const OwnerDashboard = lazy(() => import('../pages/owner/Dashboard'));
const TrainerDashboard = lazy(() => import('../pages/trainer/Dashboard'));
const MemberDashboard = lazy(() => import('../pages/member/Dashboard'));

// PUBLIC_INTERFACE
export default function AppRoutes() {
  /**
   * This component defines the top-level route tree for the application.
   * Routes:
   * - /               -> Redirects to /login
   * - /login          -> Public login page
   * - /register       -> Public registration page
   * - /owner/*        -> Owner portal (protected, only owner role)
   * - /trainer/*      -> Trainer portal (protected, only trainer role)
   * - /member/*       -> Member portal (protected, only member role)
   */
  return (
    <Suspense fallback={<div className="container" style={{ padding: 24 }}>Loading...</div>}>
      <Routes>
        {/* Public routes within AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected portals inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route
            path="/owner"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['owner']}>
                  <OwnerDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['trainer']}>
                  <TrainerDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['member']}>
                  <MemberDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

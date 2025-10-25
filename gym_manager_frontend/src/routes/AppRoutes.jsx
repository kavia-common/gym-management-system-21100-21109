import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

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
   * - /               -> Redirects to /login for now (no auth implemented yet)
   * - /login          -> Public login page
   * - /register       -> Public registration page
   * - /owner/*        -> Owner portal routes inside MainLayout
   * - /trainer/*      -> Trainer portal routes inside MainLayout
   * - /member/*       -> Member portal routes inside MainLayout
   *
   * When auth is added, guards can be introduced to protect the portal routes.
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

        {/* Protected portals inside MainLayout (guards to be added later) */}
        <Route element={<MainLayout />}>
          <Route path="/owner">
            <Route index element={<OwnerDashboard />} />
            {/* Future owner routes go here, e.g., <Route path="members" element={<OwnerMembers />} /> */}
          </Route>

          <Route path="/trainer">
            <Route index element={<TrainerDashboard />} />
            {/* Future trainer routes go here */}
          </Route>

          <Route path="/member">
            <Route index element={<MemberDashboard />} />
            {/* Future member routes go here */}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

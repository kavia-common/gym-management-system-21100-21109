import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleGuard from '../components/auth/RoleGuard';

// Marketing Home page (non-lazy to ensure immediate load for landing)
import Home from '../pages/marketing/Home';

// Lazy-loaded page components
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// New auth utility pages
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.tsx'));
const ResetPassword = lazy(() => import('../pages/ResetPassword.tsx'));

// Existing portals
const OwnerDashboard = lazy(() => import('../pages/owner/Dashboard'));
const OwnerMembers = lazy(() => import('../pages/owner/Members'));
const OwnerClasses = lazy(() => import('../pages/owner/Classes'));
const OwnerTrainers = lazy(() => import('../pages/owner/Trainers'));
const OwnerPayments = lazy(() => import('../pages/owner/Payments'));
const OwnerAnalytics = lazy(() => import('../pages/owner/Analytics'));

const TrainerDashboard = lazy(() => import('../pages/trainer/Dashboard'));
const TrainerTimetable = lazy(() => import('../pages/trainer/Timetable'));
const TrainerClients = lazy(() => import('../pages/trainer/Clients'));
const TrainerPrograms = lazy(() => import('../pages/trainer/Programs'));

const MemberDashboard = lazy(() => import('../pages/member/Dashboard'));
const MemberBookings = lazy(() => import('../pages/member/Bookings'));
const MemberClasses = lazy(() => import('../pages/member/Classes'));
const MemberProfile = lazy(() => import('../pages/member/Profile'));

// PUBLIC_INTERFACE
export default function AppRoutes() {
  /**
   * Route tree with public marketing page and nested role portals.
   * Adds forgot/reset password routes.
   */
  return (
    <Suspense fallback={<div className="container" style={{ padding: 24 }}>Loading...</div>}>
      <Routes>
        {/* Public Marketing Route */}
        <Route path="/" element={<Home />} />

        {/* Public routes within AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected portals inside MainLayout */}
        <Route element={<MainLayout />}>
          {/* Owner */}
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
            path="/owner/members"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['owner']}>
                  <OwnerMembers />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/classes"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['owner']}>
                  <OwnerClasses />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/trainers"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['owner']}>
                  <OwnerTrainers />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/payments"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['owner']}>
                  <OwnerPayments />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/analytics"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['owner']}>
                  <OwnerAnalytics />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Trainer */}
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
            path="/trainer/timetable"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['trainer']}>
                  <TrainerTimetable />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/clients"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['trainer']}>
                  <TrainerClients />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/programs"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['trainer']}>
                  <TrainerPrograms />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Member */}
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
          <Route
            path="/member/bookings"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['member']}>
                  <MemberBookings />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/classes"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['member']}>
                  <MemberClasses />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/member/profile"
            element={
              <ProtectedRoute>
                <RoleGuard allow={['member']}>
                  <MemberProfile />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

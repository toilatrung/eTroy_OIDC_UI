import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailResultPage from '../pages/auth/VerifyEmailResultPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import AccountErrorPage from '../pages/auth/AccountErrorPage';
import PlatformSupportPage from '../pages/auth/PlatformSupportPage';
import ConsentPage from '../pages/auth/ConsentPage';

import RegistrationSuccessPage from '../pages/auth/RegistrationSuccessPage';
import ResendVerificationPage from '../pages/auth/ResendVerificationPage';
import ProfilePage from '../pages/user/ProfilePage';
import AdminLayout from '../shared/layouts/AdminLayout';
import AdminGuard from '../shared/components/AdminGuard';
import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminClientsPage from '../pages/admin/AdminClientsPage';
import AdminSessionsPage from '../pages/admin/AdminSessionsPage';
import AdminAuditPage from '../pages/admin/AdminAuditPage';
import AdminObservabilityPage from '../pages/admin/AdminObservabilityPage';
import AdminKeysPage from '../pages/admin/AdminKeysPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/oidc/login',
    element: <LoginPage />,
  },
  {
    path: '/consent',
    element: <ConsentPage />,
  },
  {
    path: '/oidc/consent',
    element: <ConsentPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/register/success',
    element: <RegistrationSuccessPage />,
  },
  {
    path: '/resend-verification',
    element: <ResendVerificationPage />,
  },
  {
    path: '/verify-email/result',
    element: <VerifyEmailResultPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/account/error',
    element: <AccountErrorPage />,
  },
  {
    path: '/support',
    element: <PlatformSupportPage />,
  },
  {
    path: '/',
    element: <ProfilePage />,
  },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      {
        path: '',
        element: <AdminOverviewPage />,
      },
      {
        path: 'overview',
        element: <AdminOverviewPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'clients',
        element: <AdminClientsPage />,
      },
      {
        path: 'sessions',
        element: <AdminSessionsPage />,
      },
      {
        path: 'audit',
        element: <AdminAuditPage />,
      },
      {
        path: 'observability',
        element: <AdminObservabilityPage />,
      },
      {
        path: 'keys',
        element: <AdminKeysPage />,
      },
    ],
  },
]);

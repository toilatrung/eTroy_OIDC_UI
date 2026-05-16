import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import Alert from '../../shared/components/Alert';
import LoadingState from '../../shared/components/LoadingState';
import ConfirmationModal from '../../shared/components/ConfirmationModal';
import ChangePasswordModal from '../../shared/components/ChangePasswordModal';
import { userApi } from '../../features/user/user.api';
import type { ConnectedApplication, UserProfile } from '../../features/user/user.types';
import { authApi } from '../../features/auth/auth.api';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [connectedApplications, setConnectedApplications] = React.useState<ConnectedApplication[]>([]);
  const [isLoadingConnectedApplications, setIsLoadingConnectedApplications] = React.useState(true);
  const [revokingClientId, setRevokingClientId] = React.useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const isUnauthorizedError = (err: unknown) =>
    axios.isAxiosError(err) && err.response?.status === 401;

  async function fetchProfile() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userApi.getMe();
      setProfile(data);
      setDisplayName(data.name || '');
      setAvatarUrl(data.avatar_url || '');
    } catch (err: unknown) {
      if (isUnauthorizedError(err)) {
        navigate('/login');
        return;
      }
      setError('We could not load your profile right now. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload: Partial<Pick<UserProfile, 'name' | 'avatar_url'>> = {};
      if (displayName !== profile?.name) payload.name = displayName;
      if (avatarUrl !== profile?.avatar_url) payload.avatar_url = avatarUrl;

      if (Object.keys(payload).length === 0) {
        setSuccessMessage('No changes to save.');
        setIsSaving(false);
        return;
      }

      await userApi.updateProfile(payload);
      setSuccessMessage('Profile updated.');
      // Update local baseline
      if (profile) {
        setProfile({ ...profile, ...payload });
      }
    } catch {
      setError('We could not update your profile right now. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await userApi.signOutFromAllSessions();
      await authApi.logout();
      navigate('/login');
    } catch {
      setError('Logout failed. Please try again.');
    }
  };

  async function fetchConnectedApplications() {
    setIsLoadingConnectedApplications(true);

    try {
      const apps = await userApi.getConnectedApplications();
      setConnectedApplications(apps);
    } catch (err: unknown) {
      if (isUnauthorizedError(err)) {
        navigate('/login');
        return;
      }

      setError('We could not load connected applications right now.');
    } finally {
      setIsLoadingConnectedApplications(false);
    }
  }

  const handleRevokeApplication = async (clientId: string) => {
    setRevokingClientId(clientId);
    setError(null);
    setSuccessMessage(null);

    try {
      await userApi.revokeConnectedApplication(clientId);
      setConnectedApplications((apps) => apps.filter((app) => app.clientId !== clientId));
      setSuccessMessage('Application access revoked.');
    } catch (err: unknown) {
      if (isUnauthorizedError(err)) {
        navigate('/login');
        return;
      }

      setError('We could not revoke this application. Please try again.');
    } finally {
      setRevokingClientId(null);
    }
  };

  React.useEffect(() => {
    const loadInitialData = async () => {
      await Promise.resolve();
      await Promise.all([fetchProfile(), fetchConnectedApplications()]);
    };

    void loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (value?: string) => {
    if (!value) return 'Not available';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Not available';
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Alert type="error" message={error || 'Profile not available.'} />
        <Button onClick={fetchProfile} variant="outline" style={{ marginTop: '1rem' }}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#000000', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
          User Profile
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
          Manage your personal information and security settings.
        </p>
      </header>

      <div style={{ marginBottom: '1.5rem' }}>
        {error && <Alert type="error" message={error} />}
        {successMessage && <Alert type="success" message={successMessage} title="Profile Updated" />}
      </div>

      {/* Identity Card */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '1px solid var(--color-border)'
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', margin: 0 }}>
              {profile.name || 'Anonymous User'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              {profile.status === 'active' ? 'Platform Account' : 'Limited Account'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSaving}
            placeholder="Your full name"
          />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#000000' }}>
                Email Address
              </label>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '0.25rem 0.5rem', 
                borderRadius: '9999px',
                backgroundColor: profile.email_verified ? '#dcfce7' : '#fee2e2',
                color: profile.email_verified ? '#166534' : '#991b1b',
                textTransform: 'uppercase'
              }}>
                {profile.email_verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <Input
              value={profile.email}
              readOnly
              style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed', color: '#6b7280' }}
            />
          </div>

          <Input
            label="Profile Picture URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            disabled={isSaving}
            placeholder="https://example.com/photo.jpg"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Subject (sub)"
              value={profile.sub}
              readOnly
              style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed', color: '#6b7280', fontSize: '0.75rem' }}
            />
            <Input
              label="Account Status"
              value={profile.status.toUpperCase()}
              readOnly
              style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed', color: '#6b7280' }}
            />
          </div>

          <Button 
            onClick={handleSaveProfile} 
            isLoading={isSaving} 
            style={{ marginTop: '0.5rem', backgroundColor: '#000000' }}
          >
            Save profile changes
          </Button>
        </div>
      </section>

      {/* Security Actions */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {profile.isAdmin && (
          <Button 
            onClick={() => navigate('/admin/overview')}
            style={{ 
              justifyContent: 'center', 
              fontWeight: 700, 
              backgroundColor: '#111827', 
              color: '#ffffff',
              border: 'none'
            }}
          >
            <ShieldCheck size={18} style={{ marginRight: '0.75rem' }} />
            Admin Dashboard
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => setIsPasswordModalOpen(true)}
          style={{ justifyContent: 'center', fontWeight: 700, color: '#000000', borderColor: 'var(--color-border)' }}
        >
          Change Password
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setIsLogoutModalOpen(true)}
          style={{ justifyContent: 'center', fontWeight: 700, color: '#dc2626', borderColor: '#fee2e2' }}
        >
          Sign out from all sessions
        </Button>
      </section>

      {/* Connected Applications */}
      <section style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '2rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000000', marginBottom: '1rem' }}>
          Connected Applications
        </h3>
        {isLoadingConnectedApplications ? (
          <LoadingState />
        ) : connectedApplications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {connectedApplications.map((app) => (
              <article
                key={app.clientId}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', marginBottom: '0.25rem' }}>
                      {app.clientName || app.clientId}
                    </h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', margin: 0 }}>
                      Client ID: {app.clientId}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => void handleRevokeApplication(app.clientId)}
                    isLoading={revokingClientId === app.clientId}
                    disabled={revokingClientId !== null}
                    style={{
                      width: 'auto',
                      padding: '0.625rem 0.875rem',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      flexShrink: 0
                    }}
                  >
                    Disconnect
                  </Button>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    Granted scopes
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {app.scopes.length > 0 ? app.scopes.map((scope) => (
                      <span
                        key={scope}
                        style={{
                          backgroundColor: '#f3f4f6',
                          border: '1px solid var(--color-border)',
                          borderRadius: '9999px',
                          color: '#111827',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.625rem'
                        }}
                      >
                        {scope}
                      </span>
                    )) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                        No scopes reported.
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  Granted: {formatDate(app.grantedAt)}
                  {app.lastUsedAt && <> - Last used: {formatDate(app.lastUsedAt)}</>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            backgroundColor: '#f9fafb',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            border: '1px dashed var(--color-border)'
          }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
              No connected applications yet.
            </p>
          </div>
        )}
      </section>

      {/* Modals */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={setSuccessMessage}
      />
      
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutAll}
        title="Sign out from all sessions?"
        body="This will end your active sessions across this browser and other devices. You will need to sign in again to access eTroy Platform services."
        confirmLabel="Sign out from all sessions"
        variant="danger"
      />
    </div>
  );
};

export default ProfilePage;

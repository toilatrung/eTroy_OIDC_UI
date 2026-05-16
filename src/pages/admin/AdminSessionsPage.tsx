import React, { useEffect, useState } from 'react';
import { adminApi } from '../../features/admin/admin.api';
import { Shield, Clock, XCircle, AlertCircle } from 'lucide-react';

const AdminSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listSessions();
      setSessions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load active sessions. Verify management services are online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="admin-sessions">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>Sessions & Tokens</h1>
        <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>Monitor and manage active digital identities and access tokens.</p>
      </header>

      {error ? (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error-border)', display: 'flex', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
        </div>
      ) : loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Retrieving active sessions...</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Identity Session</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Connected Apps</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Last Activity</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700, textAlign: 'right' }}>Controls</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.sessionId} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        backgroundColor: 'var(--color-bg-subtle)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)'
                      }}>
                        <Shield size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9375rem' }}>{session.subject}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>ID: {session.sessionId.slice(0, 12)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {session.clientIds.map((cid: string) => (
                        <span key={cid} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>{cid}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '100px',
                      color: session.status === 'active' ? 'var(--color-success-strong)' : 'var(--color-error-strong)',
                      backgroundColor: session.status === 'active' ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                      textTransform: 'uppercase'
                    }}>
                      {session.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Clock size={14} style={{ color: 'var(--color-text-subtle)' }} />
                      {new Date(session.lastSeenAt).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <button 
                      disabled
                      title="Terminate Session"
                      style={{ 
                        padding: '0.5rem', 
                        borderRadius: '4px', 
                        border: '1px solid var(--color-border)', 
                        backgroundColor: 'transparent',
                        color: 'var(--color-error)',
                        cursor: 'not-allowed',
                        opacity: 0.5
                      }}
                    >
                      <XCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
                    No active digital sessions detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSessionsPage;

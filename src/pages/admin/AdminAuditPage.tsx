import React, { useEffect, useState } from 'react';
import { adminApi } from '../../features/admin/admin.api';
import { Activity, AlertCircle, Clock, User, HardDrive } from 'lucide-react';

const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listAuditLogs();
      setLogs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load audit logs. Ensure management services are online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return { color: 'var(--color-error)', bg: 'var(--color-error-bg)' };
      case 'warning': return { color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' };
      case 'info': return { color: 'var(--color-info)', bg: 'var(--color-info-bg)' };
      default: return { color: 'var(--color-text-subtle)', bg: 'var(--color-bg-subtle)' };
    }
  };

  return (
    <div className="admin-audit">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>Audit Logs</h1>
        <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>Review historical security events and administrative actions.</p>
      </header>

      {error ? (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error-border)', display: 'flex', gap: '0.75rem' }}>
          <AlertCircle size={20} />
          <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
        </div>
      ) : loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Retrieving event history...</p>
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
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Event & Time</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Actor</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Subject</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Severity</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700 }}>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ color: 'var(--color-text-muted)' }}><Activity size={18} /></div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9375rem' }}>{log.eventType}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} />
                          {new Date(log.occurredAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <User size={14} style={{ color: 'var(--color-text-subtle)' }} />
                      <span style={{ color: 'var(--color-text-main)' }}>{log.actor?.adminSub || log.actor?.sub || log.actor?.type}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <HardDrive size={14} style={{ color: 'var(--color-text-subtle)' }} />
                      <span style={{ color: 'var(--color-text-subtle)' }}>{log.subject?.type}: {log.subject?.sub || log.subject?.clientId || 'N/A'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      backgroundColor: getSeverityStyle(log.severity).bg,
                      color: getSeverityStyle(log.severity).color,
                      textTransform: 'uppercase'
                    }}>
                      {log.severity}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: log.outcome === 'success' ? 'var(--color-success)' : 'var(--color-error)' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', textTransform: 'capitalize' }}>{log.outcome}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
                    No security events recorded in the audit pipeline.
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

export default AdminAuditPage;

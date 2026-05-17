import React, { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../features/admin/admin.api';
import type { AdminClientView } from '../../features/admin/admin.types';
import { Plus, Copy, AlertTriangle, RotateCw } from 'lucide-react';

const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<AdminClientView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClientData, setNewClientData] = useState({ name: '', redirectUris: '' });
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.listClients();
      setClients(data);
      setError(null);
    } catch {
      setError('Failed to load OIDC clients. Verify admin permissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchClients);
  }, [fetchClients]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await adminApi.createClient({
        name: newClientData.name,
        redirectUris: newClientData.redirectUris.split(',').map(s => s.trim()).filter(Boolean),
      });
      setCreatedSecret(result.clientSecret);
      void fetchClients();
    } catch {
      alert('Failed to create client. Verify client name and redirect URIs.');
    }
  };

  const handleRotateSecret = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to rotate this client secret? The old secret will stop working immediately.')) return;
    try {
      const result = await adminApi.rotateClientSecret(clientId);
      setCreatedSecret(result.clientSecret);
      setShowCreateModal(true);
      void fetchClients();
    } catch {
      alert('Failed to rotate secret.');
    }
  };

  const handleToggleClientStatus = async (clientId: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'disable' : 'enable';
    if (!window.confirm(`Are you sure you want to ${action} this client?`)) return;
    
    try {
      if (currentStatus === 'active') {
        await adminApi.disableClient(clientId);
      } else {
        await adminApi.enableClient(clientId);
      }
      void fetchClients();
    } catch {
      alert('Failed to update client status.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="admin-clients">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>Client Management</h1>
          <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>Register and configure OIDC relying parties.</p>
        </div>
        <button 
          onClick={() => {
            setNewClientData({ name: '', redirectUris: '' });
            setCreatedSecret(null);
            setShowCreateModal(true);
          }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1.25rem', 
            backgroundColor: 'var(--color-primary)', 
            color: 'white', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Register Client
        </button>
      </header>

      {error ? (
        <div style={{ padding: '2rem', backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertTriangle size={24} />
          <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner">Loading...</div>
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
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Client Identity</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Redirect URIs</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', textAlign: 'right' }}>Controls</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.clientId} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{client.name || 'Unnamed Client'}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace', marginTop: '0.25rem' }}>{client.clientId}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {client.redirectUris.map(uri => (
                        <span key={uri} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>{uri}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                      <button 
                        onClick={() => handleRotateSecret(client.clientId)}
                        title="Secret Rotation" 
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', marginRight: '0.5rem' }}
                      >
                        <RotateCw size={16} />
                      </button>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: client.status === 'active' ? 'var(--color-success)' : 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        {client.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={client.status === 'active'}
                          onChange={() => handleToggleClientStatus(client.clientId, client.status)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>No OIDC clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Register New Client</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            {!createdSecret ? (
              <form onSubmit={handleCreateClient} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Client Name</label>
                  <input 
                    required 
                    value={newClientData.name} 
                    onChange={e => setNewClientData({...newClientData, name: e.target.value})}
                    placeholder="e.g. eTroy One Client Application"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Redirect URIs (comma separated)</label>
                  <input 
                    required 
                    value={newClientData.redirectUris} 
                    onChange={e => setNewClientData({...newClientData, redirectUris: e.target.value})}
                    placeholder="http://localhost:3000/callback" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} 
                  />
                </div>
                <button type="submit" style={{ marginTop: '0.5rem', padding: '0.875rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>Create Client</button>
              </form>
            ) : (
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '1rem' }}>
                  <AlertTriangle style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-warning)', fontSize: '0.9375rem', fontWeight: 700 }}>Save this client secret!</h4>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-warning)', lineHeight: 1.5 }}>
                      For security, this secret will only be shown <strong>once</strong>. If lost, you must rotate it to generate a new one.
                    </p>
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Client Secret</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      backgroundColor: 'var(--color-bg-subtle)', 
                      borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--color-border)',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all'
                    }}>
                      {createdSecret}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(createdSecret)}
                      style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'white', cursor: 'pointer' }}
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '0.875rem', backgroundColor: 'var(--color-text-main)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}
                >
                  I have saved the secret
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;

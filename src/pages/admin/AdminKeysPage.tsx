import React, { useEffect, useState } from 'react';
import { adminApi } from '../../features/admin/admin.api';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

const AdminKeysPage: React.FC = () => {
  const [jwks, setJwks] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const data = await adminApi.getJwks();
        setJwks(data);
      } catch (error) {
        console.error('Failed to fetch JWKS');
      } finally {
        setLoading(false);
      }
    };
    fetchKeys();
  }, []);

  return (
    <div className="admin-keys">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>Key Management</h1>
        <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>Monitor and rotate OIDC signing keys (JWKS).</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--color-success)" />
            Active Signing Keys
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
            {loading ? '...' : jwks?.keys?.length || 0}
          </div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-subtle)' }}>
            Total public keys currently published in JWKS.
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <button disabled style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.75rem', 
            padding: '1rem', 
            backgroundColor: 'var(--color-bg-subtle)', 
            color: 'var(--color-text-main)', 
            border: '1px solid var(--color-border)', 
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            cursor: 'not-allowed',
            opacity: 0.7
          }}>
            <RefreshCw size={18} />
            Rotate Signing Key
          </button>
          <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'center' }}>
            Manual key rotation is not available yet.
          </p>
        </div>
      </div>

      <section>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>Public Key Set (JWKS)</h3>
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)',
          fontFamily: 'monospace',
          fontSize: '0.8125rem',
          color: 'var(--color-text-subtle)',
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
          maxHeight: '400px'
        }}>
          {loading ? 'Fetching public key material...' : JSON.stringify(jwks, null, 2)}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.8125rem', fontWeight: 600 }}>
          <CheckCircle2 size={14} />
          <span>No private key material is exposed in this view.</span>
        </div>
      </section>
    </div>
  );
};

export default AdminKeysPage;

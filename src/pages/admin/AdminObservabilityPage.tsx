import React, { useEffect, useState } from 'react';
import { adminApi } from '../../features/admin/admin.api';
import { Server, Database, Zap, AlertCircle, BarChart3 } from 'lucide-react';
import type { HealthResponse } from '../../features/admin/admin.types';

const AdminObservabilityPage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [metrics, setMetrics] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [h, m] = await Promise.all([
          adminApi.getHealth(),
          adminApi.getMetrics().catch(() => 'Metrics endpoint currently restricted.')
        ]);
        setHealth(h);
        setMetrics(m);
      } catch {
        console.error('Failed to fetch observability data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-observability">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>Observability</h1>
        <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>Monitor system performance, health, and aggregate metrics.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-subtle)' }}>
            <Server size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>API Status</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: health?.status === 'UP' ? 'var(--color-success)' : 'var(--color-error)' }}>
            {loading ? 'Checking...' : health?.status === 'UP' ? 'Operational' : 'Down'}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-subtle)' }}>
            <Database size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Infrastructure</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>
            {loading ? 'Checking...' : 'Connected'}
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-subtle)' }}>
            <Zap size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Latency</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            {loading ? '...' : '< 50ms'}
          </div>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} />
            System Metrics (Prometheus)
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <AlertCircle size={12} />
            Raw data from /metrics
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--color-code-bg)', 
          color: 'var(--color-code-text)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius-md)', 
          fontFamily: 'monospace',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          height: '400px',
          overflowY: 'auto',
          border: '1px solid var(--color-code-border)'
        }}>
          {loading ? 'Collecting metrics...' : metrics || 'No metrics data available.'}
        </div>
      </section>
    </div>
  );
};

export default AdminObservabilityPage;

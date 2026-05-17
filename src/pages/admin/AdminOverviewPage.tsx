import React, { useEffect, useState } from 'react';
import { adminApi } from '../../features/admin/admin.api';
import { Activity, ShieldCheck, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  chipBg: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, chipBg, description }) => (
    <div style={{ 
      backgroundColor: 'var(--color-surface)', 
      padding: '1.5rem', 
      borderRadius: 'var(--radius-md)', 
      border: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-subtle)', fontWeight: 500 }}>{title}</p>
          <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{value}</h2>
        </div>
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: chipBg, 
          color: color, 
          borderRadius: 'var(--radius-sm)' 
        }}>
          <Icon size={24} />
        </div>
      </div>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-subtle)' }}>{description}</p>
    </div>
  );

const AdminOverviewPage: React.FC = () => {
  const [stats, setStats] = useState({
    health: 'loading',
    readiness: 'loading',
    clients: 'loading',
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const health = await adminApi.getHealth();
        const readiness = await adminApi.getReadiness();
        const clients = await adminApi.listClients();

        setStats({
          health: health.status === 'UP' ? 'healthy' : 'degraded',
          readiness: readiness.status === 'READY' ? 'ready' : 'not-ready',
          clients: clients.length.toString(),
        });
      } catch {
        setStats(prev => ({ ...prev, health: 'error', readiness: 'error' }));
      }
    };

    void fetchStatus();
  }, []);

  return (
    <div className="admin-overview">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>Operational status of the eTroy OIDC identity layer.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          title="System Health" 
          value={stats.health === 'loading' ? 'Checking...' : stats.health === 'healthy' ? 'Healthy' : 'Degraded'}
          icon={Activity} 
          color={stats.health === 'healthy' ? 'var(--color-success)' : 'var(--color-warning)'}
          chipBg={stats.health === 'healthy' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)'}
          description="Global status of backend services and database connectivity."
        />
        <StatCard 
          title="OIDC Readiness" 
          value={stats.readiness === 'loading' ? 'Checking...' : stats.readiness === 'ready' ? 'Ready' : 'Issues'}
          icon={ShieldCheck} 
          color={stats.readiness === 'ready' ? 'var(--color-success)' : 'var(--color-error)'}
          chipBg={stats.readiness === 'ready' ? 'var(--color-success-bg)' : 'var(--color-error-bg)'}
          description="Availability of OIDC provider endpoints and key material."
        />
        <StatCard 
          title="Managed Clients" 
          value={stats.clients === 'loading' ? '...' : stats.clients}
          icon={Settings} 
          color="var(--color-primary)"
          chipBg="var(--color-primary-soft)"
          description="Total number of registered OIDC clients in the system."
        />
      </div>

      <section style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} />
          Operational Summary
        </h3>
        
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 600 }}>Service</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 600 }}>Endpoint</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Backend API</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>/health</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                    <CheckCircle2 size={16} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>ONLINE</span>
                  </div>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>OIDC Discovery</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>/jwks</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                    <CheckCircle2 size={16} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>ACTIVE</span>
                  </div>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Audit Pipeline</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>Internal</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-subtle)' }}>
                    <AlertCircle size={16} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>MONITORED</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminOverviewPage;

import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import '../styles/global.css';

const App: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [pathname, setPathname] = useState(router.state.location.pathname);

  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      setPathname(state.location.pathname);
      setIsHelpOpen(false);
    });

    return unsubscribe;
  }, []);

  const toggleHelp = () => setIsHelpOpen(!isHelpOpen);

  const handleHelpItemClick = (path: string) => {
    router.navigate(path);
    setIsHelpOpen(false);
  };

  const isProfile = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');
  
  return (
    <div className={`app-shell ${isAdmin ? 'admin-mode' : ''}`} onClick={() => isHelpOpen && setIsHelpOpen(false)}>
      {!isAdmin && (
        <aside className="auth-side-brand">
          <div className="auth-side-brand-inner">
            <div className="auth-side-brand-copy">
              <h1 className="auth-side-brand-title" style={{ fontWeight: 800, color: '#ffffff' }}>
                {isProfile ? 'Identity Management. Platform Access.' : 'Secure Platform Identity.'}
              </h1>
              <p className="auth-side-brand-description" style={{ opacity: 0.9, fontWeight: 500, color: '#ffffff' }}>
                {isProfile 
                  ? 'Access eTroy Platform services with centralized identity and secure sign-in.' 
                  : 'Use one identity across eTroy ecosystem clients through the eTroy OIDC provider.'}
              </p>
            </div>
            
            <div className="auth-side-brand-logo">
              <img 
                src="/etroy-collaboration-troy-logo.svg" 
                alt="eTroy Platform" 
                className="auth-side-brand-logo-image"
              />
            </div>
          </div>
        </aside>
      )}

      <div className="auth-side-content">
        {!isAdmin && (
          <header style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            padding: '1.5rem',
            gap: '1.25rem',
            position: 'relative'
          }}>
            <div className="help-menu-container">
              {/* ... existing help menu svg ... */}
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={isHelpOpen ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ cursor: 'pointer' }}
                aria-label="Help and Support"
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHelp();
                }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>

              {isHelpOpen && (
                <div className="help-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="help-dropdown-header">Support & Help</div>
                  <div className="help-dropdown-item" onClick={() => handleHelpItemClick('/resend-verification')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Need a verification link?
                  </div>
                  <div className="help-dropdown-item" onClick={() => handleHelpItemClick('/forgot-password')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Forgot your password?
                  </div>
                  <div className="help-dropdown-item" onClick={() => handleHelpItemClick('/support')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    eTroy Platform Support
                  </div>
                </div>
              )}
            </div>
          </header>
        )}

        <main className={isAdmin ? 'admin-content-area' : 'main-content'}>
          <RouterProvider router={router} />
        </main>

        {!isAdmin && (
          <footer style={{ 
            marginTop: 'auto',
            padding: '2rem', 
            textAlign: 'center', 
            fontSize: '0.8125rem', 
            color: 'var(--color-text-muted)',
            lineHeight: 1.5
          }}>
            &copy; eTroy OIDC &middot; Identity services for eTroy Platform <br />
            Collaboration. All rights reserved.
          </footer>
        )}
      </div>
    </div>
  );
};

export default App;

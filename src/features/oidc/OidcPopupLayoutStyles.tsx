const OidcPopupLayoutStyles = () => (
  <style>
    {`
      @media (max-width: 767px) {
        .app-shell:has(.oidc-popup-flow) {
          min-height: 100vh;
          overflow: auto;
        }

        .app-shell:has(.oidc-popup-flow) .auth-side-brand {
          display: none;
        }

        .app-shell:not(.admin-mode):has(.oidc-popup-flow) .auth-side-content {
          width: 100%;
          min-height: 100vh;
          height: auto;
          margin-left: 0;
          padding: 1rem;
          overflow-y: visible;
        }

        .app-shell:has(.oidc-popup-flow) .auth-side-content > header {
          padding: 0.5rem 0.5rem 0;
        }

        .app-shell:has(.oidc-popup-flow) .main-content {
          align-items: flex-start;
          max-width: 100%;
          margin: 1rem auto;
        }

        .app-shell:has(.oidc-popup-flow) footer {
          padding: 1rem 0.5rem;
        }

        .oidc-popup-flow {
          max-width: min(100%, 520px) !important;
        }
      }

      @media (max-width: 420px) {
        .app-shell:has(.oidc-popup-flow) .auth-side-content {
          padding: 0.75rem;
        }

        .oidc-consent-actions {
          grid-template-columns: 1fr !important;
        }
      }
    `}
  </style>
);

export default OidcPopupLayoutStyles;

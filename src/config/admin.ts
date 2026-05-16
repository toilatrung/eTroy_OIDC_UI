/**
 * Administrative Access Configuration
 * 
 * Defines the criteria for granting administrative privileges within the OIDC platform.
 * In production, this would be determined by JWT claims (e.g., 'roles') or identity provider scopes.
 */

export const ADMIN_CONFIG = {
  // List of emails authorized for platform management
  authorizedEmails: [
    'abc@troy.edu',
    'admin@troy.edu',
    'system@troy.edu'
  ],
  
  // Function to check if a user profile should be granted admin status
  checkAdminAccess: (email: string): boolean => {
    return ADMIN_CONFIG.authorizedEmails.includes(email.toLowerCase());
  }
};

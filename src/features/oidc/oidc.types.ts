export interface OidcInteractionContext {
  interactionId: string;
  clientId?: string;
  clientName?: string;
  scopes: string[];
  redirectUrl?: string;
  requiresConsent: boolean;
  status?: string;
}

export interface OidcDecisionResponse {
  redirectUrl: string;
}

export interface OidcErrorState {
  message: string;
  redirectUrl?: string;
}

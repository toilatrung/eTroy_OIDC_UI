import axios from 'axios';
import apiClient from '../../shared/api/apiClient';
import type { OidcDecisionResponse, OidcErrorState, OidcInteractionContext } from './oidc.types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const unwrapData = (value: unknown): unknown => {
  let current = value;
  let depth = 0;

  while (isRecord(current) && 'data' in current && depth < 2) {
    current = current.data;
    depth += 1;
  }

  return current;
};

const firstString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
};

const getNestedRecord = (value: UnknownRecord, key: string): UnknownRecord | undefined =>
  isRecord(value[key]) ? value[key] : undefined;

const normalizeScopes = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((scope): scope is string => typeof scope === 'string')
      .map((scope) => scope.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).map((scope) => scope.trim()).filter(Boolean);
  }

  return [];
};

const isConsentRequiredStatus = (value: string | undefined): boolean => {
  const normalized = value?.toLowerCase();

  return normalized === 'consent_required' || normalized === 'consent';
};

const getRedirectUrl = (value: unknown): string | undefined => {
  if (!isRecord(value)) return undefined;

  const error = getNestedRecord(value, 'error');

  return firstString(
    value.redirectUrl,
    value.redirect_url,
    error?.redirectUrl,
    error?.redirect_url,
  );
};

const normalizeInteraction = (raw: unknown, fallbackInteractionId: string): OidcInteractionContext => {
  const payload = unwrapData(raw);
  const source = isRecord(payload) ? payload : {};
  const client = getNestedRecord(source, 'client');
  const status = firstString(source.status, source.state, source.prompt);
  const redirectUrl = getRedirectUrl(source);
  const scopes = normalizeScopes(
    source.scopes ??
      source.requestedScopes ??
      source.requested_scopes ??
      source.scope ??
      source.requested_scope,
  );

  const requiresConsent =
    source.requiresConsent === true ||
    source.consentRequired === true ||
    source.consent_required === true ||
    isConsentRequiredStatus(status);

  return {
    interactionId: firstString(source.interactionId, source.interaction_id) ?? fallbackInteractionId,
    clientId: firstString(source.clientId, source.client_id, client?.clientId, client?.client_id, client?.id),
    clientName: firstString(source.clientName, source.client_name, client?.clientName, client?.client_name, client?.name),
    scopes,
    redirectUrl,
    requiresConsent,
    status,
  };
};

const normalizeDecision = (raw: unknown): OidcDecisionResponse => {
  const payload = unwrapData(raw);
  const redirectUrl = getRedirectUrl(payload);

  if (!redirectUrl) {
    throw new Error('OIDC_DECISION_MISSING_REDIRECT');
  }

  return { redirectUrl };
};

const getErrorCode = (value: unknown): string | undefined => {
  if (!isRecord(value)) return undefined;

  const error = getNestedRecord(value, 'error');

  return firstString(
    value.code,
    value.error,
    value.errorCode,
    error?.code,
    error?.error,
  );
};

const mapOidcErrorMessage = (code: string | undefined, status?: number): string => {
  const normalizedCode = code?.toLowerCase();

  if (status === 401 || normalizedCode === 'session_expired' || normalizedCode === 'unauthorized') {
    return 'Your session has expired. Please sign in again from the client application.';
  }

  switch (normalizedCode) {
    case 'interaction_expired':
    case 'expired_interaction':
    case 'invalid_interaction':
      return 'This authorization request has expired. Please restart sign-in from the client application.';
    case 'invalid_client':
      return 'The client application is not registered or is no longer allowed to sign in.';
    case 'invalid_redirect_uri':
      return 'The client application requested an invalid redirect URI.';
    case 'invalid_scope':
      return 'The client application requested permissions that are not available.';
    case 'access_denied':
      return 'Access was denied for this authorization request.';
    default:
      return 'We could not complete this authorization request. Please restart sign-in from the client application.';
  }
};

export const mapOidcError = (error: unknown): OidcErrorState => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const payload = unwrapData(responseData);
    const redirectUrl = getRedirectUrl(payload);
    const code = getErrorCode(payload);

    return {
      message: mapOidcErrorMessage(code, error.response?.status),
      redirectUrl,
    };
  }

  return {
    message: 'We could not complete this authorization request. Please restart sign-in from the client application.',
  };
};

export const oidcApi = {
  getInteraction: async (interactionId: string) => {
    const response = await apiClient.get('/authorize/interaction', {
      params: { interaction_id: interactionId },
    });

    return normalizeInteraction(response.data, interactionId);
  },

  submitDecision: async (interactionId: string, decision: 'approve' | 'deny') => {
    const response = await apiClient.post('/authorize/decision', {
      interaction_id: interactionId,
      decision,
    });

    return normalizeDecision(response.data);
  },
};

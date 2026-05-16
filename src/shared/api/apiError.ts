import axios from 'axios';

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export class ApiError extends Error {
  public code: string;
  public statusCode: number;

  constructor(
    code: string,
    message: string,
    statusCode: number
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const mapError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error) && error.response?.data?.error) {
    const { code, message } = (error.response.data as ApiErrorResponse).error;
    return new ApiError(code, message, error.response.status);
  }

  if (axios.isAxiosError(error) && error.request) {
    return new ApiError('NETWORK_ERROR', 'Unable to reach the server. Please check your connection.', 0);
  }

  return new ApiError('UNKNOWN_ERROR', 'An unexpected error occurred.', 500);
};

export const getSafeMessage = (error: ApiError): string => {
  // Map specific codes to user-friendly messages if needed
  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      return 'The email or password you entered is incorrect.';
    case 'USER_ALREADY_EXISTS':
      return 'An account with this email already exists.';
    case 'INVALID_INPUT':
      return error.message; // Backend usually provides specific field errors here
    default:
      return error.message;
  }
};

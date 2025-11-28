// API Response types matching backend structure

export interface ApiResponse<T> {
  data: T;
  resultInfo?: any;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

export interface ErrorResponse {
  isSuccess: false;
  isError: true;
  error: string;
  errorDetails?: any;
}

// Type guard to check if response is an error
export function isErrorResponse(response: any): response is ErrorResponse {
  return response.isError === true;
}

// Helper function to create success response (matches backend)
export function createApiResponse<T>(
  data: T | null = null,
  message = '',
  resultInfo: any = null,
): ApiResponse<T> {
  return {
    data: data as T,
    resultInfo,
    isSuccess: true,
    isError: false,
    message,
  };
}

// Helper function to create error response (matches backend)
export function createErrorResponse(
  error: string,
  errorDetails: any = null,
): ErrorResponse {
  return {
    isSuccess: false,
    isError: true,
    error,
    errorDetails,
  };
}

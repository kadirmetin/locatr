import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";

interface ApiErrorResponse {
  errorCode?: string;
  message?: string;
}

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (err instanceof Error) {
      if (isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else {
        errorMessage = err.message;
      }
    }

    setError(errorMessage);
    return errorMessage;
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}

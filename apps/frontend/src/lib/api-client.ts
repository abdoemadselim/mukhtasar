export interface ApiResponse<T = any> {
    data?: T;
    fieldErrors?: Record<string, { message: string }>;
    errors?: string[];
    message?: string;
}

export interface ApiError {
    root?: { message: string };
    [key: string]: any;
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
    body?: any;
    includeCredentials?: boolean;
    throwOnError?: boolean;
    cache?: RequestCache;
}

class ApiClient {
    private baseUrl: string;
    private defaultErrorMessage: string;

    constructor(
        baseUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/ui`,
        defaultErrorMessage: string = "حدث خطأ غير متوقع. حاول مرة أخرى."
    ) {
        this.baseUrl = baseUrl;
        this.defaultErrorMessage = defaultErrorMessage;
    }

    private async handleResponse<T>(response: Response, throwOnError: boolean = false): Promise<T | ApiError> {
        // Handle 500 errors
        if (response.status === 500) {
            const error = { root: { message: this.defaultErrorMessage } };
            if (throwOnError) throw new Error(this.defaultErrorMessage);
            return error;
        }

        let responseData: ApiResponse<T>;
        try {
            responseData = await response.json();
        } catch (jsonError) {
            const error = { root: { message: this.defaultErrorMessage } };
            if (throwOnError) throw new Error(this.defaultErrorMessage);
            return error;
        }

        if (!response.ok) {
            // Handle validation errors (field errors)
            if (responseData.fieldErrors) {
                if (throwOnError) {
                    const firstFieldError = Object.values(responseData.fieldErrors)[0];
                    throw new Error(firstFieldError?.message || this.defaultErrorMessage);
                }
                return responseData.fieldErrors;
            }

            // Handle single message errors
            if (responseData.message) {
                const error = { root: { message: responseData.message } };
                if (throwOnError) throw new Error(responseData.message);
                return error;
            }

            // Fallback error
            const error = { root: { message: this.defaultErrorMessage } };
            if (throwOnError) throw new Error(this.defaultErrorMessage);
            return error;
        }

        // Success case
        if (throwOnError && responseData.data) {
            return responseData.data;
        }
        return { data: responseData.data };
    }

    async request<T = any>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T | ApiError> {
        const {
            body,
            includeCredentials = false,
            throwOnError = false,
            headers = {},
            ...restOptions
        } = options;

        const url = `${this.baseUrl}${endpoint}`;

        const fetchOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            ...restOptions,
        };

        if (includeCredentials) {
            fetchOptions.credentials = 'include';
        }

        if (body) {
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);
        return this.handleResponse<T>(response, throwOnError);
    }

    // Convenience methods
    async get<T = any>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}): Promise<T | ApiError> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T = any>(endpoint: string, body?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T | ApiError> {
        return this.request<T>(endpoint, { ...options, method: 'POST', body });
    }

    async put<T = any>(endpoint: string, body?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T | ApiError> {
        return this.request<T>(endpoint, { ...options, method: 'PUT', body });
    }

    async patch<T = any>(endpoint: string, body?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}): Promise<T | ApiError> {
        return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
    }

    async delete<T = any>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}): Promise<T | ApiError> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

// Create a singleton instance
export const apiClient = new ApiClient();
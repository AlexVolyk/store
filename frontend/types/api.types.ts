export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions<TBody = unknown> = {
    path: string;
    params?: Record<string, string | number>;
    query?: Record<string, string | number | boolean | undefined>;
    body?: TBody;
    token?: string;
};

export type ApiResponse<T> = {
    message: string;
    data: T;
}

export type AuthResponse<T> = {
    message: string;
    data: T;
    token: string;
}

export type PaginatedResponse<T> = {
    message: string;
    data: T;
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
    }
}

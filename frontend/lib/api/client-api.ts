import { HttpMethod, RequestOptions } from "@/types/api.types";
import { api } from "./axios";

class ApiClient {

    private buildPath(
        path: string,
        params?: Record<string, string | number>,
    ): string {
        if (!params) {
            return path;
        }

        return Object.entries(params).reduce(
            (currentPath, [key, value]) =>
                currentPath.replace(`:${key}`, encodeURIComponent(String(value))),
            path,
        );
    }

    private async request<TResponse, TBody = unknown>(
        method: HttpMethod,
        {
            path,
            params,
            query,
            body,
            token,
        }: RequestOptions<TBody>,
    ): Promise<TResponse> {
        const url = this.buildPath(path, params);

        const response = await api.request<TResponse>({
            method,
            url,
            params: query,
            data: body,
            headers: token ?
                {
                    Authorization: `Bearer ${token}`,
                }
                : undefined,
        });

        return response.data;
    }

    get<TResponse>(options: RequestOptions) {
        return this.request<TResponse>("GET", options);
    }

    post<TResponse, TBody = unknown>(
        options: RequestOptions<TBody>,
    ) {
        return this.request<TResponse, TBody>("POST", options);
    }

    put<TResponse, TBody = unknown>(
        options: RequestOptions<TBody>,
    ) {
        return this.request<TResponse, TBody>("PUT", options);
    }

    patch<TResponse, TBody = unknown>(
        options: RequestOptions<TBody>,
    ) {
        return this.request<TResponse, TBody>("PATCH", options);
    }

    delete<TResponse>(options: RequestOptions) {
        return this.request<TResponse>("DELETE", options);
    }
}

export const apiClient = new ApiClient();


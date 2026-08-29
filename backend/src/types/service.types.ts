export type HttpStatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 500;

export type ServiceResult<T = unknown> =
    | {
          statusCode: number;
          message: string;
          data: T;
          token?: string;
      }
    | {
          statusCode: number;
          message: string;
          data?: undefined;
          token?: undefined;
      };

export type ServiceResultProduct<T = unknown> =
    | {
          statusCode: number;
          message: string;
          data: T;
          token?: string;
          pagination: {
              page: number;
              limit: number;
              total: number;
              totalPages: number;
          };
      }
    | {
          statusCode: number;
          message: string;
          data?: undefined;
          token?: undefined;
          pagination?: {
              page: number;
              limit: number;
              total: number;
              totalPages: number;
          };
      };

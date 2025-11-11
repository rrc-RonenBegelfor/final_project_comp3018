interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: { message: string; code?: string };
    timestamp?: string;
}

export const successResponse = <T>(
    data: T,
    message?: string
): ApiResponse<T> => ({
    status: "success",
    data,
    message,
    timestamp: new Date().toISOString(),
});

export const errorResponse = (
    message: string,
    code?: string
): ApiResponse<null> => ({
    status: "error",
    error: { message, code },
    timestamp: new Date().toISOString(),
});
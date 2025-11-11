interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: string;
    code?: string;
}

export const successResponse = <T>(
    data: T,
    message?: string
): ApiResponse<T> => ({
    status: "success",
    data,
    message,
});
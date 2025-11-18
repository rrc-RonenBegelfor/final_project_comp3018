import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../src/config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("Authentication Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            headers: {},
        };

        mockResponse = {
            locals: {},
        };

        nextFunction = jest.fn();
    });

    it("should throw AuthenticationError when no token is provided", async () => {
        // Act & Assert
        await authenticate(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it("should throw AuthenticationError when token is invalid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer invalidToken",
        };

        // Mock the Firebase auth response
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("error message")
        );

        // Act & Assert
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it("should call next() and set user data when token is valid", async () => {
        // Arrange
        const testToken = "test-token";
        mockRequest.headers = {
            authorization: `Bearer ${testToken}`,
        };

        const mockDecodedToken = {
            uid: "user123",
            role: "manager",
        };

        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce(
            mockDecodedToken
        );

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith(testToken);
        expect(mockResponse.locals).toEqual({
            uid: "user123",
            role: "manager",
        });
        expect(nextFunction).toHaveBeenCalled();
    });
});
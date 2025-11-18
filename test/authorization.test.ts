import { Request, Response } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationOptions } from "../src/api/v1/models/authorizationOptions";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("Authorization Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            params: {},
        };

        mockResponse = {
            locals: {},
        };

        nextFunction = jest.fn();
    });

    it("should call next() when user has required role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "admin",
        };

        const options: AuthorizationOptions = {
            hasRole: [
                "admin"
            ],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalled();
    });

    it("should throw AuthorizationError when role is missing", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
        };

        const options: AuthorizationOptions = {
            hasRole: [
                "admin"
            ],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthorizationError));
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({ code: "ROLE_NOT_FOUND" })
        );
    });

    it("should throw AuthorizationError when user has insufficient role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "user",
        };

        const options: AuthorizationOptions = {
            hasRole: [
                "admin"
            ],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(mockRequest as Request, mockResponse as Response, nextFunction);

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthorizationError));
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({ code: "INSUFFICIENT_ROLE" })
        );
    });

    it("should call next() when allowSameUser is true and IDs match", () => {
        // Arrange
        const userId = "user123";

        mockRequest.params = {
            id: userId,
        };

        mockResponse.locals = {
            uid: userId,
            role: "user",
        };

        const options: AuthorizationOptions = {
            hasRole: [
                "admin"
            ],
            allowSameUser: true,
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalled();
    });
});
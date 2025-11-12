import { auth } from "../src/config/firebaseConfig";
import { setCustomClaims } from "../src/api/v1/controllers/adminController"
import { Request, Response } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        setCustomUserClaims: jest.fn(),
    },
}));

describe("Testing Admin Controller Custom Claims", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let NextFunction: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = { params: {} };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        NextFunction = jest.fn();
    });
    
    it("should set custom claims correctly", async () => {
        // Arrange
        const mockUid = "user-123";
        const mockClaims = { role: "manager" };
        mockRequest.body = { uid: mockUid, claims: mockClaims };
        
        (auth.setCustomUserClaims as jest.Mock).mockResolvedValueOnce(undefined);

        // Act
        await setCustomClaims(mockRequest as Request, mockResponse as Response, NextFunction);

        // Assert
        expect(auth.setCustomUserClaims).toHaveBeenCalledWith(mockUid, mockClaims);

        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                status: "success",
                data: {},
                message: `Custom claims (roles) set for user: ${mockUid}`,
                timestamp: expect.any(String),
            })
        );
    });

    it("shoud call error when claims fails", async () => {
        // Arrange
        const error = new Error("Firebase error");
        const mockUid = "user123";
        const mockClaims = { role: "admin" };
        mockRequest.body = { uid: mockUid, claims: mockClaims };

        (auth.setCustomUserClaims as jest.Mock).mockRejectedValueOnce(error);

        // Act
        await setCustomClaims(mockRequest as Request, mockResponse as Response, NextFunction);

        // Assert
        expect(NextFunction).toHaveBeenCalledWith(error);
    });
});
import { auth } from "../src/config/firebaseConfig";
import { getUserDetails } from "../src/api/v1/controllers/userController"
import { Request, Response } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        getUser: jest.fn(),
    },
}));

describe("Testing User Controller", () => {
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

    it("should return user details correctly", async () => {
        // Arrange
        const mockUser = {uid: "testUser"};
        mockRequest.params = {id: "testUser"};

        (auth.getUser as jest.Mock).mockResolvedValueOnce(undefined);

        // Act
        await getUserDetails(mockRequest as Request, mockResponse as Response, NextFunction);

        // Assert
        expect(auth.getUser).toHaveBeenCalledWith(mockUser.uid);
        expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    });

    it("shoud call error when claims fails", async () => {
            // Arrange
            const error = new Error("Firebase error");
            mockRequest.params = { id: "userTest" };
    
            (auth.getUser as jest.Mock).mockRejectedValueOnce(error);
    
            // Act
            await getUserDetails(mockRequest as Request, mockResponse as Response, NextFunction);
    
            // Assert
            expect(NextFunction).toHaveBeenCalledWith(error);
    });
});
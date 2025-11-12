import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/continentService");


import * as continentController from "../src/api/v1/controllers/continentController";
import * as continentService from "../src/api/v1/services/continentService";
import { Continent } from "../src/api/v1/models/continentModel";

describe("Continent Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("getContinent", () => {
        it("should all continents without a query provided", async () => {
            // Arrange
            const mockCities = [{id: "ashjhaskg", name: "test", continentId: "test"}];
            (continentService.getContinent as jest.Mock).mockResolvedValueOnce(mockCities);
            mockReq.query = {};

            // Act
            await continentController.getContinent(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: [
                    {
                        continentId: "test",
                        id: "ashjhaskg",
                        name: "test",
                    }
                ],
                message: "Continents retrieved successfully",
            });
        });

        it("should call error when thrown", async () => {
            // Arrange
            const mockError = new Error("TestError");
            (continentService.getContinent as jest.Mock).mockRejectedValueOnce(mockError);
            mockReq.query = {};

            // Act
            await continentController.getContinent(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("createContinent", () => {
        it("should handle a successful creation", async () => {
            // Arrange
            const mockBody: Continent = {
                name: "test",
                number: 123,
            };

            const mockContinent: Continent = {
                id: "test",
                ...mockBody,
            }

            mockReq.body = mockBody;

            (continentService.createContinent as jest.Mock).mockReturnValueOnce(mockContinent);

            // Act
            await continentController.createContinent(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        });

        it("should return a bad request due to lack of parameters", async () => {
            // Act
            await continentController.createContinent(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenLastCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                details: [
                    "Continent name is required",
                    "Event number is required",
                ],
                message: "Validation failed",
            });
        });
    });

    describe("updateContinent", () => {
        it("should update a continent successfully", async () => {
            // Arrange
            const mockId: string = "test";
            const mockBody: Continent = {
                name: "test",
                number: 123,
            }

            mockReq.params = {id: mockId};
            mockReq.body = mockBody;
            const mockContinent: Continent = {
                name: "test",
                number: 123,
            };

            (continentService.updateContinent as jest.Mock).mockReturnValueOnce(mockContinent);

            // Act
            await continentController.updateContinent(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });

        it("should handle an error while also calling next", async () => {
            // Arrange
            const mockError: Error = new Error("Mock error");
            mockReq.params = { id: "1"};
            mockReq.body = {
                name: "Test"
            };
            
            (continentService.updateContinent as jest.Mock).mockRejectedValue(mockError);

            // Act
            await continentController.updateContinent(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("deleteContinent", () => {
        it("should successfully delete mocked data", async () => {
            // Arrange
            const mockId: string = "test";
            mockReq.params = {id: mockId};

            (continentService.deleteContinent as jest.Mock).mockReturnValueOnce(undefined);

            // Act
            await continentController.deleteContinent(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: "Continent successfully deleted",
                message: undefined,
                status: "success",
                timestamp: new Date().toISOString(),
            });
        });
    });
});
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/cityService");


import * as cityController from "../src/api/v1/controllers/cityController";
import * as cityService from "../src/api/v1/services/cityService";
import { City } from "../src/api/v1/models/cityModel";

describe("City Controller", () => {
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

    describe("getCity", () => {
        it("should return city data when found with query", async () => {
            // Arrange
            const mockCities = [
            { id: "1", name: "Toronto", countryId: "canada" },
            { id: "2", name: "Montreal", countryId: "canada" },
            ];
            (cityService.getCityForCountry as jest.Mock).mockResolvedValueOnce(mockCities);
            mockReq.query = { countryId: "Canada" };

            // Act
            await cityController.getCity(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(cityService.getCityForCountry).toHaveBeenCalledWith("canada");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: [
                        { countryId: "canada" , id: "1", name: "Toronto" },
                        { countryId: "canada" , id: "2", name: "Montreal", },
                    ],
                    message: "Cities retrieved successfully",
                })
            );
        });

        it("should return 400 when Joi validation fails", async () => {
            // Arrange
            mockReq.query = { countryId: ""};

            // Act
            await cityController.getCity(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "CountryId cannot be empty",
            });
        });

        it("should return 404 when no cities are found for specific country", async () => {
            // Arrange
            (cityService.getCityForCountry as jest.Mock).mockResolvedValueOnce([]);
            mockReq.query = {countryId: "test"};

            // Act
            await cityController.getCity(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(cityService.getCityForCountry).toHaveBeenCalledWith("test");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                countryId: "test",
                data: [],
                message: "No cities found for the specified country",
            });
        });

        it("should all cities without a query provided", async () => {
            // Arrange
            const mockCities = [{id: "ashjhaskg", name: "test", countryId: "test"}];
            (cityService.getCity as jest.Mock).mockResolvedValueOnce(mockCities);
            mockReq.query = {};

            // Act
            await cityController.getCity(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: [
                    {
                        countryId: "test",
                        id: "ashjhaskg",
                        name: "test",
                    }
                ],
                message: "Cities retrieved successfully",
            });
        });

        it("should call error when thrown", async () => {
            // Arrange
            const mockError = new Error("TestError");
            (cityService.getCity as jest.Mock).mockRejectedValueOnce(mockError);
            mockReq.query = {};

            // Act
            await cityController.getCity(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("createCity", () => {
        it("should handle a successful creation", async () => {
            // Arrange
            const mockBody: City = {
                countryId: "test",
                name: "test",
                date: "2025-11-05",
                type: "test",
                description: "test",
                resolution: "test",
                damage: "test",
            };

            const mockCity: City = {
                id: "test",
                ...mockBody,
            }

            mockReq.body = mockBody;

            (cityService.createCity as jest.Mock).mockReturnValueOnce(mockCity);

            // Act
            await cityController.createCity(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        });

        it("should return a bad request due to lack of parameters", async () => {
            // Act
            await cityController.createCity(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenLastCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                details: [
                    "\"countryId\" is required",
                    "City name is required",
                    "Date is required",
                    "Event type is required",
                    "Description is required",
                    "Damage is required",
                    "Resolution is required",
                ],
                message: "Validation failed",
            });
        });
    });

    describe("updateCity", () => {
        it("should update a city successfully", async () => {
            // Arrange
            const mockId: string = "test";
            const mockBody: City = {
                countryId: "test",
                name: "test",
                date: "2025-11-05",
                type: "test",
                description: "test",
                resolution: "test",
                damage: "test",
            }

            mockReq.params = {id: mockId};
            mockReq.body = mockBody;
            const mockCity: City = {
                countryId: "test",
                name: "test",
                date: "2025-11-05",
                type: "test",
                description: "test",
                resolution: "test",
                damage: "test",
            };

            (cityService.updateCity as jest.Mock).mockReturnValueOnce(mockCity);

            // Act
            await cityController.updateCity(
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
            
            (cityService.updateCity as jest.Mock).mockRejectedValue(mockError);

            // Act
            await cityController.updateCity(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("deleteCity", () => {
        it("should successfully delete mocked data", async () => {
            // Arrange
            const mockId: string = "test";
            mockReq.params = {id: mockId};

            (cityService.deleteCity as jest.Mock).mockReturnValueOnce(undefined);

            // Act
            await cityController.deleteCity(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        });
    });
});
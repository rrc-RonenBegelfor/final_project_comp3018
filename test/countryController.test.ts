import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/countryService");


import * as countryController from "../src/api/v1/controllers/countryController";
import * as countryService from "../src/api/v1/services/countryService";
import { Country } from "../src/api/v1/models/countryModel";

describe("Country Controller", () => {
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

    describe("getCountry", () => {
        it("should return country data when found with query", async () => {
            // Arrange
            const mockCities = [
            { id: "1", name: "Toronto", continentId: "canada" },
            { id: "2", name: "Montreal", continentId: "canada" },
            ];
            (countryService.getCountryForContinent as jest.Mock).mockResolvedValueOnce(mockCities);
            mockReq.query = { continentId: "Canada" };

            // Act
            await countryController.getCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(countryService.getCountryForContinent).toHaveBeenCalledWith("canada");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: [
                        { continentId: "canada" , id: "1", name: "Toronto" },
                        { continentId: "canada" , id: "2", name: "Montreal", },
                    ],
                    message: "Countries retrieved successfully",
                })
            );
        });

        it("should return 400 when Joi validation fails", async () => {
            // Arrange
            mockReq.query = { continentId: ""};

            // Act
            await countryController.getCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: undefined,
                message: "Countries retrieved successfully",
            });
        });

        it("should return 404 when no countries are found for specific continent", async () => {
            // Arrange
            (countryService.getCountryForContinent as jest.Mock).mockResolvedValueOnce([]);
            mockReq.query = {continentId: "test"};

            // Act
            await countryController.getCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(countryService.getCountryForContinent).toHaveBeenCalledWith("test");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                continentId: "test",
                data: [],
                message: "No countries found for the specified continent",
            });
        });

        it("should all countries without a query provided", async () => {
            // Arrange
            const mockCities = [{id: "ashjhaskg", name: "test", continentId: "test"}];
            (countryService.getCountry as jest.Mock).mockResolvedValueOnce(mockCities);
            mockReq.query = {};

            // Act
            await countryController.getCountry(
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
                message: "Countries retrieved successfully",
            });
        });

        it("should call error when thrown", async () => {
            // Arrange
            const mockError = new Error("TestError");
            (countryService.getCountry as jest.Mock).mockRejectedValueOnce(mockError);
            mockReq.query = {};

            // Act
            await countryController.getCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("createCountry", () => {
        it("should handle a successful creation", async () => {
            // Arrange
            const mockBody: Country = {
                continentId: "test",
                name: "test",
                data: [
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                ],
            };

            const mockCountry: Country = {
                id: "test",
                ...mockBody,
            }

            mockReq.body = mockBody;

            (countryService.createCountry as jest.Mock).mockReturnValueOnce(mockCountry);

            // Act
            await countryController.createCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
        });

        it("should return a bad request due to lack of parameters", async () => {
            // Act
            await countryController.createCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenLastCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                details: [
                    "\"continentId\" is required",
                    "Country name is required",
                    "Data is required",
                ],
                message: "Validation failed",
            });
        });
    });

    describe("updateCountry", () => {
        it("should update a country successfully", async () => {
            // Arrange
            const mockId: string = "test";
            const mockBody: Country = {
                continentId: "test",
                name: "test",
                data: [
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                ],
            }

            mockReq.params = {id: mockId};
            mockReq.body = mockBody;
            const mockCountry: Country = {
                continentId: "test",
                name: "test",
                data: [
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                    {
                        date: "test",
                        type: "test",
                        description: "test",
                        resolution: "test",
                        damage: "test",
                    },
                ],
            };

            (countryService.updateCountry as jest.Mock).mockReturnValueOnce(mockCountry);
            
            // Act
            await countryController.updateCountry(
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
            
            (countryService.updateCountry as jest.Mock).mockRejectedValue(mockError);

            // Act
            await countryController.updateCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("deleteCountry", () => {
        it("should successfully delete mocked data", async () => {
            // Arrange
            const mockId: string = "test";
            mockReq.params = {id: mockId};

            (countryService.deleteCountry as jest.Mock).mockReturnValueOnce(undefined);

            // Act
            await countryController.deleteCountry(
                mockReq as Request,
                mockRes as Response,
                mockNext as NextFunction,
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: "Country successfully deleted",
                message: undefined,
                status: "success",
                timestamp: new Date().toISOString(),
            });
        });
    });
});
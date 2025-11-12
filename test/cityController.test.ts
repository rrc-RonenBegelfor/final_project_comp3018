import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/services/cityService");


import * as cityController from "../src/api/v1/controllers/cityController";
import * as cityService from "../src/api/v1/services/cityService";
// import { City } from "../src/api/v1/models/cityModel";

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
                mockNext
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
                mockNext
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
                mockNext
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
                mockNext
            );

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});
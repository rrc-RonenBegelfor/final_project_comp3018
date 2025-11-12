import request from "supertest";
import app from "../src/app";
import * as cityController from "../src/api/v1/controllers/cityController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { auth } from "../src/config/firebaseConfig";
// import { City } from "../src/api/v1/models/cityModel";
// import response from "supertest";
// import { AuthenticationError } from "../src/api/v1/errors/errors";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));


jest.mock("../src/api/v1/controllers/cityController", () => ({
    getCity: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    createCity: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    updateCity: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteCity: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("City Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/cities", () => {
        it("should call getCity controller with query", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u1", 
                role: "manager",
            });

            // Act
            await request(app)
                .get("/api/v1/cities")
                .query({ countryId: "CA" })
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(cityController.getCity).toHaveBeenCalled();
        });

        it("should call getCity controller without query", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u2", 
                role: "manager" 
            });

            // Act
            await request(app)
                .get("/api/v1/cities")
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);
            
            // Assert
            expect(cityController.getCity).toHaveBeenCalled();
        });
    });

});
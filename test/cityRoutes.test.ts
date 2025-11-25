import request from "supertest";
import app from "../src/app";
import * as cityController from "../src/api/v1/controllers/cityController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { auth } from "../src/config/firebaseConfig";
import { citySchemas } from "../src/api/v1/validation/cityValidation";
// import { AuthenticationError } from "../src/api/v1/errors/errors";
// import { City } from "../src/api/v1/models/cityModel";
// import response from "supertest";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));


jest.mock("../src/api/v1/controllers/cityController", () => ({
    getCity: jest.fn((req, res) =>{
        const { error } = citySchemas.query.params.validate(req.query);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    createCity: jest.fn((req, res) => {
        const { error } = citySchemas.create.body.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    updateCity: jest.fn((req, res) => { 
        const { error } = citySchemas.update.body.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    deleteCity: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getCityById: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
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
                role: "user",
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

        it("should call getCity as bad request", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
                uid: "u2",
                role: "historian"
            });

            // Act & Assert
            await request(app)
                .get("/api/v1/cities")
                .query({ countryId: "C" })
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(cityController.getCity).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/cities", () => {
        it("should call createCity controller with valid data and authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .post("/api/v1/cities")
                .set("Authorization", "Bearer testtoken")
                .send({
                    countryId: "CA",
                    name: "Test City",
                    date: "2023-10-10",
                    type: "Natural Disaster",
                    description: "A test description",
                    damage: "Test damage",
                    resolution: "Test resolution"
                })
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(cityController.createCity).toHaveBeenCalled();
        });

        it("should call createCity controller as bad request, missing data", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .post("/api/v1/cities")
                .set("Authorization", "Bearer testtoken")
                .send({
                    countryId: "",
                    name: "",
                })
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(cityController.createCity).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/cities/:id", () => {
        it("should call updateCity controller with valid data and authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .put("/api/v1/cities/testCityId")
                .set("Authorization", "Bearer testtoken")
                .send({
                    countryId: "CA",
                    name: "Test City",
                    date: "2023-10-10",
                    type: "Natural Disaster",
                    description: "A test description",
                    damage: "Test damage",
                    resolution: "Test resolution"
                })
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(cityController.updateCity).toHaveBeenCalled();
        });

        it("should call updateCity controller as bad request, missing data", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .put("/api/v1/cities/testCityId")
                .set("Authorization", "Bearer testtoken")
                .send({
                    countryId: "",
                    name: "",
                })
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(cityController.updateCity).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/cities/:id", () => {
        it("should call deleteCity controller with correct authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "manager" 
            });

            // Act
            await request(app)
                .delete("/api/v1/cities/testCityId")
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(cityController.deleteCity).toHaveBeenCalled();
        });
    });
});
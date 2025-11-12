import request from "supertest";
import app from "../src/app";
import * as continentController from "../src/api/v1/controllers/continentController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { auth } from "../src/config/firebaseConfig";
import { continentSchemas } from "../src/api/v1/validation/continentValidation";
// import { AuthenticationError } from "../src/api/v1/errors/errors";
// import { Continent } from "../src/api/v1/models/continentModel";
// import response from "supertest";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));


jest.mock("../src/api/v1/controllers/continentController", () => ({
    getContinent: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    createContinent: jest.fn((req, res) => {
        const { error } = continentSchemas.create.body.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    updateContinent: jest.fn((req, res) => { 
        const { error } = continentSchemas.update.body.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    deleteContinent: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Continent Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/continents", () => {
        it("should call getContinent controller with query", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u1", 
                role: "user",
            });

            // Act
            await request(app)
                .get("/api/v1/continents")
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(continentController.getContinent).toHaveBeenCalled();
        });

        it("should call getContinent controller without query", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u2", 
                role: "manager" 
            });

            // Act
            await request(app)
                .get("/api/v1/continents")
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);
            
            // Assert
            expect(continentController.getContinent).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/continents", () => {
        it("should call createContinent controller with valid data and authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .post("/api/v1/continents")
                .set("Authorization", "Bearer testtoken")
                .send({
                    name: "Test Continent",
                    number: 123,
                })
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(continentController.createContinent).toHaveBeenCalled();
        });

        it("should call createContinent controller as bad request, missing data", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .post("/api/v1/continents")
                .set("Authorization", "Bearer testtoken")
                .send({
                    name: "",
                    number: "",
                })
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(continentController.createContinent).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/continents/:id", () => {
        it("should call updateContinent controller with valid data and authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .put("/api/v1/continents/testContinentId")
                .set("Authorization", "Bearer testtoken")
                .send({
                    name: "Test Continent",
                    number: 123,
                })
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(continentController.updateContinent).toHaveBeenCalled();
        });

        it("should call updateContinent controller as bad request, missing data", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .put("/api/v1/continents/testContinentId")
                .set("Authorization", "Bearer testtoken")
                .send({
                    name: "",
                    number: "",
                })
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(continentController.updateContinent).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/continents/:id", () => {
        it("should call deleteContinent controller with correct authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "manager" 
            });

            // Act
            await request(app)
                .delete("/api/v1/continents/testContinentId")
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(continentController.deleteContinent).toHaveBeenCalled();
        });
    });
});
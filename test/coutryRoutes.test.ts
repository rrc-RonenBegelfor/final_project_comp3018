import request from "supertest";
import app from "../src/app";
import * as countryController from "../src/api/v1/controllers/countryController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { auth } from "../src/config/firebaseConfig";
import { countrySchemas } from "../src/api/v1/validation/countryValidation";
// import { AuthenticationError } from "../src/api/v1/errors/errors";
// import { Country } from "../src/api/v1/models/countryModel";
// import response from "supertest";

jest.mock("../src/config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));


jest.mock("../src/api/v1/controllers/countryController", () => ({
    getCountry: jest.fn((req, res) =>{
        const { error } = countrySchemas.query.params.validate(req.query);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    createCountry: jest.fn((req, res) => {
        const { error } = countrySchemas.create.body.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    updateCountry: jest.fn((req, res) => { 
        const { error } = countrySchemas.update.body.validate(req.body);
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return res.status(HTTP_STATUS.OK).send();
    }),
    deleteCountry: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Country Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/countries", () => {
        it("should call getCountry controller with query", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u1", 
                role: "user",
            });

            // Act
            await request(app)
                .get("/api/v1/countries")
                .query({ continentId: "Asia" })
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(countryController.getCountry).toHaveBeenCalled();
        });

        it("should call getCountry controller without query", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u2", 
                role: "manager" 
            });

            // Act
            await request(app)
                .get("/api/v1/countries")
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);
            
            // Assert
            expect(countryController.getCountry).toHaveBeenCalled();
        });

        it("should call getCountry as bad request", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
                uid: "u2",
                role: "historian"
            });

            // Act & Assert
            await request(app)
                .get("/api/v1/countries")
                .query({ countryId: "C" })
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(countryController.getCountry).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/countries", () => {
        it("should call createCountry controller with valid data and authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .post("/api/v1/countries")
                .set("Authorization", "Bearer testtoken")
                .send({
                    continentId: "Asia",
                    name: "Test Country",
                    data:[{ 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    ],
                })
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(countryController.createCountry).toHaveBeenCalled();
        });

        it("should call createCountry controller as bad request, missing data", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .post("/api/v1/countries")
                .set("Authorization", "Bearer testtoken")
                .send({
                    continentId: "",
                    name: "",
                })
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(countryController.createCountry).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/countries/:id", () => {
        it("should call updateCountry controller with valid data and authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .put("/api/v1/countries/testCountryId")
                .set("Authorization", "Bearer testtoken")
                .send({
                    continentId: "Asia",
                    name: "Test Country",
                    data:[{ 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    { 
                        date: "2023-10-10",
                        type: "Natural Disaster",
                        description: "A test description",
                        damage: "Test damage",
                        resolution: "Test resolution"
                    },
                    ],
                })
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(countryController.updateCountry).toHaveBeenCalled();
        });

        it("should call updateCountry controller as bad request, missing data", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "historian" 
            });

            // Act
            await request(app)
                .put("/api/v1/countries/testCountryId")
                .set("Authorization", "Bearer testtoken")
                .send({
                    continentId: "",
                    name: "",
                })
                .expect(HTTP_STATUS.BAD_REQUEST);

            // Assert
            expect(countryController.updateCountry).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/countries/:id", () => {
        it("should call deleteCountry controller with correct authentication", async () => {
            // Arrange
            (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ 
                uid: "u3", 
                role: "manager" 
            });

            // Act
            await request(app)
                .delete("/api/v1/countries/testCountryId")
                .set("Authorization", "Bearer testtoken")
                .expect(HTTP_STATUS.OK);

            // Assert
            expect(countryController.deleteCountry).toHaveBeenCalled();
        });
    });
});
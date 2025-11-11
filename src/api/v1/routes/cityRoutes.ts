import express, { Router } from "express";
import * as cityController from "../controllers/cityController";
// import authenticate from "../middleware/authenticate";
// import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /cities:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CityCreate'
 *     responses:
 *       '201':
 *         description: City created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Validation failed
 *       '500':
 *         description: Internal server error
 */
router.post("/", cityController.createCity);

/**
 * @openapi
 * /cities:
 *   get:
 *     summary: Retrieve cities
 *     tags: [Cities]
 *     parameters:
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: string
 *         description: Optional country name to filter cities (case-insensitive)
 *     responses:
 *       '200':
 *         description: Cities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CityListResponse'
 *       '400':
 *         description: Invalid query parameters
 *       '404':
 *         description: No cities found for the specified country
 *       '500':
 *         description: Internal server error
 */
router.get("/", cityController.getCity);

/**
 * @openapi
 * /cities/{id}:
 *   put:
 *     summary: Update a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The city identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CityUpdate'
 *     responses:
 *       '200':
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Validation failed
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", cityController.updateCity);

/**
 * @openapi
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The city identifier
 *     responses:
 *       '200':
 *         description: City deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", cityController.deleteCity);

export default router;
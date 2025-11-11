import express, { Router } from "express";
import * as countryController from "../controllers/countryController";
// import authenticate from "../middleware/authenticate";
// import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /countries:
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CountryCreate'
 *     responses:
 *       '201':
 *         description: Country created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Validation failed
 *       '500':
 *         description: Internal server error
 */
router.post("/", countryController.createCountry);

/**
 * @openapi
 * /countries:
 *   get:
 *     summary: Retrieve countries
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: continent
 *         schema:
 *           type: string
 *         description: Optional continent name to filter countries (case-insensitive)
 *     responses:
 *       '200':
 *         description: Countries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountryListResponse'
 *       '400':
 *         description: Invalid query parameters
 *       '404':
 *         description: No countries found for the specified continent
 *       '500':
 *         description: Internal server error
 */
router.get("/", countryController.getCountry);

/**
 * @openapi
 * /countries/{id}:
 *   put:
 *     summary: Update a country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The country identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CountryUpdate'
 *     responses:
 *       '200':
 *         description: Country updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Validation failed
 *       '404':
 *         description: Country not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", countryController.updateCountry);

/**
 * @openapi
 * /countries/{id}:
 *   delete:
 *     summary: Delete a country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The country identifier
 *     responses:
 *       '200':
 *         description: Country deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Country not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", countryController.deleteCountry);

export default router;
import express, { Router } from "express";
import * as locationController from "../controllers/locationController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /location:
 *   get:
 *     summary: Retrieve locations
 *     tags: [Locations]
 *     responses:
 *       '200':
 *         description: Locations retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ip: "123.123.123.123"
 *               locationData:
 *                 - continent_code: "NA"
 *                   continent_name: "North America"
 *                   country_code: "CA"
 *                   country_name: "Canada"
 *                   "city": "Winnipeg"
 *       '500':
 *         description: Internal server error
 */
router.get("/", authenticate, isAuthorized({ hasRole: ["admin"] }), locationController.getLocation);

/**
 * @openapi
 * /location/city:
 *   get:
 *     summary: Retrieve city based on current location
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication. Returns city information based on geographic coordinates.
 *     tags: [Locations]
 *     responses:
 *       '200':
 *         description: City information retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 - id: "Ad2qxgE7aSznRIgwJokM"
 *                   countryId: "CA"
 *                   name: "Winnipeg"
 *                   date: "2025-11-17"
 *                   type: "Natural Disaster"
 *                   description: "Example Description"
 *                   damage: "Example Damage"
 *                   resolution: "Example Resolution"
 *               message: "City fetched successfully"
 *               timestamp: "example timestamp"
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '404':
 *         description: City not found for the provided location
 *       '500':
 *         description: Internal server error
 */
router.get("/city", authenticate, locationController.getCityBasedOnLocation);

/**
 * @openapi
 * /location/country:
 *   get:
 *     summary: Retrieve country based on current location
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication. Returns country information based on geographic coordinates.
 *     tags: [Locations]
 *     responses:
 *       '200':
 *         description: Country information retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 - id: "example"
 *               message: "Country fetched successfully"
 *               timestamp: "example timestamp"
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '404':
 *         description: Country not found for the provided location
 *       '500':
 *         description: Internal server error
 */
router.get("/country", authenticate, locationController.getCountryBasedOnLocation);

export default router;
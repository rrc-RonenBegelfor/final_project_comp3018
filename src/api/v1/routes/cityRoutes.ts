import express, { Router } from "express";
import * as cityController from "../controllers/cityController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /cities:
 *   post:
 *     summary: Create a new city
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and either 'manager' or 'historian' role.
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             countryId: ""
 *             name: ""
 *             date: ""
 *             type: ""
 *             description: ""
 *             damage: ""
 *             resolution: ""
 *     responses:
 *       '201':
 *         description: City created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: "City Created"
 *               timestamp: "2004-12-31T12:00:00Z"
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '500':
 *         description: Internal server error
 */
router.post("/", authenticate, isAuthorized({hasRole: ["manager", "historian"]}), cityController.createCity);

/**
 * @openapi
 * /cities:
 *   get:
 *     summary: Retrieve cities
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication.
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
 *             example:
 *               message: "Cities retrieved successfully"
 *               data:
 *                 - id: "DaRVXicS82x7alS1yPk8"
 *                   countryId: "UK"
 *                   name: "London"
 *                   date: "2023-10-01"
 *                   type: "Flood"
 *                   description: "Severe flooding in downtown area"
 *                   damage: "High"
 *                   resolution: "Evacuation and relief efforts underway"
 *                 - id: "AbCdEfGhIjKlMnOpQrSt"
 *                   countryId: "US"
 *                   name: "New York"
 *                   date: "2023-09-15"
 *                   type: "Hurricane"
 *                   description: "Category 4 hurricane making landfall"
 *                   damage: "Severe"
 *                   resolution: "State of emergency declared"
 *       '400':
 *         description: Invalid query parameters
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '404':
 *         description: No cities found for the specified country
 *       '500':
 *         description: Internal server error
 */
router.get("/", authenticate, cityController.getCity);

/**
 * @openapi
 * /cities/{id}:
 *   put:
 *     summary: Update a city by ID
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and 'historian' role.
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
 *           example:
 *             countryId: ""
 *             name: ""
 *             date: ""
 *             type: ""
 *             description: ""
 *             damage: ""
 *             resolution: ""
 *     responses:
 *       '200':
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 id: "DaRVXicS82x7alS1yPk8"
 *                 countryId: "UK"
 *                 name: "London"
 *                 date: "2023-10-01"
 *                 type: "Flood"
 *                 description: "Severe flooding in downtown area"
 *                 damage: "High"
 *                 resolution: "Evacuation and relief efforts underway"
 *               message: "City successfully updated"
 *               timestamp: "2025-11-11T19:59:25.026Z"
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", authenticate, isAuthorized({ hasRole:["historian"] }), cityController.updateCity);

/**
 * @openapi
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and 'manager' role.
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
 *             example:
 *               status: "success"
 *               data: "City successfully deleted"
 *               timestamp: "2025-11-11T19:59:37.525Z"
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '404':
 *         description: City not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", authenticate, isAuthorized({hasRole:["manager"]}), cityController.deleteCity);

router.get("/:id", authenticate, cityController.getCityById);

export default router;
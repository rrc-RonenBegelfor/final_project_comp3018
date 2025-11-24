import express, { Router } from "express";
import * as countryController from "../controllers/countryController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /countries:
 *   post:
 *     summary: Create a new country
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and either 'manager' or 'historian' role.
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             continentId: ""
 *             name: ""
 *             data:
 *               - date: ""
 *                 type: ""
 *                 description: ""
 *                 damage: ""
 *                 resolution: ""
 *     responses:
 *       '201':
 *         description: Country created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: "Country Created"
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
router.post("/", authenticate, isAuthorized({hasRole: ["manager", "historian"]}), countryController.createCountry);

/**
 * @openapi
 * /countries:
 *   get:
 *     summary: Retrieve countries
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication.
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: continentId
 *         schema:
 *           type: string
 *         description: Optional continent name to filter countries (case-insensitive)
 *     responses:
 *       '200':
 *         description: Countries retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Countries retrieved successfully"
 *               data:
 *                 - id: "DaRVXicS82x7alS1yPk8"
 *                   continentId: "EU"
 *                   name: "Germany"
 *                   data:
 *                     - date: "2025-01-01"
 *                       type: "Flood"
 *                       description: "Severe flooding in the northern region"
 *                       damage: "High"
 *                       resolution: "Evacuation and relief efforts underway"
 *       '400':
 *         description: Invalid query parameters
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '404':
 *         description: No countries found for the specified continent
 *       '500':
 *         description: Internal server error
 */
router.get("/", authenticate, countryController.getCountry);

/**
 * @openapi
 * /countries/{id}:
 *   put:
 *     summary: Update a country by ID
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and 'historian' role.
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
 *           example:
 *             continentId: ""
 *             name: ""
 *             data:
 *               - date: ""
 *                 type: ""
 *                 description: ""
 *                 damage: ""
 *                 resolution: ""
 *     responses:
 *       '200':
 *         description: Country updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 id: "DaRVXicS82x7alS1yPk8"
 *                 continentId: "EU"
 *                 name: "Germany"
 *                 data:
 *                   - date: "2025-01-01"
 *                     type: "Flood"
 *                     description: "Severe flooding in the northern region"
 *                     damage: "High"
 *                     resolution: "Evacuation and relief efforts underway"
 *               message: "Country successfully updated"
 *               timestamp: "2025-11-11T19:59:25.026Z"
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '404':
 *         description: Country not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", authenticate, isAuthorized({ hasRole:["historian"] }), countryController.updateCountry);

/**
 * @openapi
 * /countries/{id}:
 *   delete:
 *     summary: Delete a country by ID
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and 'manager' role.
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
 *             example:
 *               status: "success"
 *               data: "Country successfully deleted"
 *               timestamp: "2025-11-11T19:59:37.525Z"
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '404':
 *         description: Country not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", authenticate, isAuthorized({hasRole:["manager"]}), countryController.deleteCountry);

router.get("/:id", authenticate, countryController.getCountryById);

export default router;
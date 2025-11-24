import express, { Router } from "express";
import * as continentController from "../controllers/continentController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /continents:
 *   post:
 *     summary: Create a new continent
 *     tags: [Continents]
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and either 'manager' or 'historian' role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               number:
 *                 type: integer
 *           example:
 *             name: "Africa"
 *             number: 1
 *     responses:
 *       '201':
 *         description: Continent created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: "Continent Created"
 *               timestamp: "2004-12-31T12:00:00Z"
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '500':
 *         description: Internal server error
 */
router.post("/", authenticate, isAuthorized({hasRole: ["manager", "historian"]}), continentController.createContinent);

/**
 * @openapi
 * /continents:
 *   get:
 *     summary: Retrieve continents
 *     tags: [Continents]
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication.
 *     responses:
 *       '200':
 *         description: Continents retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Continents retrieved successfully"
 *               data:
 *                 - id: "DaRVXicS82x7alS1yPk8"
 *                   name: "Test"
 *                   number: 123
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/", authenticate, continentController.getContinent);

/**
 * @openapi
 * /continents/{id}:
 *   put:
 *     summary: Update a continent by ID
 *     tags: [Continents]
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and 'historian' role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The continent identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               number:
 *                 type: integer
 *           example:
 *             name: "Europe"
 *             number: 2
 *     responses:
 *       '200':
 *         description: Continent updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 - id: "example"
 *                   name: "example"
 *                   number: 123
 *               message: "Continent successfully updated"
 *               timestamp: "2025-11-11T19:59:25.026Z"
 *       '400':
 *         description: Validation failed
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '404':
 *         description: Continent not found
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", authenticate, isAuthorized({ hasRole:["historian"] }), continentController.updateContinent);

/**
 * @openapi
 * /continents/{id}:
 *   delete:
 *     summary: Delete a continent by ID
 *     tags: [Continents]
 *     security:
 *       - bearerAuth: []
 *     description: Requires authentication and 'manager' role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The continent identifier
 *     responses:
 *       '200':
 *         description: Continent deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: "Continent successfully deleted"
 *               timestamp: "2025-11-11T19:59:37.525Z"
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '404':
 *         description: Continent not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", authenticate, isAuthorized({hasRole:["manager"]}), continentController.deleteContinent);

router.get("/:id", authenticate, continentController.getContinentById);

export default router;
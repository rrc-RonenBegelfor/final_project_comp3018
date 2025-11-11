import express, { Router } from "express";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

/**
 * @openapi
 * /admin/setCustomClaims:
 *   post:
 *     summary: Set custom claims (roles) for a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             uid: ""
 *             claims:
 *               role: ""
 *     responses:
 *       '200':
 *         description: Custom claims set successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data: "Custom claims (roles) set for user: user123abc"
 *               timestamp: "2025-11-11T20:00:00.000Z"
 *       '400':
 *         description: Validation error or bad request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden - insufficient permissions
 *       '500':
 *         description: Internal server error
 */
router.post(
    "/setCustomClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default router;
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
 *           schema:
 *             type: object
 *             required: [uid, claims]
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Firebase user UID
 *               claims:
 *                 type: object
 *                 description: Custom claims object to set (e.g., {"admin": true})
 *     responses:
 *       '200':
 *         description: Custom claims set successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
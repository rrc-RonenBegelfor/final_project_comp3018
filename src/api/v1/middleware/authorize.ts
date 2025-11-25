// External library imports
import { Request, Response, NextFunction } from "express";
// Internal modules imports
import { AuthorizationOptions } from "../models/authorizationOptions";
import { MiddlewareFunction } from "../types/express";
import { AuthorizationError } from "../errors/errors";

/**
 * Middleware to authorize a user using their assigned roles on Firebase.
 * 
 * @param authOptions Role and UID (unique ID) holder.
 * @returns {MiddlewareFunction}
 */
const isAuthorized = (
    authOptions: AuthorizationOptions
): MiddlewareFunction => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { role, uid } = res.locals;
            const { id } = req.params;

            // Allow if the user is accessing their own data
            // allowSameUser is a flag to indicate whether users can access their own data
            if (authOptions.allowSameUser && id && uid === id) {
                return next();
            }

            // If no role exists for the user, throw an error
            if (!role) {
                throw new AuthorizationError(
                    "Forbidden: No role found",
                    "ROLE_NOT_FOUND"
                );
            }

            // Check if the user's role is one of the allowed roles
            if (authOptions.hasRole.includes(role)) {
                return next();
            }

            // If no role is found throw an error
            throw new AuthorizationError(
                "Forbidden: Insufficient role",
                "INSUFFICIENT_ROLE"
            );
        } catch (error: unknown) {
            next(error);
        }
    };
};

export default isAuthorized;

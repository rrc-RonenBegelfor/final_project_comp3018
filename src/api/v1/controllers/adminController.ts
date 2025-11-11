import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";


/**
 * Sets custom claims (roles) for a Firebase user.
 *
 * @param req Express request object containing `uid` and `claims` in the body.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const setCustomClaims = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { uid, claims } = req.body;

        await auth.setCustomUserClaims(uid, claims);

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, `Custom claims (roles) set for user: ${uid}`)
        );
    } catch (error: unknown) {
        next(error);
    }
};

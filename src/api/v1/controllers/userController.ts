
import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";

import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Retrieves a Firebase user's details by UID.
 *
 * @param req Express request object containing user ID in params.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with the Firebase UserRecord or passes error to next middleware.
 */
export const getUserDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const userRecord: UserRecord = await auth.getUser(id);
        res.status(HTTP_STATUS.OK).json(successResponse(userRecord));
    } catch (error: unknown) {
        next(error);
    }
};

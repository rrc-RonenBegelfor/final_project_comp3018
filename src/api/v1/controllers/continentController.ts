import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as continentService from "../services/continentService";
import { Continent } from "../models/continentModel";
import { continentSchemas } from "../validation/continentValidation";
import { successResponse } from "../models/responseModel";
// import * as cityService from "../services/cityService";

/**
 * Retrieves all continents from the database.
 *
 * @param req Express request object.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a JSON object containing a message and continent data, or passes error to next middleware.
 */
export const getContinent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        let continents: Continent[];
        
        continents = await continentService.getContinent();

        res.status(HTTP_STATUS.OK).json({
            message: "Continents retrieved successfully",
            data: continents,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Creates a new continent in the database.
 * 
 * @param req Express request object containing continent data in the body.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const createContinent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { error, value } = continentSchemas.create.body.validate(req.body, { abortEarly: false});

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const continent: Continent = value;

        await continentService.createContinent({ ...continent });
        res.status(HTTP_STATUS.CREATED).json(successResponse("Continent Created"));
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Updates an existing continent in the database by ID.
 *
 * @param req Express request object containing continent ID in params and updated data in the body.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with the updated continent or passes error to next middleware.
 */
export const updateContinent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        

        const {error, value } = continentSchemas.update.body.validate(req.body, { abortEarly: false})
        
        const {number} = value;

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const updatedContinent: Continent = await continentService.updateContinent(id, {
            number
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedContinent, "Continent successfully updated"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Deletes a continent from the database by ID.
 *
 * @param req Express request object containing continent ID in params.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const deleteContinent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await continentService.deleteContinent(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Continent successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const getContinentById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const continent: Continent | undefined = await continentService.getContinentById(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Continent fetched",
            data: continent,
        });
} catch (error: unknown) {
        next(error);
    }
}
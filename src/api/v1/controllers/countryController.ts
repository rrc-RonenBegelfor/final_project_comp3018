import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as countryService from "../services/countryService";
import { Country } from "../models/countryModel";
import { countrySchemas } from "../validation/countryValidation";
import { successResponse } from "../models/responseModel";

/**
 * Retrieves countries from the database.
 *
 * @param req Express request object, with optional `continent` in query string.
 * @param res Express response object, used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a JSON object containing a message and country data, or passes error to next middleware.
 */
export const getCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { error, value } = countrySchemas.query.params.validate(req.query);
        if (error) {
            res.status(400).json({ message: error.message });
        }

        const { continentId } = value;
        let countries;

        if (continentId) {
            countries = await countryService.getCountryForContinent(continentId.toLowerCase());
            if (countries.length === 0) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({
                    continentId,
                    data: [],
                    message: "No countries found for the specified continent",
                });
            }
        } else {
            countries = await countryService.getCountry();
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Countries retrieved successfully",
            data: countries,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Creates a new country in the database.
 *
 * @param req Express request object containing country data in the body.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const createCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { error, value } = countrySchemas.create.body.validate(req.body, { abortEarly: false});

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const country: Country = value;

        await countryService.createCountry({ ...country });
        res.status(HTTP_STATUS.CREATED).json(successResponse("Country Created"));
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Updates an existing country in the database by ID.
 *
 * @param req Express request object containing country ID in params and updated data in the body.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with the updated country or passes error to next middleware.
 */
export const updateCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const {error, value } = countrySchemas.update.body.validate(req.body, { abortEarly: false})
        
        const { continentId, name, data} = value;

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const updatedCountry: Country = await countryService.updateCountry(id, {
            continentId,
            name,
            data,
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedCountry, "Country successfully updated"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Deletes a country from the database by ID.
 *
 * @param req Express request object containing country ID in params.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const deleteCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await countryService.deleteCountry(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Country successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Retreives a country by its unique ID.
 * 
 * @param req Express request object containing country ID in params.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const getCountryById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const country: Country | undefined = await countryService.getCountryById(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Country fetched",
            data: country,
        });
} catch (error: unknown) {
        next(error);
    }
}
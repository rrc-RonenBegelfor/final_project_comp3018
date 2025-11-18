import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as cityService from "../services/cityService";
import { City } from "../models/cityModel";
import { citySchemas } from "../validation/cityValidation";
import { successResponse } from "../models/responseModel";


/**
 * Retrieves cities from the database.
 *
 * @param req Express request object, with optional `country` in query string.
 * @param res Express response object, used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a JSON object containing a message and city data, or passes error to next middleware.
 */
export const getCity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { error, value } = citySchemas.query.params.validate(req.query);
        if (error) {
            res.status(400).json({ message: error.message });
        }

        const { countryId } = value;
        let cities;

        if (countryId ) {
            cities = await cityService.getCityForCountry(countryId.toLowerCase());
            if (cities.length === 0) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({
                    countryId,
                    data: [],
                    message: "No cities found for the specified country",
                });
            }
        } else {
            cities = await cityService.getCity();
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Cities retrieved successfully",
            data: cities,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Creates a new city in the database.
 *
 * @param req Express request object containing city data in the body.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const createCity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { error, value } = citySchemas.create.body.validate(req.body, { abortEarly: false});

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const city: City = value;

        await cityService.createCity({ ...city });
        res.status(HTTP_STATUS.CREATED).json(successResponse("City Created"));
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Updates an existing city in the database by ID.
 *
 * @param req Express request object containing city ID in params and updated data in the body.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with the updated city or passes error to next middleware.
 */
export const updateCity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const {error, value } = citySchemas.update.body.validate(req.body, { abortEarly: false})
        
        const { countryId, name, date, type, description, damage, resolution} = value;

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const updatedCity: City = await cityService.updateCity(id, {
            countryId,
            name,
            date,
            type,
            description,
            damage,
            resolution,
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedCity, "City successfully updated"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Deletes a city from the database by ID.
 *
 * Expects city ID in the request params. On success, responds with 200 and a success message.
 *
 * @param req Express request object containing city ID in params.
 * @param res Express response object used to send the result.
 * @param next Express next middleware function for error handling.
 * @returns Responds with a success message or passes error to next middleware.
 */
export const deleteCity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await cityService.deleteCity(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("City successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};
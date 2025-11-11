import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as continentService from "../services/continentService";
import { Continent } from "../models/continentModel";
import { continentSchemas } from "../validation/continentValidation";
import { successResponse } from "../models/responseModel";

export const getContinent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        let continents: Continent[];
        
        continents = await continentService.getContinent();

        res.status(HTTP_STATUS.OK).json({
            message: "Countries retrieved successfully",
            data: continents,
        });
    } catch (error: unknown) {
        next(error);
    }
};

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

export const updateContinent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const {error, value } = continentSchemas.update.body.validate(req.body, { abortEarly: false})
        
        const { name, data} = value;

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const updatedContinent: Continent = await continentService.updateContinent(id, {
            name,
            data,
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedContinent, "Continent successfully updated"),
        );
    } catch (error: unknown) {
        next(error);
    }
};

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
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as cityService from "../services/cityService";
import { City } from "../models/cityModel";
import { citySchemas } from "../validation/cityValidation";
import { successResponse } from "../models/responseModel";

export const getCity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { country } = req.query;

        let cities: City[];
        
        if (typeof country === "string") {
            cities = await cityService.getCityForCountry(country.toLocaleLowerCase());

            if (cities.length === 0) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    country: country,
                    data: [],
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

export const updateCity = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const {error, value } = citySchemas.update.body.validate(req.body, { abortEarly: false})
        
        const { name, date, type, description, damage, resolution} = value;

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const updatedCity: City = await cityService.updateCity(id, {
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
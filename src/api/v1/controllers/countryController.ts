import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as countryService from "../services/countryService";
import { Country } from "../models/countryModel";
import { countrySchemas } from "../validation/countryValidation";
import { successResponse } from "../models/responseModel";

export const getCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { country } = req.query;

        let countries: Country[];
        
        if (typeof country === "string") {
            countries = await countryService.getCountryForContinent(country.toLocaleLowerCase());

            if (countries.length === 0) {
                res.status(HTTP_STATUS.NOT_FOUND).json({
                    country: country,
                    data: [],
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

export const updateCountry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const {error, value } = countrySchemas.update.body.validate(req.body, { abortEarly: false})
        
        const { name, data} = value;

        if (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Validation failed",
            details: error.details.map(d => d.message),
            });
            
            return;
        }

        const updatedCountry: Country = await countryService.updateCountry(id, {
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
import { Request, Response, NextFunction } from "express";
import {getIp, getLocationData} from "../services/locationService";
import { HTTP_STATUS  } from "../../../constants/httpConstants";
import * as cityService from "../services/cityService";
import * as countryService from "../services/countryService";
import { successResponse } from "../models/responseModel";

export const getLocation = async (
    req: Request, 
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const ip = await getIp();
        const locationData = await getLocationData( ip);

        res.status(HTTP_STATUS.OK).json({
            ip,
            locationData
        })
    } catch (error : unknown) {
        next(error)
    }
}

export const getCityBasedOnLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const city = await cityService.getCityByIp();

        res.status(HTTP_STATUS.OK).json(successResponse(city, "City fetched successfully"));
    } catch (error: unknown) {
        next(error);
    }
};

export const getCountryBasedOnLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const country = await countryService.getCountryByIp();

        res.status(HTTP_STATUS.OK).json(successResponse(country, "Country fetched successfully"));
    } catch (error: unknown) {
        next(error);
    }
}
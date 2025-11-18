import { Request, Response, NextFunction } from "express";
import {getIp, getLocationData} from "../services/locationService";
import { HTTP_STATUS  } from "../../../constants/httpConstants";

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

};

export const getCountryBasedOnLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    
}
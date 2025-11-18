import { Request, Response, NextFunction } from "express";
import {getIp, getLocationData} from "../services/locationService";
import { HTTP_STATUS  } from "src/constants/httpConstants";

export const getLocation = async (
    req: Request, 
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const ip = getIp(req);
        const locationData = await getLocationData(ip);

        res.status(HTTP_STATUS.OK).json({
            ip,
            locationData
        })
    } catch (error : unknown) {
        next(error)
    }
}
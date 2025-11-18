import axios from "axios";
import { Request } from "express";
import { Location } from "../models/locationModel";
import accessKey from "../../../../ronen_ipstack_api_key.json"

export const getIp = (req: Request): string => {
    const forwaded = req.headers["x-forwarded-for"];
    // After some research I've learned that this is a tenary operator.
    const ip = Array.isArray(forwaded) ? forwaded[0] : forwaded|| req.socket.remoteAddress || "0.0.0.0";

    return ip.split(',')[0].trim();
};

export const getLocationData = async (ip: string): Promise<Location> => {
    try {
        const { data } = await axios.get<Location>(`http://api.ipstack.com/${ip}?access_key=${accessKey}`);
        return data;
    } catch (error : unknown) {
        throw error;
    }
};
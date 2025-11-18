import axios from "axios";
import { Location } from "../models/locationModel";
import accessKey from "../../../../ronen_ipstack_api_key.json"

export const getIp = async (): Promise<string> => {
    try {
        const response = await fetch("https://api.ipify.org?format=json");

        const data: { ip: string } = await response.json();

        return data.ip;
    } catch (error: unknown) {
        throw error;
    }
};

export const getLocationData = async (ip: string): Promise<Location> => {
    try {
        const { data } = await axios.get<Location>(`http://api.ipstack.com/${ip}?access_key=${accessKey}`);
        return data;
    } catch (error : unknown) {
        throw error;
    }
};
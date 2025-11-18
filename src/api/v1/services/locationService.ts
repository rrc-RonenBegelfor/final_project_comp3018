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
        const response = await fetch(`http://api.ipstack.com/${ip}?access_key=${accessKey}`);
        const data: Location = await response.json();

        const location: Location = {
            continent_code: data.continent_code,
            continent_name: data.continent_name,
            country_code: data.country_code,
            country_name: data.country_name,
            city: data.city,
        }

        return location;
    } catch (error : unknown) {
        throw error;
    }
};
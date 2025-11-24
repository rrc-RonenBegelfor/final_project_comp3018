export interface CountryRequestModel {
    continentId: string;
    country_code: string;
    name: string;
    data: {
        date: string;
        type: string;
        description: string;
        damage: string;
        resolution: string;
    }[];
};
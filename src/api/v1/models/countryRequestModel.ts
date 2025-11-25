/**
 * CountryRequestModel is used applying Joi validation.
 */
export interface CountryRequestModel {
    continentId: string;
    name: string;
    data: {
        date: string;
        type: string;
        description: string;
        damage: string;
        resolution: string;
    }[];
};
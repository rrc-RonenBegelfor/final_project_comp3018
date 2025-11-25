/**
 * CityRequestModel is used applying Joi validation.
 */
export interface CityRequestModel {
    countryId: string;
    name: string;
    date: string;
    type: string;
    description: string;
    damage: string;
    resolution: string;
};
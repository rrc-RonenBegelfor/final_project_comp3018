/**
 * ContinentRequestModel is used applying Joi validation.
 */
export interface ContinentRequestModel {
    name: string;
    continent_code: string;
    number: {
        human: number;
        natural: number;
        human_natural: number;
    };
};
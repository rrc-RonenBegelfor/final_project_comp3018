import Joi, { ObjectSchema } from "joi";
import { ContinentRequestModel } from "../models/continentRequestModel";

export const continentSchemas: {
    create: {
        body: ObjectSchema<ContinentRequestModel>;
    };
    update: {
        body: ObjectSchema<ContinentRequestModel>;
    };
} = {
    create: {
        body: Joi.object<ContinentRequestModel>({
            name: Joi.string().trim().required().min(3).messages({
                "string.base": "Continent name must be a type of string",
                "string.empty": "Continent name cannot be empty",
                "string.min": "Continent name should have a minimum length of 3",
                "any.required": "Continent name is required",
            }),
            number: Joi.number().required().messages({
                "number.base": "Event number must be a number",
                "any.required": "Event number is required",
            }),
        }),
    },
    update: {
        body: Joi.object<ContinentRequestModel>({
            name: Joi.string().trim().min(3).messages({
                "string.base": "Continent name must be a type of string",
                "string.empty": "Continent name cannot be empty",
                "string.min": "Continent name should have a minimum length of 3",
            }),
            number: Joi.number().messages({
                "number.base": "Event number must be a number",
            }),
        })
        .min(1)
        .required()
        .messages({
            "object.min": "At least one attribute must be changed when updating",
            "any.required": "Update body is required",
        }),
    },
};

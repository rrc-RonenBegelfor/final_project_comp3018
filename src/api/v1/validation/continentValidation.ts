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
            continent_code: Joi.string().trim().required().max(2).min(2).messages({
                "string.base": "Continent code must be a type of string",
                "string.empty": "Continent code cannot be empty",
                "string.min": "Continent code should have a minimum length of 2",
                "string.max": "Continent code should have a maximum length of 2",
                "any.required": "Continent code is required",
            }),
        })
        .max(2)
        .min(2)
        .unknown(false)
    },
    update: {
        body: Joi.object<ContinentRequestModel>({
            number: Joi.array().items({
                human: Joi.number().messages({
                    "string.base": "Event date must be a string",
                    "string.empty": "Event date cannot be empty",
                }),
                natural: Joi.number().messages({
                    "string.base": "Event type must be a string",
                    "string.empty": "Event type cannot be empty",
                }),
                human_natural: Joi.number().messages({
                    "string.base": "Event description must be a string",
                    "string.empty": "Event description cannot be empty",
                }),
            }),
        })
        .min(1)
        .required()
        .unknown(false)
        .messages({
            "object.min": "At least one attribute must be changed when updating",
            "any.required": "Update body is required",
        }),
    },
};

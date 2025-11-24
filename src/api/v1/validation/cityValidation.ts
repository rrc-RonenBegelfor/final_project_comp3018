import Joi, { ObjectSchema } from "joi";
import { CityRequestModel } from "../models/cityRequestModel";

export const citySchemas: {
    create: {
        body: ObjectSchema<CityRequestModel>;
    };
    update: {
        body: ObjectSchema<CityRequestModel>;
    };
    query: {
        params: ObjectSchema;
    };
} = {
    create: {
        body: Joi.object<CityRequestModel>({
            countryId: Joi.string().trim().min(2).required().messages({
                "string.base": "CountryId must be a string",
                "string.empty": "CountryId cannot be empty",
                "string.min": "CountryId should have at least 2 characters",
            }),
            name: Joi.string().trim().required().min(4).messages({
                "string.base": "City name must be a type of string",
                "string.empty": "City name cannot be empty",
                "string.min": "City name should have a minimum length of 4",
                "any.required": "City name is required",
            }),
            date: Joi.string().trim().required().messages({
                "string.base": "Date must be a string",
                "string.empty": "Date cannot be empty",
                "any.required": "Date is required",
            }),
            type: Joi.string().trim().required().messages({
                "string.base": "Event type must be a type of string",
                "string.empty": "Event type cannot be empty",
                "any.required": "Event type is required",
            }),
            description: Joi.string().trim().required().messages({
                "string.base": "Description must be a type of string",
                "string.empty": "Description cannot be empty",
                "any.required": "Description is required",
            }),
            damage: Joi.string().trim().required().messages({
                "string.base": "Damage must be a type of string",
                "string.empty": "Damage cannot be empty",
                "any.required": "Damage is required",
            }),
            resolution: Joi.string().trim().required().messages({
                "string.base": "Resolution must be a type of string",
                "string.empty": "Resolution cannot be empty",
                "any.required": "Resolution is required",
            }),
        }),
    },
    update: {
        body: Joi.object<CityRequestModel>({
            countryId: Joi.string().trim().min(2).optional().messages({
                "string.base": "CountryId must be a string",
                "string.empty": "CountryId cannot be empty",
                "string.min": "CountryId should have at least 2 characters",
            }),
            name: Joi.string().trim().min(4).messages({
                "string.base": "City name must be a type of string",
                "string.empty": "City name cannot be empty",
                "string.min": "City name should have a minimum length of 4",
            }),
            date: Joi.string().trim().messages({
                "string.base": "Date must be a string",
                "string.empty": "Date cannot be empty",
            }),
            type: Joi.string().trim().messages({
                "string.base": "Event type must be a type of string",
                "string.empty": "Event type cannot be empty",
            }),
            description: Joi.string().trim().messages({
                "string.base": "Description must be a type of string",
                "string.empty": "Description cannot be empty",
            }),
            damage: Joi.string().trim().messages({
                "string.base": "Damage must be a type of string",
                "string.empty": "Damage cannot be empty",
            }),
            resolution: Joi.string().trim().messages({
                "string.base": "Resolution must be a type of string",
                "string.empty": "Resolution cannot be empty",
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
    query: {
        params: Joi.object({
            countryId: Joi.string().trim().min(2).optional().messages({
                "string.base": "CountryId must be a string",
                "string.empty": "CountryId cannot be empty",
                "string.min": "CountryId should have at least 2 characters",
            }),
        }),
    },
};
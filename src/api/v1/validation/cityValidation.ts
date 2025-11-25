import Joi, { ObjectSchema } from "joi";
import { CityRequestModel } from "../models/cityRequestModel";

/**
 * @openapi
 * components:
 *   schemas:
 *     CityRequest:
 *       type: object
 *       required:
 *         - countryId
 *         - name
 *         - date
 *         - type
 *         - description
 *         - damage
 *         - resolution
 *       properties:
 *         countryId:
 *           type: string
 *           description: ID of the country the city belongs to
 *           example: "UK"
 *         name:
 *           type: string
 *           minLength: 4
 *           example: "London"
 *         date:
 *           type: string
 *           format: date
 *           example: "2023-10-01"
 *         type:
 *           type: string
 *           example: "natural"
 *         description:
 *           type: string
 *           example: "Severe flooding in the downtown area"
 *         damage:
 *           type: string
 *           example: "high"
 *         resolution:
 *           type: string
 *           example: "Evacuation and relief efforts underway"
 *
 *     CityUpdateRequest:
 *       type: object
 *       description: Must include at least one updatable field.
 *       properties:
 *         countryId:
 *           type: string
 *           minLength: 2
 *         name:
 *           type: string
 *           minLength: 4
 *         date:
 *           type: string
 *           format: date
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         damage:
 *           type: string
 *         resolution:
 *           type: string
 *
 *     City:
 *       allOf:
 *         - $ref: '#/components/schemas/CityRequest'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "DaRVXicS82x7alS1yPk8"
 *
 *     ValidationError:
 *       type: object
 *       required:
 *         - error
 *         - message
 *       properties:
 *         error:
 *           type: string
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "name"
 *               issue:
 *                 type: string
 *                 example: "City name should have a minimum length of 4"
 */
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
            date: Joi.date().iso().required().messages({
                "date.base": "Date must be a string",
                "date.empty": "Date cannot be empty",
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
            date: Joi.date().iso().messages({
                "date.base": "Date must be a string",
                "date.empty": "Date cannot be empty",
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
import Joi, { ObjectSchema } from "joi";
import { CountryRequestModel } from "../models/countryRequestModel";

/**
 * @openapi
 * components:
 *   schemas:
 *     CountryEvent:
 *       type: object
 *       required:
 *         - date
 *         - type
 *         - description
 *         - damage
 *         - resolution
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: ISO date of the event
 *           example: "2024-05-20T00:00:00.000Z"
 *         type:
 *           type: string
 *           description: Type of event (e.g., human-made, natural, etc.)
 *           example: "natural"
 *         description:
 *           type: string
 *           description: Description of the event
 *           example: "Severe flooding affected the northern region."
 *         damage:
 *           type: string
 *           description: Severity of damage caused by the event
 *           example: "high"
 *         resolution:
 *           type: string
 *           description: Actions taken to resolve or mitigate the event
 *           example: "Evacuations completed and repairs initiated."
 *     CountryRequest:
 *       type: object
 *       required:
 *         - continentId
 *         - name
 *         - data
 *       properties:
 *         continentId:
 *           type: string
 *           minLength: 2
 *           description: ID of the continent the country belongs to
 *           example: "continent_01abc"
 *         name:
 *           type: string
 *           minLength: 3
 *           description: Name of the country
 *           example: "Japan"
 *         data:
 *           type: array
 *           minItems: 5
 *           description: List of major events associated with the country
 *           items:
 *             $ref: '#/components/schemas/CountryEvent'
 *     Country:
 *       allOf:
 *         - $ref: '#/components/schemas/CountryRequest'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Unique identifier for the country
 *               example: "country_456xyz"
 *           required:
 *             - id
 *     CountryQuery:
 *       type: object
 *       properties:
 *         continentId:
 *           type: string
 *           minLength: 2
 *           description: Optional filter by continent ID
 *           example: "continent_01abc"
 *     ValidationError:
 *       type: object
 *       required:
 *         - error
 *         - message
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or code
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           description: Human-readable error message
 *           example: "Validation failed"
 *         details:
 *           type: array
 *           description: Detailed validation errors
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "name"
 *               issue:
 *                 type: string
 *                 example: "Country name should have a minimum length of 3"
 */
export const countrySchemas: {
    create: {
        body: ObjectSchema<CountryRequestModel>;
    };
    update: {
        body: ObjectSchema<CountryRequestModel>;
    };
    query: {
        params: ObjectSchema;
    };
} = {
    create: {
        body: Joi.object<CountryRequestModel>({
            continentId: Joi.string().trim().min(2).required().messages({
                "string.base": "ContinentId must be a string",
                "string.empty": "ContinentId cannot be empty",
                "string.min": "ContinentId should have at least 2 characters",
            }),
            name: Joi.string().trim().required().min(3).messages({
                "string.base": "Country name must be a type of string",
                "string.empty": "Country name cannot be empty",
                "string.min": "Country name should have a minimum length of 3",
                "any.required": "Country name is required",
            }),
            data: Joi.array()
                .items(
                    Joi.object({
                        date: Joi.date().iso().required().messages({
                            "date.base": "Event date must be a string",
                            "date.empty": "Event date cannot be empty",
                            "any.required": "Event date is required",
                        }),
                        type: Joi.string().trim().required().messages({
                            "string.base": "Event type must be a string",
                            "string.empty": "Event type cannot be empty",
                            "any.required": "Event type is required",
                        }),
                        description: Joi.string().trim().required().messages({
                            "string.base": "Event description must be a string",
                            "string.empty": "Event description cannot be empty",
                            "any.required": "Event description is required",
                        }),
                        damage: Joi.string().trim().required().messages({
                            "string.base": "Event damage must be a string",
                            "string.empty": "Event damage cannot be empty",
                            "any.required": "Event damage is required",
                        }),
                        resolution: Joi.string().trim().required().messages({
                            "string.base": "Event resolution must be a string",
                            "string.empty": "Event resolution cannot be empty",
                            "any.required": "Event resolution is required",
                        }),
                    })
                )
                .min(5)
                .required()
                .messages({
                    "array.base": "Data must be an array of events",
                    "array.min": "At least five events or more are required",
                    "any.required": "Data is required",
                }),
        })
        .unknown(false),
    },
    update: {
        body: Joi.object<CountryRequestModel>({
            name: Joi.string().trim().min(3).optional().messages({
                "string.base": "Country name must be a type of string",
                "string.empty": "Country name cannot be empty",
                "string.min": "Country name should have a minimum length of 3",
            }),
            data: Joi.array()
                .items(
                    Joi.object({
                        date: Joi.string().trim().messages({
                            "string.base": "Event date must be a string",
                            "string.empty": "Event date cannot be empty",
                        }),
                        type: Joi.string().trim().messages({
                            "string.base": "Event type must be a string",
                            "string.empty": "Event type cannot be empty",
                        }),
                        description: Joi.string().trim().messages({
                            "string.base": "Event description must be a string",
                            "string.empty": "Event description cannot be empty",
                        }),
                        damage: Joi.string().trim().messages({
                            "string.base": "Event damage must be a string",
                            "string.empty": "Event damage cannot be empty",
                        }),
                        resolution: Joi.string().trim().messages({
                            "string.base": "Event resolution must be a string",
                            "string.empty": "Event resolution cannot be empty",
                        }),
                    })
                ).min(5)
                .messages({
                    "array.base": "Data must be an array of events",
                    "array.min": "At least five events or more are required",
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
            continentId: Joi.string().trim().min(2).optional().messages({
                "string.base": "ContinentId must be a string",
                "string.empty": "ContinentId cannot be empty",
                "string.min": "ContinentId should have at least 2 characters",
            }),
        }),
    },
};

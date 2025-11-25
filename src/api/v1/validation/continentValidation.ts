import Joi, { ObjectSchema } from "joi";
import { ContinentRequestModel } from "../models/continentRequestModel";

/**
 * @openapi
 * components:
 *   schemas:
 *     ContinentRequest:
 *       type: object
 *       required:
 *         - name
 *         - continent_code
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           description: Full name of the continent
 *           example: "Africa"
 *         continent_code:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *           description: ISO-style two-letter continent code
 *           example: "AF"
 *     Continent:
 *       allOf:
 *         - $ref: '#/components/schemas/ContinentRequest'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Unique identifier for the continent
 *               example: "continent_01abc"
 *           required:
 *             - id
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
 *                 example: "continent_code"
 *               issue:
 *                 type: string
 *                 example: "Continent code should have a maximum length of 2"
 */
export const continentSchemas: {
    create: {
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
};

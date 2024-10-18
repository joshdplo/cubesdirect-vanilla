import Joi from 'joi';

/**
 * Extracts specific fields from a Joi schema.
 * @param {Joi.ObjectSchema} schema - the original Joi schema
 * @param {Array<string>} fields - array of field names to extract
 * @returns {Joi.ObjectSchema} - New schema with only the extracted fields
 */

export default function extractFields(schema, fields) {
  try {
    return fields.reduce((extractedSchema, field) => {
      const fieldSchema = schema.extract([field]); // extract the field schema
      return extractedSchema.keys({ [field]: fieldSchema }); // Merge into the new schema
    }, Joi.object()); // start with empty Joi schema
  } catch (error) {
    console.error(`Error extracting fields:`, error);
    throw new Error(`Failed to extract schema fields: ${error.message}`);
  }
}
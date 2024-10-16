import Joi from 'joi';

/**
 * Validate form data against Joi schemas
 * @returns { value, errors }
 */
export async function validateForm(schema, data) {
  try {
    const value = await schema.validateAsync(data, { abortEarly: false }); // validate all fields
    return { value, errors: null };
  } catch (error) {
    const errors = error.details.reduce((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});

    return { value: null, errors };
  }
}

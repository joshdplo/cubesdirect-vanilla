export default async (schema, value, isNullable = false) => {
  if (value === null || value === undefined) {
    if (!isNullable) throw new Error('Field cannot be null or empty!');
    return;
  }

  const field = Object.keys(value)[0]; // get the field name being validated

  try {
    // use fork to mark other fields as optional for this validation
    const partialSchema = schema.fork(
      Object.keys(schema.describe().keys), (s) => s.optional()
    );

    const { error } = await partialSchema.validateAsync(value, { context: { field } });

    if (error) {
      console.error(`Error in validateModel:`, error);
      throw new Error(error.details[0].message);
    }
  } catch (error) {
    console.error(`Validation error:`, error);
    throw new Error(`Validation failed: ${error.message}`);
  }
}
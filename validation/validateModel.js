module.exports = async (schema, value, isNullable = false) => {
  if (value === null || value === undefined) {
    if (!isNullable) throw new Error('Field cannot be null or empty!');
    return;
  }

  const { error } = await schema.validateAsync(value);
  if (error) throw new Error(error.details[0].message);
}
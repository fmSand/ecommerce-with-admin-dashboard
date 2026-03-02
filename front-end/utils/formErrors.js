function mapFieldErrors(details) {
  if (!Array.isArray(details)) return {};
  const errors = {};
  for (const d of details) {
    if (d.field && d.message && !errors[d.field]) {
      errors[d.field] = d.message;
    }
  }
  return errors;
}

function mapFormError(details) {
  if (!Array.isArray(details) || details.length === 0) return null;
  const count = details.length;
  return `Please fix ${count} field error${count !== 1 ? "s" : ""} below before continuing.`;
}

module.exports = { mapFieldErrors, mapFormError };

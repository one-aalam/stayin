module.exports = exports = function createdAttrPlugin (schema, options) {
  schema.add(
    {
      created: {
        type: Date,
        default: Date.now
      }
    }
  );

  if (options && options.index) {
    schema.path('created').index(options.index);
  }
}
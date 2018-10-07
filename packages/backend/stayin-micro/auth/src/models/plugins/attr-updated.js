module.exports = exports = function updatedAttrPlugin (schema, options) {
  schema.add(
    {
      updated: {
        type: Date,
        default: Date.now
      }
    }
  );

  schema.pre('save', function (next) {
    this.updated = new Date();
    next();
  });

  if (options && options.index) {
    schema.path('updated').index(options.index);
  }
}
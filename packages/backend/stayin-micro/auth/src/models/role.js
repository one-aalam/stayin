const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose); // extend with JSON schema
const createdAttrPlugin = require('./plugins/attr-created');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20
    },
    description: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      default: ''
    },
    type: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
      default: ''
    },
  }
);

RoleSchema.plugin(createdAttrPlugin);

exports.Role = mongoose.model('Role', RoleSchema, 'users_role');
exports.RoleJsonSchema = RoleSchema.jsonSchema();
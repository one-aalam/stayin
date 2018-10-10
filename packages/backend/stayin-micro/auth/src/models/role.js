const mongoose = require('mongoose');
const Joi = require('joi');
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

const RoleValidationSchema = Joi.object({
  name: Joi.string().alphanum().min(4).max(20).required(),
  type: Joi.string().alphanum().min(4).max(20).required(),
});

RoleSchema.pre('save', function(next) {
  this.type = this.type ? this.type : this.name.toLowerCase();
  next();
});

RoleSchema.plugin(createdAttrPlugin);

exports.Role = mongoose.model('Role', RoleSchema, 'users_role');
exports.RoleValidationSchema = RoleValidationSchema;

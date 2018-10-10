const validator = require('micro-joi');

const UserSchema                      = require('../../models/user').UserValidationSchema;
const RoleSchema                      = require('../../models/role').RoleValidationSchema;

module.exports = {
  validateUserInput: validator(UserSchema),
  validateRoleInput: validator(RoleSchema)
};
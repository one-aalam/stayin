const mongoose = require('mongoose');
const createdAttrPlugin = require('./plugins/attr-created');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Role = new Schema(
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
      minlength: 4,
      maxlength: 20,
      default: ''
    },
  }
);

Role.plugin(createdAttrPlugin);

exports.Role = mongoose.model('Role', Role, 'users_role');
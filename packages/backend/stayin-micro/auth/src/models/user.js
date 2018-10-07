const mongoose = require('mongoose');
const createdAttrPlugin = require('./plugins/attr-created');
const updatedAttrPlugin = require('./plugins/attr-updated');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: ObjectId,
      ref: 'Role',
      default: null
    }
  }
);

User.plugin(createdAttrPlugin);
User.plugin(updatedAttrPlugin, { index: true });

exports.User = mongoose.model('User', User, 'users_user');
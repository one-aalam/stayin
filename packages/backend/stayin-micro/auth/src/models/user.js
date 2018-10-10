const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const createdAttrPlugin = require('./plugins/attr-created');
const updatedAttrPlugin = require('./plugins/attr-updated');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema(
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
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: ObjectId,
      ref: 'Role',
      default: null
    }
  }
);

// UserSchema.set('toJSON', {
//   transform: function(doc, ret, opt) {
//       delete ret['updated'];
//       delete ret['confirmed'];
//       return ret
//   }
// });

const UserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(5).max(50).required(),
  email: Joi.string().email({ minDomainAtoms: 2 }),
  password: new PasswordComplexity(),
});

UserSchema.statics.findByUsername = function(username, callback) {
  return this.find({ username }, callback);
}

UserSchema.statics.findById = function(id, callback) {
  return this.findOne({ _id: id }, callback);
}

UserSchema.plugin(createdAttrPlugin);
UserSchema.plugin(updatedAttrPlugin, { index: true });


exports.User = mongoose.model('User', UserSchema, 'users_user');
exports.UserValidationSchema = UserValidationSchema;
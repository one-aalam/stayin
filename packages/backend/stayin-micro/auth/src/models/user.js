const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose); // extend with JSON schema
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

UserSchema.statics.findByUsername = (username, callback) => {
  this.findOne({ username }, callback);
}

UserSchema.statics.findById = (id, callback) => {
  this.findOne({ _id: id }, callback);
}

UserSchema.plugin(createdAttrPlugin);
UserSchema.plugin(updatedAttrPlugin, { index: true });

exports.User = mongoose.model('User', UserSchema, 'users_user');
exports.UserJsonSchema = UserSchema.jsonSchema();
'use strict';
const mongoose   = require('mongoose');
const User      = mongoose.model('User');
const Role      = mongoose.model('Role');
const { hashSync } = require('bcrypt');
const utils = require('../utils');

const onResp = (err, result) => {
    if(err) return err;
    return result;
};

exports.find = async (filters = {}) => await User.find(filters, onResp).select('-password -updated');

exports.update = async (user) => await User.findOneAndUpdate({_id: user._id}, user, { upsert: true, new: true }).exec();

exports.create = async (payload) => await new User({
    ...payload,
    password: hashSync(payload.password, 2)
}).save();
// Incorporate: utils.validateModel(err);

exports.delete = async(userId) => await User.remove({ _id: userId }, onResp);

// Additional helpers
exports.findById = async (userId) => await User.findById(userId);
exports.findByUsername = async (username) => await User.findByUsername(username);

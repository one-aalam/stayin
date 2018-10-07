const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true
};
mongoose.connect(process.env.MONGODB, options);
// Load models
require('../models/user');
require('../models/role');

module.exports = mongoose;
require('dotenv').config()
// Bootstrap DB
require('./db');

const routes   = require('./routes/v1/routes');
module.exports = routes;

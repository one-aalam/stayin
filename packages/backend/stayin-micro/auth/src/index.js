require('dotenv').config()
// Bootstrap DB
require('./db');

// Necessary exception traps

process.on('uncaughtException', ex => {
  console.log(ex.message, ex);
  process.exit(1);
});
process.on('unhandledRejection', ex => {
  console.log(ex.message, ex);
  process.exit(1);
});

const routes   = require('./routes/v1/routes');
module.exports = routes;

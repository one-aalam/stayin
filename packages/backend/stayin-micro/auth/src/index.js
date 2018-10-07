require('dotenv').config()
// module.exports = async () => {
//   return 'Hello, world'
// }

const routes   = require('./routes/v1/routes');
module.exports = routes;

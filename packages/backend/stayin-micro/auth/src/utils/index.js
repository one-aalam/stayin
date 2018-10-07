const { send, createError }     = require('micro');
const { verify }                = require('jsonwebtoken');

exports.validateModel = (err) => {
  const errorAttrs = Object.keys(err.errors);
  const errorResponse = errorAttrs.reduce((responseErr, error) => {
      responseErr[error] = err.errors[error]['message'];
      return responseErr;
  }, {});
  return errorResponse;
  };

exports.decode = (req) => {
  const token = req.headers['x-auth-token'];
  if(!token) {
    throw createError('401', 'Access denied. No token provided.');
  }
  try {
    return verify(token, process.env.SECRET);
  } catch (ex) {
    throw createError('400', 'Invalid token.');
  }
}

  exports.execOrErr = (fn) => async (req, res) => {
    try {
      return await fn(req, res)
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' &&
        err.stack) {
        console.error(err.stack)
      }
      send(res, err.statusCode || 500, {
        error: true,
        message: err.message
      })
    }
  };

  exports.canAccess = (fn) => async (req, res) => {
    const user = this.decode(req, res);
    if (user !== null && user !== undefined) {
      return await fn(req, res)
    }
    throw createError('401', 'Invalid token.'); // or a 404 to prevent information leakage (https://stackoverflow.com/questions/9220432/http-401-unauthorized-or-403-forbidden-for-a-disabled-user)
  };

  exports.ifIdConforms = (fn) => async (req, res) => {
    if(req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return await fn(req, res);
    }
    throw createError('404', 'Not found');
  }


  exports.applyMiddleware = (service, middlewares = []) => {
    return middlewares.reduce(
      (fn, nextMiddleware) => nextMiddleware(fn),
      service
    )
  };

const { json, send } = require('micro');
const Ajv = require('ajv');
const ajv = new Ajv();

module.exports = exports = (schema, { putBodyInReq = false, errorMsg } = {}) => handler => {
  if (!schema) {
    throw Error('JSON schema not provided');
  }

  if (!handler || typeof handler !== 'function') {
    throw Error('function/handler of form fn(req, res) not provided.');
  }

  return async (req, res) => {

    const body = await getJSONBody(req);
    if (body) {
      const valid = ajv.validate(schema, body);
      if (!valid) {
        return send(res, 400, errorMsg || ajv.errors);
      }

      if (putBodyInReq) {
        req.body = body;
      }
    }

    return handler(req, res);
  };
};

const getJSONBody = async req => {
  try {
    return await json(req);
  } catch (err) {
    return null;
  }
};
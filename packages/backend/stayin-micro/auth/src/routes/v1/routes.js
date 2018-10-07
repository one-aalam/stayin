const { send, json, createError }     = require('micro');
const { router, get, post, del, put } = require('microrouter');
const { sign }                        = require('jsonwebtoken');
const { compareSync }                 = require('bcrypt');
const rateLimit                       = require('micro-ratelimit');
const cors                            = require('micro-cors')();
// Bootstrap
const { secret }                      = require('../../config');
const database                        = require('../../db');
const modelUser                          = require('../../models/user');
const modelRole                          = require('../../models/role');
// middleware, sort of ...
const {
  execOrErr,
  canAccess,
  ifIdConforms
}                                     = require('../../utils');
// User service
const userSvc                         = require('../../service').user;

// USER
const hello = rateLimit({window: 5000, limit: 2}, (req, res) => {
  send(res, 200, `Hello, ${req.params.who}`);
});

const notFound = (req, res) => {
  send(res, 404, 'Endpoint not found');
};

const attempt = async (username, password) => {
  const users = await userSvc.findByUsername(username);
  if (!users.length) {
    throw createError(401, 'That user does not exist');
  }
  const user = users[0];
  if (!compareSync(password, user.password)) {
    throw createError(401, 'Wrong password');
  }
  return user;
};

const auth = ({ username, password }) => attempt(username, password).then(
  ({ id }) => {
    const token = sign(id, secret);
    return { token };
  }
);

const users = async (req, res) => {
  const users = await userSvc.find();
  send(res, 200, users);
};

const userById = async (req, res) => {
  const user = await userSvc.findById(await req.params.id);
  send(res, 200, user);
};

const updateUser = async (req, res) => {
  const user = await userSvc.update(await json(req));
  send(res, 200, user);
};

const createUser = async (req, res) => {
  const user = await userSvc.create(await json(req));
  send(res, 201, user);
};

const delUser = async (req, res) => {
  const user = await userSvc.delete(await req.params.id);
  send(res, 200, user.result);
};

const userLogin = async (req, res) => {
  const { token } = await auth(await json(req));
  res.setHeader('x-auth-token', token);
  send(res, 200, { token });
};

const userSetup = async (req, res) => {
  const user = await userSvc.setup();
  send(res, 200, user);
};

module.exports = cors(router(
    get('/hello/:who', hello),

    // GET
    get('/users', execOrErr(canAccess(users))),
    get('/users/:id', execOrErr(ifIdConforms(userById))),
    // POST
    post('/users', createUser),
    // DELETE
    del('/users/:id', delUser),
    // PUT
    put('/users/:id', updateUser),

    // SEED
    get('/setup', userSetup),

    // AUTH
    post('/login', userLogin),

    get('/*', notFound),
));
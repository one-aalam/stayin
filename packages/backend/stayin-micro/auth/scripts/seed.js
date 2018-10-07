const mongoose = require('mongoose');
// Import models
require('../src/db');
const User      = mongoose.model('User');
const Role      = mongoose.model('Role');
const UserSvc = require('../src/service/user');

// Importing the Data to populate the db.
let roles = [
  {
    name: 'Administrator',
    type: 'root',
    description: 'These users have all access in the project.'
  },
  {
    name: 'Authenticated',
    type: 'authenticated',
    description: 'Default role given to authenticated user.'
  },
  {
    name: 'Public',
    type: 'public',
    description: 'Default role given to unauthenticated user.'
  },
];

mongoose.connection.on('open',() => {
  mongoose.connection.db.dropDatabase(() => {
    console.log('Database dropped');
  });

  let roleOps = [];
  roles.forEach((book) => {
    roleOps.push(saveRoleAsync(book));
  });

  Promise.all(roleOps).then(() => {
    console.log('Finding root role');
    Role.findOne({ type: 'root' }, (err, role) => {
      console.log('Creating first user with superadmin role');
      UserSvc.create({
        username: 'admin',
        email: 'admin@somemail.com',
        password: 'password',
        role: role._id
      }).then((user) => {
        console.log('created:', user);
        mongoose.connection.close(() => {
          console.log('Mongoose connection closed!');
        });
      });
    });
  });
});

// This function returns a Promise.
function saveRoleAsync(role) {
  return new Promise((resolve, reject) => {
      new Role(role).save((err) => {
          if (err)
              reject(err);
          else
              resolve();
      })
  });
}

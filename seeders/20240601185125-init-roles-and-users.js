'use strict';
const  bcry = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert roles
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Fetch the role IDs
    const roles = await queryInterface.sequelize.query(
      `SELECT id from roles;`
    );

    // console.log(JSON.stringify(roles[0], null, 2));

    const hashedPassword = await bcry.hash('password', 12);


    // Insert users
    await queryInterface.bulkInsert('users', [
      {
        firstname: 'Onyekachi',
        lastname: 'Onochie-okeke',
        email: 'onochie.okeke.onyekachi@gmail.com',
        password: hashedPassword,
        roleId: 1,
        imageId: null,
        token: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};

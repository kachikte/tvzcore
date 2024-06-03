const Sequelize = require('sequelize')

const sequelize = new Sequelize('tvz', 'root', 'password', {dialect: 'mysql', host: 'localhost', logging: (msg) => console.log(msg) // Enable detailed logging
}, )

// const sequelize = new Sequelize('postgres://root:password@hostname:3333/tvz')

module.exports = sequelize

// const Sequelize = require('sequelize')
// const constants = require('../utils/constants')

// const sequelize = new Sequelize(constants.dbName, constants.dbUsername, constants.dbPassword, {dialect: 'mysql', host: 'localhost'})

// module.exports = sequelize
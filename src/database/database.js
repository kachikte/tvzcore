const dotenv = require('dotenv')
dotenv.config()
const Sequelize = require('sequelize')
const { DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT, DB_HOST} = process.env
console.log(process.env)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {dialect: DB_DIALECT, host: DB_HOST, logging: (msg) => console.log(msg) // Enable detailed logging
}, )

// const sequelize = new Sequelize('postgres://root:password@hostname:3333/tvz')

module.exports = sequelize

// const Sequelize = require('sequelize')
// const constants = require('../utils/constants')

// const sequelize = new Sequelize(constants.dbName, constants.dbUsername, constants.dbPassword, {dialect: 'mysql', host: 'localhost'})

// module.exports = sequelize
const Sequelize = require('sequelize')

const sequelize = require('../database/database')

const UserImage = sequelize.define('userimage', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    filename: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    mimeType: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    data: {
        type: Sequelize.BLOB('long'),
        allowNull: false,
    }
}, {
    tableName: 'userimages',
    timestamps: true
})

module.exports = UserImage
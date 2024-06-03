const Sequelize = require('sequelize')

const sequelize = require('../database/database')

const CodeAttempt = sequelize.define('codeattempt', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
      type: Sequelize.TEXT,
      allowNull: true
  },
  output: {
      type: Sequelize.TEXT,
      allowNull: true
  },
  coutput: {
    type: Sequelize.TEXT,
    allowNull: true
},
  result: {
      type: Sequelize.STRING,
      allowNull: true
  },
  problemId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userEmail: {
    type: Sequelize.STRING,
    allowNull: false
  },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
}, {
    tableName: 'codeattempts'
  });

module.exports = CodeAttempt
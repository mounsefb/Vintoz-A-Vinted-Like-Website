const Sequelize = require('sequelize')
const db = require('./database.js')
const messages = db.define('messages', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  content: {
    type: Sequelize.STRING(128),
    // validate: {
    //   is: /^[a-z\-'\s]{1,128}$/i
    // }
  },
  gid: {
    // primaryKey: true,
    type: Sequelize.INTEGER,
  },
  uid: {
    // primaryKey: true,
    type: Sequelize.INTEGER,
  }
}, { timestamps: false })
module.exports = messages
const Sequelize = require('sequelize')
const db = require('./database.js')
const user_group = db.define('user_group', {
  member_id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  groupId: {
    primaryKey: true,
    type: Sequelize.INTEGER,
  }
}, { timestamps: false })
module.exports = user_group
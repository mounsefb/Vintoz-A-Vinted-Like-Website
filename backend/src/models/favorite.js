const Sequelize = require('sequelize')
const db = require('./database.js')
const favorites = db.define('favorites', {
  memberId: {
    // primaryKey: true,
    type: Sequelize.INTEGER,
  },
  postId: {
    // primaryKey: true,
    type: Sequelize.INTEGER,
  }
}, { timestamps: false })

module.exports = favorites
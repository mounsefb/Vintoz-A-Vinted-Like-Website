const Sequelize = require('sequelize')
const db = require('./database.js')
const category_post = db.define('category_post', {
  categoryId: {
    // primaryKey: true,
    type: Sequelize.INTEGER,
  },
  postId: {
    // primaryKey: true,
    type: Sequelize.INTEGER,
  }
}, { timestamps: false })
module.exports = category_post
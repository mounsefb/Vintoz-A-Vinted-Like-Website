const Sequelize = require('sequelize')
const db = require('./database.js')
const posts = require('./post.js')
const category_post = require('./category_post.js')
const categories = db.define('categories', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(128),
        validate: {
            is: /^[a-z\-'\s]{1,128}$/i
        }
    },
}, { timestamps: false })

// categories.belongsToMany(posts, { through: category_post });
// posts.belongsToMany(categories, { through: category_post });

module.exports = categories
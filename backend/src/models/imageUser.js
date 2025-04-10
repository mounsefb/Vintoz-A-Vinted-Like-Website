const Sequelize = require('sequelize')
const db = require('./database.js')
const imageUsersUser = db.define('imageUsersUser', {
    userId :{
        type : Sequelize.INTEGER,
        unique : true,
    },
    data: {
        type: Sequelize.STRING,
    },
}, { timestamps: false, createdAt : true, updateAt : true})
module.exports = imageUsersUser

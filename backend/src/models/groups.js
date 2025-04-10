const Sequelize = require('sequelize')
const db = require('./database.js')
const offer = require('./offer.js'); 
const groups = db.define('groups', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(128),
    // validate: {
    //   is: /^[a-z\-'\s]{1,128}$/i
    // }
  },
  ownerId: {
    type: Sequelize.INTEGER,
  },

  // articleId :{
  //   type: Sequelize.INTEGER,
  // }
}, { timestamps: false });

// groups.hasMany(offer, { foreignKey: 'groupId' });

module.exports = groups

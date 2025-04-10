const Sequelize = require('sequelize');
const db = require('./database.js');
const favorites = require('./favorite.js');
const offers = require('./offer.js');


const posts = db.define('posts', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  postImage:{
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING(128),
  },
  description: {
    type: Sequelize.STRING(128),
  },
  price: {
    type: Sequelize.INTEGER,
  },
  ownerId: {
    type: Sequelize.INTEGER,
  }
}, { timestamps: false });

posts.hasMany(favorites, { foreignKey: 'postId' }); // Une publication peut avoir plusieurs favoris
favorites.belongsTo(posts, { foreignKey: 'postId' }); // Un favori appartient à une publication
posts.hasMany(offers, { foreignKey: 'postId' }); // Une publication peut avoir plusieurs favoris
offers.belongsTo(posts, { foreignKey: 'postId' }); // Un favori appartient à une publication

module.exports = posts;

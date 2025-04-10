const Sequelize = require('sequelize');
const db = require('./database.js');
const posts = require('./post.js'); // Assurez-vous d'avoir le bon chemin d'accès au fichier post.js
const favorites = require('./favorite.js');
const offers = require('./offer.js');


const users = db.define('users', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  profilePic: {
    type : Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING(128),
    validate: {
      is: /^[a-zA-Z0-9\-'\s]{1,128}$/i
    }
  },
  email: {
    type: Sequelize.STRING(128),
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passhash: {
    type: Sequelize.STRING(60),
    validate: {
      is: /^[0-9a-z\\/$.]{60}$/i
    }
  },
  solde :{
    type: Sequelize.NUMBER,
    defaultValue : 0
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
}, { timestamps: false });

users.hasMany(posts, { foreignKey: "ownerId" }); // users a plusieurs posts avec ownerId comme clé étrangère
posts.belongsTo(users, { foreignKey: "ownerId" }); // Un post appartient à un utilisateur avec ownerId comme clé étrangère

users.hasMany(favorites, { foreignKey: 'memberId' }); // Un utilisateur peut avoir plusieurs favoris
favorites.belongsTo(users, { foreignKey: 'memberId' }); // Un favori appartient à un utilisateur

users.hasMany(offers, { foreignKey: "userId" }); // users a plusieurs posts avec ownerId comme clé étrangère
offers.belongsTo(users, { foreignKey: "userId" }); // Un post appartient à un utilisateur avec ownerId comme clé étrangère

module.exports = users;

const fs = require('fs');
const path = require('path');

const userModel = require('../models/user.js')
const postModel = require('../models/post.js')
const favoriteModel = require('../models/favorite.js')
const categoryModel = require('../models/category.js')
const categoryPostModel = require('../models/category_post.js')
const groupModel =require('../models/groups.js')
const userGroupModel =require('../models/user_group.js')
const messageModel =require('../models/messages.js')


// Chemin du dossier à analyser
const folderPath = path.join(__dirname, '../../Images', 'images');
let counterFile = 0;


// Fonction pour lister les contenus des dossiers filtrés
function listContents(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error('Erreur lors de la lecture du dossier:', err);
      return;
    }

    console.log(`Contenu de ${folder}:`);
    files.forEach(file => {
      counterFile ++;
      console.log(counterFile)
      console.log(file);
    });
  });
}

fs.readdir(folderPath, (err, items) => {
  if (err) {
    console.error('Erreur lors de la lecture du dossier:', err);
    return;
  }

  // Filtrer les dossiers contenant le mot "homme" dans leur nom
  items.forEach(item => {
    const itemPath = path.join(folderPath, item);
    fs.stat(itemPath, (err, stats) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'élément:', err);
        return;
      }

      // Vérifier si l'élément est un dossier
      if (stats.isDirectory() && item.includes('homme')) {
        // Appeler la fonction pour lister les contenus du dossier
        listContents(itemPath);
      }
    });
  });

  console.log(counterFile)

});



const bcrypt = require('bcrypt');
// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  const passhash = await bcrypt.hash('123456', 2);
  console.log(passhash);
  const numUsers = 20; // Nombre d'utilisateurs à créer

  // Création de plusieurs utilisateurs
  for (let i = 1; i <= numUsers; i++) {
    await userModel.create({
      name: `Utilisateur ${i}`,
      email: `utilisateur${i}@exemple.com`,
      passhash,
      isAdmin: false, 
      profilePic :"Images/ViardotProfilePic.png"
    });
  }

  

  // Création d'un article aléatoire pour chaque utilisateur
  for (let i = 1; i <= numUsers; i++) {
    let postImageVar;
    //cate = homme
    if (i%3 == 0){
      postImageVar = "Images/images/Pantalon homme/cargo_marron.jpg";
    }
    //cate = femme
    if (i%3 == 1){
      postImageVar = "Images/images/Pantalon femme/cargo_beige.jpg";
    }
    //cate = accessoire
    if (i%3 == 2){
      postImageVar = "Images/images/accessoire homme/bague.jpg";
    }
    await postModel.create({
      title: `Article de l'utilisateur ${i}`,
      description: `Description de l'article de l'utilisateur ${i}`,
      price: Math.floor(Math.random() * 1000), // Prix aléatoire entre 0 et 999
      ownerId: i, // Chaque utilisateur possède son propre article
      postImage : postImageVar
    });
  }

  // Création de favoris pour certains utilisateurs (optionnel)
  for (let i = 1; i <= numUsers; i++) {
    if (i % 2 === 0) { // Ajoute un favori pour chaque deuxième utilisateur
      await favoriteModel.create({
        memberId: i , // Utilisateur avec l'ID i + 1
        postId: i // Article avec l'ID i + 1
      });
    }
  }

  // Création de catégories (optionnel)
  const categories = ['Homme', 'Femme', 'Accessoires'];

  for (const categoryName of categories) {
    await categoryModel.create({
      name: categoryName
    });
  }

  // Association des articles à des catégories (optionnel)
  // const numCategories = categories.length;
  for (let i = 1; i <= numUsers; i++) {
    await categoryPostModel.create({
      categoryId: i%3+1, // Catégorie avec l'ID i + 1
      postId: i // Article avec l'ID i + 1
    });
  }
})()

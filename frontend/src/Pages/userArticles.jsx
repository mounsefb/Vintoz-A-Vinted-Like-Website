// code pour la page d'accueil
import React, { useState, useEffect } from 'react';
import { CarteHabits, Prix,Taille, ImageHabits} from '../Design/CarteHabits';
import { Link } from 'react-router-dom';
import * as imgUtil from "../img/imgUtil";
import NavigationBar from '../Components/NavigationBar';
import { FormulaireAjoutPost, FormulaireModifierPost, FormulaireSuppressionPost } from "../Components/Formulaire";

function PageArticleUtilisateur() {
    const [posts, setPosts] = useState([]);
    const [showAddPostForm, setShowAddPostForm] = useState(false);
    const [showModifyPostForm, setShowModifyPostForm] = useState(false);
    const [showDeletePostForm, setShowDeletePostForm] = useState(false);


    const toggleAddPostForm = () => {
      setShowAddPostForm(!showAddPostForm);
      // Pour assurer que seul un formulaire est affiché à la fois 
    };

    const toggleModifyPostForm = () => {
      setShowModifyPostForm(!showModifyPostForm);
      // Pour assurer que seul un formulaire est affiché à la fois 
    };

    const toggleDeletePostForm = () => {
      setShowDeletePostForm(!showDeletePostForm);
      // Pour assurer que seul un formulaire est affiché à la fois 
    };

    const frontPage = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Attendre 100 millisecondes
        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/myitems', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token' : document.querySelector("#token").textContent
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return []; // Retourner un tableau vide en cas d'erreur
      }
    };

    
    useEffect(() => {
      frontPage()
        .then(response => {
          if (response.status && Array.isArray(response.data)) {
            console.log(response.data)
            setPosts(response.data);
          } else {
            console.error('Erreur lors de la récupération des données:', response.message);
          }
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));
    }, []);

  const renderPosts = () => {
    return posts.map((post, index) => (
    <CarteHabits key={index} style={{ marginRight: "2em", position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
      <Link to={{pathname: `/article/${post.id}`}}>
        <ImageHabits src={`https://vintoz.osc-fr1.scalingo.io/${post.postImage}`} />
      </Link>
      <Prix>{post.price}€</Prix>
      <Taille >{post.title}</Taille>
      <img
        src={imgUtil.modifyPic}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          maxWidth: "20px",
          cursor: "pointer",
        }}
        onClick={() => {
          const selectedItem = document.querySelector("#selectedItem");
          selectedItem.querySelector("#id").textContent = post.id;
          selectedItem.querySelector("#title").textContent = post.title;
          selectedItem.querySelector("#description").textContent = post.description;
          selectedItem.querySelector("#price").textContent = post.price;
          toggleModifyPostForm();
        }}
      />
      <img
        src={imgUtil.deleteImg}
        style={{
          position: "absolute",
          bottom: 0,
          right: 25,
          maxWidth: "20px",
          cursor: "pointer",
        }}
        onClick={() => {
          const selectedItem = document.querySelector("#selectedItem");
          selectedItem.querySelector("#id").textContent = post.id;
          selectedItem.querySelector("#title").textContent = post.title;
          selectedItem.querySelector("#description").textContent = post.description;
          selectedItem.querySelector("#price").textContent = post.price;
          toggleDeletePostForm();
        }}
      />
    </CarteHabits>
    ));
  };

    return (
      <>
        <NavigationBar/>
        <h2>Votre dressing : {posts.length} articles</h2>
        <div id="listPosts" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "3em", flexGrow: "1" }}>
          <CarteHabits style={{ marginRight: "2em", display: "flex", flexDirection: "column", alignItems: "flex-start" }} onClick={() => {toggleAddPostForm()}}>
            <ImageHabits src={imgUtil.plus}/>
          </CarteHabits>
          {renderPosts()}
        </div>
        
        {showAddPostForm && <FormulaireAjoutPost onClose={toggleAddPostForm} />}
        {showModifyPostForm && <FormulaireModifierPost onClose={toggleModifyPostForm} />}
        {showDeletePostForm && <FormulaireSuppressionPost onClose={toggleDeletePostForm} />}

      </>
      
    );

}

export default PageArticleUtilisateur;
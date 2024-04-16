// code pour la page d'accueil
import styled from "@emotion/styled";
import React, { useState, useEffect } from 'react';
import { CarteHabits, Prix, Marque, ImageHabits, CarteArticle, Taille } from '../Design/CarteHabits';
// import { SearchBar, SearchBarDiv } from '../Components/SearchBar';
import { Bouton, BoutonArticle } from '../Components/Bouton';
import { useParams } from 'react-router-dom';
import { NavBar } from '../Design/NavBar';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import * as imgUtil from "../img/imgUtil";
import NavigationBar from '../Components/NavigationBar';


function PageFavoriUtilisateur() {
    const [posts, setPosts] = useState([]);

    const frontPage = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100)); // Attendre 100 millisecondes
        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/myfavorites', {
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
        // console.log(data.data);
        return data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return []; // Retourner un tableau vide en cas d'erreur
      }
    };

    const deleteFav = async (postId) => {
      try {
          const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/myfavorites/${postId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': document.querySelector("#token").textContent
              }
          });
  
          if (!response.ok) {
              throw new Error('Erreur lors de la récupération des données');
          }
          const data = await response.json();
          window.location.reload();
          // return data;
      } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
          return [];
      }
  }


    useEffect(() => {
      frontPage()
        .then(response => {
          if (response.status && Array.isArray(response.data)) {
            setPosts(response.data);
          } else {
            console.error('Erreur lors de la récupération des données:', response.message);
          }
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));
    }, []);

  const renderPosts = () => {
    // console.log(posts)
    return posts.map((post, index) => (
      <CarteHabits key={index}  style={{ marginRight: "2em", display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom:"1em" }}>
        <Link to={{pathname: `/article/${post.post.id}`}}>
          <ImageHabits src={`https://vintoz.osc-fr1.scalingo.io/${post.post.postImage}`} />
        </Link>
        <Prix >{post.post.price}€</Prix>
        <Taille >{post.post.title}</Taille>
        <img
            src={imgUtil.heartPic}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              maxWidth: "20px",
              cursor: "pointer",
              display:"block"
            }}
            onClick={() => { deleteFav(post.post.id); }}
          />
        {/* <Marque style={{ fontSize: "1em", marginTop: "3%" }}>{post.description}</Marque> */}
      </CarteHabits>
    ));
  };

    return (
      <>
        <NavigationBar/>
        <h2>Vos articles favoris : {posts.length} articles</h2>
        <div id="listPosts" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "3em", flexGrow: "1" }}>
          {renderPosts()}
        </div>
      </>
    );
  // }
}

export default PageFavoriUtilisateur;
// code pour la page d'accueil
import React, { useState, useEffect } from 'react';
import { CarteHabits, Prix, Taille, ImageHabits, Utilisateur, Nom, ProfilPic } from '../Design/CarteHabits';
import { Link } from 'react-router-dom';
import * as imgUtil from "../img/imgUtil";
import NavigationBar from '../Components/NavigationBar';
// import post from "../../../backend/src/controllers/post";


function PagePrincipale() {
    const [posts, setPosts] = useState([]);
    const [stateFav, setStateFav] = useState([]);
    const [selectedFiltre, setSelectedFiltre] = useState(''); // Declare a state variable...
    const [categorie, setCategorie] = useState([[]]);
    const [categoriePost, setCategoriePosts] = useState([[]]);
  

    const frontPage = async () => {
      try {
        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const responseCate = await( await fetch(`https://vintoz.osc-fr1.scalingo.io/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })).json();
        console.log(responseCate.data);
        let catePost = []
        for(let i=1; i<=responseCate.data.length ; i++){
          const responseCatePost = await( await fetch(`https://vintoz.osc-fr1.scalingo.io/api/categories/${i}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })).json();
          // console.log(categoriePost)
          catePost[i] = responseCatePost;
        }
        setCategoriePosts(catePost);
        setCategorie(responseCate.data);
        console.log(catePost)

        // console.log(response)
        if (document.querySelector("#token").textContent!==""){
          const responseFav = await( await fetch(`https://vintoz.osc-fr1.scalingo.io/api/myfavorites`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': document.querySelector("#token").textContent
            }
          })).json();
          var idFav =[];
          // console.log("responseFav = ");
          // console.log(responseFav.data);
          for(const elt of responseFav.data){
            // console.log(elt.post.id)
            idFav[elt.post.id] = true;
          }
          setStateFav(idFav);
          // console.log("idFav = ");
          // console.log(stateFav)
        }

        const data = await response.json();
        // console.log("response.data = " + data.data)
        return data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return []; // Retourner un tableau vide en cas d'erreur
      }
    };

    const addFav = async (postId) => {
      try {
          const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/myfavorites/${postId}`, {
              method: (stateFav[postId] === undefined || stateFav[postId] === false) ? 'POST' : 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'x-access-token': document.querySelector("#token").textContent
              }
          });
  
          const updatedStateFav = { ...stateFav }; // Copie de l'état actuel
          updatedStateFav[postId] = !updatedStateFav[postId]; // Mise à jour de la valeur correspondante
          setStateFav(updatedStateFav); // Mise à jour de l'état
  
          if (!response.ok) {
              throw new Error('Erreur lors de la récupération des données');
          }
          const data = await response.json();
          return data;
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
      let sortedPosts = [...posts];
      

      if (selectedFiltre === "increasing") {
          sortedPosts.sort((a, b) => a.price - b.price);
      } else if (selectedFiltre === "decreasing") {
          sortedPosts.sort((a, b) => b.price - a.price);
      }

      let categorieAimed = localStorage.getItem("categorie");
      if(categorieAimed){
        let idCate = categorie.findIndex((element) => element["name"] === categorieAimed);
        sortedPosts = sortedPosts.filter(function (post){
          // console.log(idCate, post.id, categoriePost[idCate+1]["data"])
          return (categoriePost[idCate+1]["data"].find((element) => element["id"] === post["id"]) !== undefined);
        });
        // console.log(sortedPosts)
      }
      else{
      // let appSearch = document.getElementById('searchBarApp');
        let searchType = localStorage.getItem("searchType");
        let searchQuery = localStorage.getItem("searchQuery");
        if(searchQuery && searchQuery !== ""){
          let condition1, condition2, condition3;
          // let search = document.querySelector("#searchBarApp");
          // let type = search.querySelector("div#type");
          if(searchType ==="Tout"){
            sortedPosts = sortedPosts.filter(function (post){
              condition1 = post["title"].toLowerCase().includes(searchQuery.toLowerCase());
              condition2 = post["description"].toLowerCase().includes(searchQuery.toLowerCase());
              condition3 = post["user"]["name"].toLowerCase().includes(searchQuery.toLowerCase());
              return condition1 || condition2 || condition3;
            });
          }
          else if(searchType ==="Utilisateur"){
            sortedPosts = sortedPosts.filter(function (post){
              condition3 = post["user"]["name"].toLowerCase().includes(searchQuery.toLowerCase());
              return condition3;
            });
          }
          else if(searchType ==="Article"){
            sortedPosts = sortedPosts.filter(function (post){
              condition1 = post["title"].toLowerCase().includes(searchQuery.toLowerCase());
              condition2 = post["description"].toLowerCase().includes(searchQuery.toLowerCase());
              return condition1 || condition2;
            });
          }        
        }
      }

      return sortedPosts.map((post, index) => (
          <CarteHabits key={index} style={{ marginRight: "2em", position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop :"2em"}}>
              {/* <h1>{() => {}}</h1> */}
              <Utilisateur>
                  <ProfilPic src={`https://vintoz.osc-fr1.scalingo.io/${post.user.profilePic}`}></ProfilPic>
                  <Nom >{post.user.name}</Nom>
              </Utilisateur>
              <Link to={{ pathname: `/article/${post.id}` }}>
                  <ImageHabits src={`https://vintoz.osc-fr1.scalingo.io/${post.postImage}`} />
              </Link>
              <Prix >{post.price}€</Prix>
              <Taille >{post.title}</Taille>
              <img
                  src={stateFav[post.id] === true ? imgUtil.heartPic : imgUtil.emptyHeartPic}
                  style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      maxWidth: "20px",
                      cursor: "pointer",
                      display: document.querySelector("#token").textContent !== "" ? "block" : "none"
                  }}
                  onClick={() => { console.log("stateFav[post.id] = "); console.log(stateFav[post.id]); addFav(post.id); }}
              />
              {/* <Marque style={{ fontSize: "1em", marginTop: "3%" }}>{post.description}</Marque> */}
          </CarteHabits>
      ));
    };

    return (
      <>
        <NavigationBar/>
        <label htmlFor="pet-select" >Trier :</label>
        <select name="filtre" id="filtre-select" style = {{marginLeft : "1em"}} value={selectedFiltre} onChange={e => {setSelectedFiltre(e.target.value); console.log(selectedFiltre); renderPosts();}}>
          <option value="">--Choix de tri optionnel--</option>
          <option value="increasing" onClick={(e)=>{console.log("on trie par prix croissant")}}>Par prix croissant</option>
          <option value="decreasing" onClick={(e)=>{console.log("on trie par prix decroissant")}}>Par prix décroissant</option>
        </select>
        {/* <div id="searchBarApp" style={{ display: "none" }}>
          <div id="type"></div>
          <div id="input" style={{ display: "none" }}>{searchText}</div>
        </div> */}
        <div id="listPosts" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
          {renderPosts()}
        </div>
      </>
    );
  // }
}

export default PagePrincipale;
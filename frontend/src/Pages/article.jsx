import "../img/imgUtil";
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { CarteHabits, ImageHabits } from '../Design/CarteHabits';
import * as imgUtil from "../img/imgUtil";
import { Bouton } from '../Components/Bouton';
import NavigationBar from '../Components/NavigationBar';
import { FormulaireOffre, FormulaireMessage } from '../Components/Formulaire';


import { Link } from 'react-router-dom';

function PageArticle() {
  const { id } = useParams();
  if (document.querySelector('#articleId')) {
    document.querySelector('#articleId').textContent = id;
  }



  const [article, setArticle] = useState(null);
  const [imageExpanded, setImageExpanded] = useState(null);

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);


  const sendMessage = async () => {
    try {
      const existingGroup = await fetchExistingGroup(document.querySelector("#idUser").textContent, selectedUser);
      
      if (existingGroup) {
        await sendGroupMessage(existingGroup.id, newMessage);
      } else {
        const chaine = `test de discussion avec ${selectedUser}`;
        const newGroupId = await createGroup(selectedUser, chaine);
        await sendGroupMessage(newGroupId, newMessage);
      }
      
      setNewMessage('');
      await fetchDiscussionMessages(selectedDiscussion.id);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };
  
  const fetchExistingGroup = async (userId, selectedUserId) => {
    try {
      const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/mygroups`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching existing group');
      }
  
      const groups = await response.json();
  
      for (const group of groups.ownerGroups) {
        const groupResponse = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/mygroups/${group.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': document.querySelector("#token").textContent,
          },
        });
  
        if (!groupResponse.ok) {
          throw new Error('Error fetching group members');
        }
  
        const gm = await groupResponse.json();
  
        const userExists = gm.groupMembers.some(member => member.id == userId);
        const selectedUserExists = gm.groupMembers.some(member => member.id == selectedUserId);
  
        if (userExists && selectedUserExists) {
          return group;
        }
      }
  
      return null;
    } catch (error) {
      console.error('Error fetching existing group:', error.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/items/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        // console.log(data.data);
        setArticle(data.data); // L'attribut 'data' contient les détails de l'article
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchArticle();
  }, [id]);

  const createGroup = async (userId, groupName) => {
    try {
      // Étape 1 : Créer le groupe avec un nom et récupérer l'ID du groupe
      const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/mygroups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
        body: JSON.stringify({ name: groupName }), // Inclure le nom du groupe dans le corps de la requête
      });
  
      if (!response.ok) {
        throw new Error('Error creating group');
      }
  
      const data = await response.json();
      // console.log(data)
      const groupId = data.groupId; // Récupérer l'ID du nouveau groupe créé
      // console.log(groupId)
      // Étape 2 : Ajouter l'autre utilisateur au groupe nouvellement créé
      const addMemberResponse = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/mygroups/${groupId}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });
  
      if (!addMemberResponse.ok) {
        throw new Error('Error adding member to group');
      }
  
      console.log('Group created and member added successfully.');
      return groupId;
    } catch (error) {
      console.error('Error creating group:', error.message);
      return null;
    }
  };
  
  const sendGroupMessage = async (groupId, message) => {
    try {
      const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/messages/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
        body: JSON.stringify({ content: message }),
      });
  
      if (!response.ok) {
        throw new Error('Error sending message');
      }
  
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const toggleOfferForm = () => {
    setShowOfferForm(!showOfferForm);
  };

  const toggleMessageForm = () => {
    setShowMessageForm(!showMessageForm);
  };

  //pour mettre a jour l'image
  const handleImageClick = (src) => {
    setImageExpanded(src);
  };

  const handleCloseImage = () => {
    setImageExpanded(null);
  };


  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/items/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setArticle(data.data); // L'attribut 'data' contient les détails de l'article
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <NavigationBar />
      <div style={{ display: "block", justifyContent: "center", flexWrap: "wrap", textAlign: "center" }}>
        <h2>{article.title}</h2>
        <p>Description : {article.description}</p>
        <p>Prix : {article.price}€</p>
        {/* Ajoutez d'autres attributs de l'article ici */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", textAlign: "center", marginTop: "1em" }}>
          <CarteHabits style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "flex-start", textAlign: "center" }}>
            <ImageHabits
              src={`https://vintoz.osc-fr1.scalingo.io/${article.postImage}`}
              onClick={() => localStorage.getItem("userInfo")===null ? alert("connectez vous d'abord et après on verra") : handleImageClick(`https://vintoz.osc-fr1.scalingo.io/${article.postImage}`)}
            />
          </CarteHabits>
          {/* <CarteHabits style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: "1em" }}>
            <ImageHabits
              src={imgUtil.tabImage[article.id % imgUtil.tabImage.length]}
              onClick={() => handleImageClick(imgUtil.tabImage[article.id % imgUtil.tabImage.length])}
            />
          </CarteHabits> */}

          <CarteHabits style={{ marginTop: "0 auto", marginLeft: "5em" }}>
            <div style={ButtonContainerStyle}>
              <div style={{ marginBottom: "1em" }}>
                {/* Redirection conditionnelle */}
                {document.querySelector("#token").textContent !== "" ? (
                  <Link to="/"> {/* Redirection si le solde est suffisant et qu'un token est présent */}
                    <Bouton style={{ width: "200px" }} onClick={() => { localStorage.setItem("solde", localStorage.getItem("solde") - article.price); }}> Acheter </Bouton>
                  </Link>
                ) : (
                  <Bouton style={{ width: "200px" }} onClick={() => alert("Connectez-vous d'abord et après on verra")}> Acheter </Bouton>
                )}
              </div>
              <div style={{ marginBottom: "1em" }}>
                <Bouton onClick={() => document.querySelector("#token").textContent === "" ? alert("Connectez-vous d'abord et après on verra") : toggleOfferForm} style={{ width: "200px" }}> Faire une offre </Bouton>
              </div>
              <div style={{ marginBottom: "1em" }}>
                <Bouton onClick={() => document.querySelector("#token").textContent === "" ? alert("Connectez-vous d'abord et après on verra") : toggleMessageForm()} style={{ width: "200px" }}> Message </Bouton>
              </div>
            </div>
          </CarteHabits>
          {imageExpanded && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 999 }}>
              <div>
                <button style={{margin:"10px", alignSelf:"center", color: "red"}} onClick={() => { handleCloseImage() }}>❌   Fermer</button>
              </div>
              <img src={imageExpanded} alt="Expanded" style={{width: "50%", height: "auto", maxWidth: "50vh", maxHeight: "50vw" }} />
            </div>
          )}
        </div>
      
      </div>
      
      {showOfferForm && <FormulaireOffre onClose={toggleOfferForm}  selectedUser={article.user.id} selectedUserName={article.user.name} articleTitle={article.title}/>}
      {showMessageForm && article && (
  <FormulaireMessage onClose={toggleMessageForm} selectedUser={article.user.id} selectedUserName={article.user.name}/>)}

    
    </>
  );
}

const ButtonContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

export default PageArticle;
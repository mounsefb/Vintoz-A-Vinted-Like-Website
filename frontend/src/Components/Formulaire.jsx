import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const formStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // backgroundColor: "black",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "400px", // Largeur du formulaire
    maxWidth: "90%", // Largeur maximale du formulaire
    zIndex: "100", // pour assurer que le formulaire est au-dessus de l'arrière-plan
    fontFamily: "Arial, sans-serif", // Police de caractères
    textAlign: "center" // pour centrer le contenu du formulaire
  };
  
  const centreStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
  
  const inputStyle = {
    marginBottom: "15px",
    textAlign: "left",
    width: "45%",
  };
  
  const closeStyle = {
    padding: "8px 20px",
    backgroundColor: "white",
    color: "black",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    float : "right",
  };
  
  const buttonStyle = {
    padding: "8px 20px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    
  };



const FormulaireConnexion = ({ onClose }) => {
    // État local pour gérer les champs du formulaire
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [nom, setNom] = useState('');
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleMotDePasseChange = (e) => {
      setMotDePasse(e.target.value);
    };
  
    const handleNomChange = (e) => {
      setNom(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        let bodyCo = {};
        if (email != "") { bodyCo.email = email }
        if (motDePasse != "") { bodyCo.password = motDePasse }
        console.log(bodyCo);
        const response = await (await fetch('https://vintoz.osc-fr1.scalingo.io/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyCo)
        })).json();
        console.log(response);
        if (!response.status) throw { message: response.message };

        document.querySelector('#token').textContent = response.userInfo["token"];
        document.querySelector('#username').textContent = response.userInfo["username"];
        document.querySelector('#email').textContent = response.userInfo["email"];
        document.querySelector('#idUser').textContent = response.userInfo["id"];
        document.querySelector('#profilePic').textContent = response.userInfo["image"];
        document.querySelector('#boutonConnexion').style.display = "none";
        document.querySelector('#boutonInscription').style.display = "none";
        document.querySelector('#MonCompte').style.display = "block";
        console.log(response.userInfo)


        
        // Enregistrement des informations utilisateur dans le stockage local
        localStorage.setItem('userInfo', JSON.stringify(response.userInfo));
        localStorage.setItem('solde', response.userInfo["solde"]);

        onClose();
        // Actualiser la page après la connexion
        window.location.reload();
      }
      catch (error) {
        console.log(error)
        if (!(document.querySelector("#errorMessage"))) {
          let errorMessage = document.createElement("h5");
          errorMessage.textContent = error.message;
          errorMessage.id = "errorMessage";
          (document.querySelector("#divConnexion")).insertBefore(errorMessage, document.querySelector("#formConnexion"));
        }
        else {
          errorMessage.textContent = error.message;
        }
      }
    };

    window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        onClose();      
      }
    });

    
    return (
      <div className = "overlay">
        <div style={formStyle} id="divConnexion">
          <div>
              <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
          </div>
          <h2 style={{ marginBottom: "20px" }} id="Connexion">Connexion</h2>
          <form style={centreStyle} onSubmit={handleSubmit} id="formConnexion">
            <div style={inputStyle} id="email">
              {/* <label htmlFor="email">Email:</label> */}
              <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder='Email or username'/>
            </div>
            <div style={inputStyle}>
              {/* <label htmlFor="motDePasse">Mot de passe:</label> */}
              <input type="password" id="motDePasse" value={motDePasse} onChange={handleMotDePasseChange} placeholder='Password'/>
            </div>
            <div>
              <button type="submit" style={buttonStyle}>Se connecter</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const FormulaireInscription = ({ onClose }) => {
    const [nom, setNom] = useState('');
    const [image, setImage] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
  
    const handleNomChange = (e) => {
      setNom(e.target.value);
    };

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };
  
    const handlePrenomChange = (e) => {
      setPrenom(e.target.value);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleMotDePasseChange = (e) => {
      setMotDePasse(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', motDePasse);
        formData.append('name', nom);
        formData.append('image', image);

        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/users', {
          method: 'POST',
          body: formData
        });

        const responseData = await response.json();
        console.log(responseData);

        if (!responseData.status) {
          throw new Error(responseData.message);
        }
        document.querySelector("#divInscription").style.display = "none";
        onClose();
      }
      catch(error){
        console.log(error)
        if(!(document.querySelector("#errorMessage"))){
          let errorMessage = document.createElement("h5");
          errorMessage.textContent = error.message;
          errorMessage.id = "errorMessage";
          (document.querySelector("#divInscription")).insertBefore(errorMessage, document.querySelector("#formInscription"));
        }
        else{
          errorMessage.textContent = error.message;
        }
      }
    };
  
    window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        onClose();      
      }
    });

    return (
      <div className = "overlay">
        <div style={formStyle} id="divInscription">
          <div>
              <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
          </div>
          <h2 >Inscription</h2>
          <form style={centreStyle} onSubmit={handleSubmit} id="formInscription">
            <div style={inputStyle}>
              {/* <label htmlFor="email">Email:</label> */}
              <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder='Email'/>
            </div>
            <div style={inputStyle}>
              {/* <label htmlFor="motDePasse">Mot de passe:</label> */}
              <input type="password" id="motDePasse" value={motDePasse} onChange={handleMotDePasseChange} placeholder='Mot de passe'/>
            </div>
            <div style={inputStyle}>
              {/* <label htmlFor="nom">Nom:</label> */}
              <input type="text" id="nom" value={nom} onChange={handleNomChange} placeholder='Nom'/>
            </div>
            <div style={inputStyle}>
                <input type="file" name="profilePic" id="profilePic" onChange={handleImageChange}/>
            </div>
            <div>
              <button type="submit" style={buttonStyle}>S'inscrire</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const FormulaireModification = ({ onClose }) => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
  
    const handleNomChange = (e) => {
      setNom(e.target.value);
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleMotDePasseChange = (e) => {
      setMotDePasse(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        let bodyCo = {};
        if (email!="") {bodyCo.email =  email}
        if (motDePasse!="") {bodyCo.password = motDePasse}
        if (nom!="") {bodyCo.name = nom}
        console.log(bodyCo);
        let id = document.querySelector("#idUser").textContent;
        const response=await(await fetch(`https://vintoz.osc-fr1.scalingo.io/api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token' : document.querySelector("#token").textContent
          },
          body: JSON.stringify(bodyCo)
        })).json();
        console.log(response);
        if(!response.status) throw {message : response.message};
        document.querySelector("#divModification").style.display = "none";
        onClose();
      }
      catch(error){
        console.log(error)
        if(!(document.querySelector("#errorMessage"))){
          let errorMessage = document.createElement("h5");
          errorMessage.textContent = error.message;
          errorMessage.id = "errorMessage";
          (document.querySelector("#divModification")).insertBefore(errorMessage, document.querySelector("#formModification"));
        }
        else{
          errorMessage.textContent = error.message;
        }
      }
    };
  
    window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        onClose();      
      }
    });

    return (
      <div className = "overlay">
        <div style={formStyle} id="divModification">
          <div>
              <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
          </div>
          <h2 >Mes informations</h2>
          <form style={centreStyle} onSubmit={handleSubmit} id="formModification">
            <div style={inputStyle}>
              <input id="modifyUsername" placeholder={document.querySelector("#username").textContent} onChange={handleNomChange} />
            </div>
            <div style={inputStyle}>
              <input id="modifyMail" placeholder={document.querySelector("#email").textContent} onChange={handleEmailChange} />
            </div>
            <div style={inputStyle}>
            <input id="modifyPassword" placeholder="Nouveau mot de passe" onChange={handleMotDePasseChange} />
              {/* <label htmlFor="motDePasse">Mot de passe:</label>
              <input type="password" id="motDePasse" value={motDePasse} onChange={handleMotDePasseChange} /> */}
            </div>
            <div>
              <button type="submit" style={buttonStyle}>Valider les modifications</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const FormulaireAjoutPost = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    // const Navigate = useNavigate();

    const handleTitleChange = (e) => {
      setTitle(e.target.value);
    };
  
    const handleDesciptionChange = (e) => {
      setDescription(e.target.value);
    };
  
    const handlePriceChange = (e) => {
      setPrice(e.target.value);
    };

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);

        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/myitems', {
          method: 'POST',
          headers : {"x-access-token" : document.querySelector("#token").textContent} ,
          body: formData
        });
        if(!response.status) throw {message : response.message};
        document.querySelector("#divAjoutPost").style.display = "none";
        onClose();
        

        // Navigate.push('/myarticles');
      }
      catch(error){
        console.log(error)
        if(!(document.querySelector("#errorMessage"))){
          let errorMessage = document.createElement("h5");
          errorMessage.textContent = error.message;
          errorMessage.id = "errorMessage";
          (document.querySelector("#divAjoutPost")).insertBefore(errorMessage, document.querySelector("#formAjoutPost"));
        }
        else{
          errorMessage.textContent = error.message;
        }
      }
    };
  
    window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        onClose();      
      }
    });

    return (
      <div className = "overlay">
        <div style={formStyle} id="divAjoutPost">
          <div>
              <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
          </div>
          <h2>Poster un nouvel article</h2>
          <form style={centreStyle} onSubmit={handleSubmit} id="formAjoutPost">
            <div style={inputStyle}>
              <input id="title" placeholder="Titre de l'article" onChange={handleTitleChange} />
            </div>
            <div style={inputStyle}>
              <input id="description" placeholder="Description de l'article" onChange={handleDesciptionChange} />
            </div>
            <div style={inputStyle}>
              <input id="price" placeholder="Prix de l'article" onChange={handlePriceChange} />
            </div>
            <div style={inputStyle}>
                <input type="file" name="articlePic" id="articlePic" onChange={handleImageChange}/>
            </div>
            <div>
              <button type="submit" style={buttonStyle}>Publier l'article</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const FormulaireModifierPost = ({ onClose }) => {
    const selectedItem = document.querySelector("#selectedItem");
    const [title, setTitle] = useState(selectedItem.querySelector("#title").textContent);
    const [description, setDescription] = useState(selectedItem.querySelector("#description").textContent);
    const [price, setPrice] = useState(selectedItem.querySelector("#price").textContent);
    const [image, setImage] = useState('');

    const handleTitleChange = (e) => {
      setTitle(e.target.value);
    };
  
    const handleDesciptionChange = (e) => {
      setDescription(e.target.value);
    };
  
    const handlePriceChange = (e) => {
      setPrice(e.target.value);
    };

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image);
        const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/myitems/${selectedItem.querySelector("#id").textContent}`, {
          method: 'PUT',
          headers : {"x-access-token" : document.querySelector("#token").textContent} ,
          body: formData
        });
        if(!response.status) throw {message : response.message};

        document.querySelector("#divModifierPost").style.display = "none";
        onClose();
        window.location.reload();
        // Navigate.push('/myarticles');
      }
      catch(error){
        console.log(error)
        if(!(document.querySelector("#errorMessage"))){
          let errorMessage = document.createElement("h5");
          errorMessage.textContent = error.message;
          errorMessage.id = "errorMessage";
          (document.querySelector("#divModifierPost")).insertBefore(errorMessage, document.querySelector("#formModifierPost"));
        }
        else{
          errorMessage.textContent = error.message;
        }
      }
    };

    window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        onClose();      
      }
    });

    return (
      <div className = "overlay">
        <div style={formStyle} id="divModifierPost">
          <div>
              <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
          </div>
          <h2 >Modifier l'article</h2>
          <form style={centreStyle} onSubmit={handleSubmit} id="formModifierPost">
            <div style={inputStyle}>
              <input type ="text" id="title" value={title} onChange={handleTitleChange} />
            </div>
            <div style={inputStyle}>
              <input id="description" value={description} onChange={handleDesciptionChange} />
            </div>
            <div style={inputStyle}>
              <input id="price"  value={price} onChange={handlePriceChange} />
            </div>
            <div style={inputStyle}>
                <input type="file" name="articlePic" id="articlePic" onChange={handleImageChange}/>
            </div>
            <div>
              <button type="submit" style={buttonStyle}>Valider les modifications</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const FormulaireSuppressionPost = ({ onClose }) => {
    const selectedItem = document.querySelector("#selectedItem");

    const deletePost = async () => {
      try{
        const response = await fetch(`https://vintoz.osc-fr1.scalingo.io/api/items/${selectedItem.querySelector("#id").textContent}`, {
          method: 'DELETE',
          headers : {"x-access-token" : document.querySelector("#token").textContent} ,
        });
        if(!response.status) throw {message : response.message};

        document.querySelector("#divSupprimerPost").style.display = "none";
        onClose();
        window.location.reload();
        // Navigate.push('/myarticles');
      }
      catch(error){
        console.log(error)
        if(!(document.querySelector("#errorMessage"))){
          let errorMessage = document.createElement("h5");
          errorMessage.textContent = error.message;
          errorMessage.id = "errorMessage";
          (document.querySelector("#divSupprimerPost")).insertBefore(errorMessage, document.querySelector("#formSupprimerPost"));
        }
        else{
          errorMessage.textContent = error.message;
        }
      }
    };

    window.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        onClose();      
      }
    });

    return (
      <div className = "overlay">
        <div style={formStyle} id="divSupprimerPost">
          <div>
              <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
          </div>
          <h2 >Etes vous sûr de vouloir supprimer cet article ?</h2>
          <div>
            <button style={{...buttonStyle, backgroundColor : "red"}} onClick={(e) => {deletePost();}}>Oui</button>
            <button style={{...buttonStyle, marginLeft : "1em"}} onClick={(e) => {onClose();}}>Annuler</button>
          </div>
        </div>
      </div>
    );
  };

const FormulaireMessage = ({ onClose, selectedUser, selectedUserName }) => {

    const navigate = useNavigate();

    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);



  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': document.querySelector("#token").textContent,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching users');
        }

        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };
    
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/groupsmember', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': document.querySelector("#token").textContent,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching group members');
        }

        const data = await response.json();
      } catch (error) {
        console.error('Error fetching group members:', error.message);
      }
    };
    
    fetchGroupMembers();
  }, []);



  const sendMessage = async (message) => {
      console.log(document.querySelector("#idUser").textContent, selectedUser, selectedUserName)
      console.log('Sending message:', message);
    try {
      const existingGroup = await fetchExistingGroup(document.querySelector("#idUser").textContent, selectedUser);
      
      if (existingGroup) {
        await sendGroupMessage(existingGroup.id, newMessage);
      } else {
        const chaine = `Discussion avec ${selectedUserName}`;
        const newGroupId = await createGroup(selectedUser, chaine);
        await sendGroupMessage(newGroupId, newMessage);
      }
      
      setNewMessage('');
      navigate('/messagerie');
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newMessage);
    try {
      await sendMessage(newMessage);
      onClose();
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

  const createGroup = async (userId, groupName) => {
    try {
      // Étape 1 : Créer le groupe avec un nom et récupérer l'ID du groupe
      const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/mygroups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
        body: JSON.stringify({ name: groupName
          }), 
      });
  
      if (!response.ok) {
        throw new Error('Error creating group');
      }
  
      const data = await response.json();
      console.log(data)
      const groupId = data.groupId; // Récupérer l'ID du nouveau groupe créé
      console.log(groupId)
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
  

  return (
    <div className = "overlay">
      <div style={formStyle} id="divMessage">
        <div>
            <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
        </div>
        <h2 >Faire une message</h2>
        <form style={centreStyle} onSubmit={handleSubmit} id="formMessage">
          <div style={inputStyle}>
            <input id="messageValue"  onChange={handleMessageChange} />
          </div>
          <div>
            <button type="submit" style={buttonStyle}>Soumettre l'message</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const FormulaireOffre = ({ onClose, selectedUser, selectedUserName, articleTitle  }) => {
 
  const [offre, setOffre] = useState('');


  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);



const handleMessageChange = (e) => {
  setNewMessage(e.target.value);
};

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching users');
      }

      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };
  
  fetchUsers();
}, []);

useEffect(() => {
  const fetchGroupMembers = async () => {
    try {
      const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/groupsmember', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching group members');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error fetching group members:', error.message);
    }
  };
  
  fetchGroupMembers();
}, []);


const sendMessage = async (message, articleName, price) => {
  console.log(document.querySelector("#idUser").textContent, selectedUser, selectedUserName);
  console.log('Sending message:', message);
  
  try {
    const existingGroup = await fetchExistingGroup(document.querySelector("#idUser").textContent, selectedUser);
    message = `Nouvelle offre pour l'article ${articleName} à ${price}`;
    
    if (existingGroup) {
      // Utiliser les informations de l'article et le prix dans le message
      await sendGroupMessage(existingGroup.id, message);
    } else {
      const chaine = `Discussion avec ${selectedUserName}`;
      const newGroupId = await createGroup(selectedUser, chaine);
      await sendGroupMessage(newGroupId, message);
    }
    
    setNewMessage('');
    navigate('/messagerie');
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

const createGroup = async (userId, groupName) => {
  try {
    // Étape 1 : Créer le groupe avec un nom et récupérer l'ID du groupe
    const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/mygroups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': document.querySelector("#token").textContent,
      },
      body: JSON.stringify({ name: groupName
        }), 
    });

    if (!response.ok) {
      throw new Error('Error creating group');
    }

    const data = await response.json();
    console.log(data)
    const groupId = data.groupId; // Récupérer l'ID du nouveau groupe créé
    console.log(groupId)
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


  const handleOffreChange = (e) => {
    setOffre(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newMessage);
    
    const articleId = document.querySelector("#articleId").textContent;
    const price = offre; // Supposons que "offre" contienne le prix de l'offre
  
    console.log(articleId);
  
    try {
      
  
      // Créer une offre
      let bodyCo = {};
      if (offre !== "") {
        bodyCo.price = offre;
      }
  
      console.log(JSON.stringify(bodyCo));
      const response = await (await fetch(`https://vintoz.osc-fr1.scalingo.io/api/items/${articleId}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': document.querySelector("#token").textContent
        },
        body: JSON.stringify(bodyCo)
      })).json();
  
      console.log(response);
  
      if (!response.status) {
        throw { message: response.message };
      }
  
      // Masquer le formulaire d'offre
      document.querySelector("#divOffre").style.display = "none";
      
      // Fermer le formulaire global
      onClose();
      // Envoyer le message
      await sendMessage(newMessage, articleTitle, price);

    } catch (error) {
      console.error('Error handling submit:', error.message);
  
      // Afficher l'erreur
      if (!(document.querySelector("#errorMessage"))) {
        let errorMessage = document.createElement("h5");
        errorMessage.textContent = error.message;
        errorMessage.id = "errorMessage";
        (document.querySelector("#divOffre")).insertBefore(errorMessage, document.querySelector("#formModification"));
      } else {
        errorMessage.textContent = error.message;
      }
    }
  };
  

  return (
    <div className = "overlay">
      <div style={formStyle} id="divOffre">
        <div>
            <button type="close" style={closeStyle} onClick={(e) => {onClose();}}>X</button>
        </div>
        <h2 >Faire une offre</h2>
        <form style={centreStyle} onSubmit={handleSubmit} id="formOffre">
          <div style={inputStyle}>
            <input id="offerValue"  onChange={handleOffreChange} />
          </div>
          <div>
            <button type="submit" style={buttonStyle}>Soumettre l'offre</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export {FormulaireConnexion,FormulaireMessage, FormulaireInscription, FormulaireModification,FormulaireOffre,FormulaireAjoutPost, FormulaireModifierPost, FormulaireSuppressionPost};
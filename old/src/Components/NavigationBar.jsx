// NavigationBar.js

import React, { useState, useEffect } from 'react';
import { NavBar } from '../Design/NavBar';
import SearchBar from './SearchBar';
import { Bouton } from './Bouton';
import { Link } from 'react-router-dom';
import {FormulaireConnexion, FormulaireInscription, FormulaireModification} from './Formulaire';
import * as imgUtil from "../img/imgUtil";

import Categories from './Categorie';



const NavigationBar = () => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [showModificationForm, setShowModificationForm] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [open, setOpen] = useState(false);


    // Categorie femme
    const [showFemmeSubcategories, setShowFemmeSubcategories] = useState(false);

    const toggleFemmeSubcategories = () => {
        setShowFemmeSubcategories(!showFemmeSubcategories);
    };
  

    //catégorie homme
    const [showHommeSubcategories, setShowHommeSubcategories] = useState(false);
    const toggleHommeSubcategories = () => {
        setShowHommeSubcategories(!showHommeSubcategories);
    };

    //categorie Enfant
    const [showEnfantSubcategories, setShowEnfantSubcategories] = useState(false);
    const toggleEnfantSubcategories = () => {
        setShowEnfantSubcategories(!showEnfantSubcategories);
    };

    //categorie Maison
    const [showMaisonSubcategories, setShowMaisonSubcategories] = useState(false);
    const toggleMaisonSubcategories = () => {
        setShowMaisonSubcategories(!showMaisonSubcategories);
    };
    //categorie Autres
    const [showAutresSubcategories, setShowAutresSubcategories] = useState(false);
    const toggleAutresSubcategories = () => {
        setShowAutresSubcategories(!showAutresSubcategories);
    };

    //categorie Filtre
    const [showFiltreSubcategories, setShowFiltreSubcategories] = useState(false);
    const toggleFiltreSubcategories = () => {
        setShowFiltreSubcategories(!showFiltreSubcategories);
    };


    // const [posts, setPosts] = useState([]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "connexion") {
      setShowLoginForm(true);
      setShowRegistrationForm(false);
    } else if (e.target.value === "inscription") {
      setShowRegistrationForm(true);
      setShowLoginForm(false);
    }
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    // Pour assurer que seul un formulaire est affiché à la fois
    setShowRegistrationForm(false); 
  };

  const toggleRegistrationForm = () => {
    setShowRegistrationForm(!showRegistrationForm);
    // Pour assurer que seul un formulaire est affiché à la fois
    setShowLoginForm(false); 
  };

  const toggleModificationForm = () => {
    setShowModificationForm(!showModificationForm);
    // Pour assurer que seul un formulaire est affiché à la fois
    setShowLoginForm(false); 
    setShowRegistrationForm(false); 
  };
  
  const handleOverlayClick = () => {
    if (showLoginForm || showRegistrationForm) {
      setShowLoginForm(false);
      setShowRegistrationForm(false);
    }
  };

  const deconnection = () => {
    console.log("deconnection");
    document.querySelector('#token').textContent = "";
    document.querySelector('#email').textContent = "";
    document.querySelector('#username').textContent = "";
    document.querySelector('#idUser').textContent = "";


    document.querySelector('#boutonConnexion').style.display = "block";
    document.querySelector('#boutonInscription').style.display = "block";
    document.querySelector('#MonCompte').style.display = "none";
    
    localStorage.setItem('userInfo', null);
    localStorage.setItem('searchQuery', "");
    localStorage.setItem('searchType', "");
    localStorage.setItem('categorie', "");
    window.location.replace("/");
  }
  
  const DropdownItem = (props) => {
    return (
      <li className='dropdownItem' onClick={props.onClick}>
        <img src={props.img} alt={props.text} />
        <span >{props.text}</span>
      </li>
    );
  }

  return (
    <>
      <NavBar style={{ display: "flex", justifyContent: "center",alignItems: "center",backgroundColor:"#efefed" }} >
          <div>
            <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Vinted_logo.png/800px-Vinted_logo.png" 
            alt="logo vinted" 
            style={{ width: '140px', cursor : "pointer", position : "absolute", left : "20px", top:"20px" }} 
            onClick={() => {localStorage.setItem("searchType", "");localStorage.setItem("searchQuery", "");localStorage.setItem('categorie', "");window.location.replace("/");}} />
          </div>
        {/* <SearchBarDiv style={{display : "flex",alignItems: "center", justifyContent: "center",width:"100%"}}> */}
          {/* <SearchBar  type="text" placeholder="🔎 Rechercher un article" onChange = {handleChangeSearchBar} value={valueSearch}/> */}
        <SearchBar />
        {/* </SearchBarDiv> */}
        {isFullScreen && (
          <>
            <div style={{display : "flex",marginTop: "1%",alignItems: "center", justifyContent: "center", padding: "10px",marginRight : ""}}>
              <div  id="boutonConnexion" style={{ display: (document.querySelector("#token").textContent === "") ? "block" : "none"}}>
                <Bouton onClick={() => {toggleLoginForm()}} > Connexion </Bouton>
              </div>
              <div id="boutonInscription" style={{ display: (document.querySelector("#token").textContent === "") ? "block" : "none"}}>
                <Bouton onClick={() => {toggleRegistrationForm()}} > Inscription </Bouton>
              </div>
              {/* <div style={{ marginTop: "1em", display :"none", color : "red"}} id="boutonDeconnexion">
                <Bouton onClick={deconnection}> Se deconnecter </Bouton>
              </div> */}
    
    
    
              <div id = 'solde' style ={{display: (document.querySelector("#token").textContent !== "") ? "block" : "none"}}>
                <Bouton style ={{marginRight : "10em", width : "10em", marginTop : "-10px"}} value={"recharger"} onClick={()=>{window.location.replace('/recharge')}}>Solde : {localStorage.getItem("solde")===null ? '0' : localStorage.getItem("solde")} €</Bouton>
              </div>
              <div className = 'menu-container'>
                <div style={{ marginTop: "1em", display: (document.querySelector("#token").textContent !== "") ? "block" : "none"}}  id="MonCompte">
                  
                  <div id = 'messagerie'>
                   <img src = {imgUtil.messagerieImg} style={{...imgUtil.img, marginRight : "5em",top: "28px",right: "20px", height: "45px",width: "50px",borderRadius: "27%"}} onClick = {()=>{window.location.replace('/messagerie')}}></img>
                  </div>
                  <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
                    <img src = {`https://vintoz.osc-fr1.scalingo.io/${document.querySelector("#profilePic").textContent}`} style={imgUtil.img}></img>
                  </div>
                  <div className = {`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                    {/* <h3>Mister Troll Face<br></br><span>A pro trollfacer</span></h3> */}
                    <ul style = {{margin : "0", padding: "0", }}>
                      <Link to = "/myfavorites" style={{color : "black"}}>
                        <DropdownItem img = {imgUtil.heartPic} text = {"Mes favoris"}/>
                      </Link>
                      <Link to = "/myarticles" style={{color : "black"}}>
                        <DropdownItem img = {imgUtil.articlePic} text = {"Mes articles"}/>
                      </Link>
                      <a style = {{color : "black"}}>
                        <DropdownItem img = {imgUtil.modifyPic} style = {{color : "grey"}} text = {"Mes informations"} onClick={() => {toggleModificationForm()}}/>
                      </a>
                      <Link to = "/" onClick={() => {deconnection()}} style = {{color : "black"}}>
                        <DropdownItem img = {imgUtil.logoutPic} text = {"Au revoir"} />
                      </Link>
                    </ul>

                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {!isFullScreen && (
          <div style={{marginTop: "1em", margin: "0 auto" }}>
            <select style={{ padding: "8px 20px", borderRadius: "5px", border: "none", cursor: "pointer" }} value={selectedOption} onChange={handleSelectChange}>
              <option value=""> Option de connexion </option>
              <option value="connexion">Connexion</option>
              <option value="inscription">Inscription</option>
            </select>
          </div>
        )}
        
      </NavBar>

      <NavBar style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#01b2bd", height: "4em", zIndex:"990" }}>
  {isFullScreen && (
    <>
     <Categories/>
    </>
  )}
  {!isFullScreen && (
    <div style={{ marginTop: "0 auto", margin: "0 auto" }}>
      <select
        style={{
          padding: "8px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer"
        }}
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value=""> Catégorie </option>
        <option value="femme">Femme </option>
        <option value="Homme">Homme</option>
        <option value="Hellico">Enfant</option>
        <option value="Enfant">Maison</option>
        <option value="Maison">Autres</option>
      </select>
    </div> 
  )}
</NavBar>

      
      {showLoginForm && <FormulaireConnexion onClose={toggleLoginForm} />}
      {showRegistrationForm && <FormulaireInscription onClose={toggleRegistrationForm} />}
      {showModificationForm && <FormulaireModification onClose={toggleModificationForm} />}

    </>
  );
}

export default NavigationBar;

import styled from "@emotion/styled";
import React, { useState, useEffect } from 'react';

const NavBarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: grey;
`;

const NavButton = styled.button`
  background-color: transparent;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 1em;
  transition: all 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const SubMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #555;
  padding: 10px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const SubMenuItem = styled.div`
  color: #fff;
  cursor: pointer;
  padding: 5px 0;
`;


const Categories = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [categories, setCate] = useState([]);
  
  const getCate = async () => {
    try {
      const response = await fetch('https://vintoz.osc-fr1.scalingo.io/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      console.log("response.data = " + data.data)
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return []; // Retourner un tableau vide en cas d'erreur
    }
  };

  useEffect(() => {
    getCate()
      .then(response => {
        if (response.status && Array.isArray(response.data)) {
          setCate(response.data);
        } else {
          console.error('Erreur lors de la récupération des données:', response.message);
        }
      })
      .catch(error => console.error('Erreur lors de la récupération des données:', error));
  }, []);

  // Gérer le changement de catégorie sélectionnée
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Fonction pour afficher les sous-catégories d'une catégorie donnée
  // const renderCate = (subcategory) => (
  //   <option key={subcategory} value={subcategory}>{subcategory}</option>
  // );

  const renderCate = () => {
    return categories.map((cate, index) => (   
      <input type="button" key={index} value={cate["name"]}
      style={{
        marginLeft: "2em",
        marginTop: "0 auto",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px",
        border: "1px solid",
        borderRadius: "9px",
        marginRight: "",
        height : '40px',
        backgroundColor:"rgb(1, 178, 189)",
        cursor :'pointer',
        zIndex : '990'
      }}
      onClick = {()=>{localStorage.setItem("searchType", ""); localStorage.setItem("searchQuery","");localStorage.setItem("categorie", cate["name"]); window.location.replace("/");}}
    />
    ));

  };

  return (
    <div style={{ marginTop: "0 auto", display: "flex", justifyContent: "center", width : "auto" }}>
      {renderCate()}
      {/* <select
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
        {categories.map((category) => (
          <optgroup key={category.label} label={category.label}>
            {category.subcategories.map(renderSubcategories)}
          </optgroup>
        ))}
      </select> */}
    </div>
  );
};

export default Categories;
import React, { useState } from 'react';
import styled from "@emotion/styled";

const SearchBarDivStyle = styled("form")`
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left : 22.5%;
    display : flex;
    justifyContent: center;
    width: 100%
`  

const TypeStyle = styled("select")`
    border : solid 2px #01b2bd;
    border-radius: 5em 0 0 5em ; 
    font-size : 16px ;
    text-align: center;
    padding : 16px ;  
    width : auto;
`

const SearchBarStyle = styled("input")`
    border : solid 2px #01b2bd;
    border-radius: 0 5em 5em 0 ; 
    padding : 16px ;  
    font-size : 16px ;
    // height: 2% ;
    alignItems: center;
    justify-content: center;
    width : 70%;
`;

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('Tout');


  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('searchType', searchType);
    localStorage.setItem('searchQuery', query);
    localStorage.setItem('categorie', "");
    window.location.replace("/");
  };

//   if (redirectToHome) {
//     return <Redirect to="/" />;
//   }

  return (
    <SearchBarDivStyle id= "SearchBarForm" onSubmit={handleSubmit} >
        <TypeStyle id= "SearchBarType" value={searchType} onChange={handleTypeChange}>
            <option value="Tout">Tout</option>
            <option value="Utilisateur">Utilisateur</option>
            <option value="Article">Article</option>
        </TypeStyle>
        <SearchBarStyle
            id= "SearchBar"
            type="text"
            placeholder="Rechercher un article ou un utilisateur..."
            value={query}
            onChange={handleInputChange}
        />
        {/* <button type="submit">Search</button> */}
    </SearchBarDivStyle>
  );
};

export default SearchBar;




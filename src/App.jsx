import { BrowserRouter, Routes, Route} from 'react-router-dom';
import PageArticle from './Pages/article';
import PagePrincipale from './Pages/accueil';
import PageArticleUtilisateur from './Pages/userArticles';
import PageFavoriUtilisateur from './Pages/userFavorites';
import React, { useState, useEffect } from 'react';
import Messagerie from './Pages/Messagerie';
import RechargePage from './Pages/Recharge';



function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [cate, setCate] = useState('');

  useEffect(() => {
    // Récupérer les données userInfo du stockage local lors du montage du composant
    const userInfoData = localStorage.getItem('userInfo');
    const searchType = localStorage.getItem('searchType');
    const searchQuery = localStorage.getItem('searchQuery');
    const categorie = localStorage.getItem('categorie');

    // console.log(userInfo)
    if (userInfoData) {
      setUserInfo(JSON.parse(userInfoData));
    }
    if(searchQuery && searchType){
      setQuery(searchQuery);
      setType(searchType);
    }
    if(categorie){
      setCate(categorie);
    }
  }, []);


  return (
    <>
      {/* <div id="searchBarApp" style={{ display: "none" }}>
        <div id="type">{type}</div>
        <div id="input">{query}</div>
      </div> */}
      <div id="userInfo" style={{ display: "none" }}>
        <div id="username">{userInfo && userInfo.username}</div>
        <div id="email">{userInfo && userInfo.email}</div>
        <div id="token">{userInfo && userInfo.token}</div>
        <div id="idUser">{userInfo && userInfo.id}</div>
        <div id="profilePic">{userInfo && userInfo.image}</div>
      </div>
      <div id="selectedItem" style={{ display: "none" }}>
        <div id="id"></div>
        <div id="title"></div>
        <div id="description"></div>
        <div id="price"></div>
      </div>
      <div id = "articleInfo" style = {{display : "none"}}>
        <div id = "articleId" ></div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PagePrincipale />} />
          <Route path="/article/:id" element={<PageArticle />} />
          <Route path="/myarticles" element={<PageArticleUtilisateur />} />
          <Route path="/myfavorites" element={<PageFavoriUtilisateur />} />
          <Route path="/messagerie" element={<Messagerie/>}/>
          <Route path="/recharge" element={<RechargePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

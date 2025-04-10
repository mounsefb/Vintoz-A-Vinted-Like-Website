//carte pour une habit 
import styled from "@emotion/styled";



export const CarteHabits = styled("div")`
    border: solid 0px ; 
    marginRight: 2em; 
    position: relative;
    display: flex; 
    flexDirection: column;
    alignItems: flex-start
`

export const CarteArticle = styled("div")`
    border: thick double #32a1ce; 
`

export const ExplicationArticle = styled("div")`
    marginLeft: 10px;
`

export const ImageHabits = styled("img")`
    width: 200px; 
    height: 300px;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: transform 0.3s;
    object-fit: cover;
    overflow: hidden; 

    &:hover {
        transform: scale(1.05);
    }

`
export const Prix = styled("p")`
    color: black;
    font-size: 16px; 
    margin-bottom: -2%;
`

export const Utilisateur = styled("div")`
    display: block;
`

export const ProfilPic = styled("img")`
    max-width: 20px;
    color: black;
    font-size: 35px;
    width : 100%;
    border-radius : 50%;
`

export const Nom = styled("p")`
    color: black;
    font-size: 15px;
    float : right;
    margin : 0;
    margin-left:0.5em;
    opacity : 50%;
`

export const Taille = styled("p")`
    color: grey;
    font-size: 12px; 
    margin-top: 3%; 
    margin-bottom: -0.5em;
`

export const Marque = styled("p")`
    color: grey;
    font-size: 35px; 
`


    
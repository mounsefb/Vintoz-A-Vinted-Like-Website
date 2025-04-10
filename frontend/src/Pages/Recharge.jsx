//page pour recharger son compte 
import styled from "@emotion/styled";
import React, { useState, useRef, useEffect } from 'react';
import NavigationBar from '../Components/NavigationBar';

function RechargePage() {
  const [montantBase, setMontantBase] = useState(JSON.parse(localStorage.getItem("solde")));
  const [montantAjoute, setMontantAjoute] = useState(0);

  const handleRecharge = async () => {
    if(montantAjoute>0){
        // Logique de recharge : appel d'une API pour mettre à jour le solde du compte
        try{
          let bodyCo = {};
          bodyCo.solde = montantAjoute + montantBase;
          console.log(bodyCo);
          let id = document.querySelector("#idUser").textContent;
          const response=await(await fetch(`https://vintoz.osc-fr1.scalingo.io/api/users/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token' : JSON.parse(localStorage.getItem("userInfo")).token
            },
            body: JSON.stringify(bodyCo)
          })).json();
          if(!response.status) throw {message : response.message};
          
          localStorage.setItem("solde", montantAjoute + montantBase);

        }
        catch(error){
          alert(error.message)
        }
        
        setMontantBase(montantBase + montantAjoute);
        setMontantAjoute(0); // Réinitialise le montant ajouté à 0 après la recharge
    } else {
        alert("Veuillez entrez un montant valide");
    }
  };

  return (
    <div>
      <NavigationBar/>
      <h1 style={{display : "flex",alignItems: "center", flexDirection: "column", justifyContent: "center",marginRight : "", marginTop: "2em"}}>Recharge de compte</h1>
      <div style={{display : "flex",alignItems: "center", flexDirection: "column", justifyContent: "center",marginRight : "", marginTop: "0 auto "}}>
        <p>Montant de base: {montantBase}</p>
        <p>Montant ajouté: {montantAjoute}</p>
        <input
          type="number"
          value={montantAjoute}
          onChange={(e) => setMontantAjoute(parseInt(e.target.value))}
        />
        <button onClick={handleRecharge}>Recharger</button>
      </div>
    </div>
  );
}

export default RechargePage;

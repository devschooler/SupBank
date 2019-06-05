import React, { Component } from 'react';
import Blocks from './Blocks';
import Block from './Block';
import image from '../src/images/SUPFILE_white.png';
class App  extends Component  {
    state = { walletInfo: {}};

    componentDidMount(){ 
       fetch('http://localhost:3000/api/wallet-info').then(response => response.json()).then(json => this.setState({ walletInfo: json }));
       

    }



    render() { 
        const { address, balance } = this.state.walletInfo;
        return ( 
           <div> 
               <div className='info'> 

               <div className="welcome">
                   <div className='icon'> 
                    <img className='supbank-logo' src={image}/>
                   </div>
                Bienvene sur l'Explorateur de la blockchain de SupBank 
                Ici vous pourrez voir les blocks des transactions en supcoin
               
                
                </div>

                <div className='perso'> 
                 voici vos informations personnelles, ne les communiquez qu'avec des personnes de confiances ! 
                <div> addresse du compte : {address}</div>
               <div> Solde du compte : {balance} </div>
               
               </div>
        
               <br/>
               <div className="liste"> 
               <Blocks/>
               </div>
               </div>
           </div> 
        );
    }
}

export default App;

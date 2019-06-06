import React, { Component } from 'react';
import Blocks from './Blocks';
import Block from './Block';
import { Link } from 'react-router-dom';
import image from '../src/images/SUPBANK_white(sans background).png';
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

               <br />
        <div className='btn-nav'><Link to='/blocks'> Cliquez ici pour explorer la blockchain </Link></div>
        //<div className='btn-nav'><Link to='/launch-transaction'>Effectuer un virement </Link></div>

               
               </div>
        
               <br/>
               <div className="liste"> 
               
               </div>
               </div>
           </div> 
        );
    }
}

export default App;

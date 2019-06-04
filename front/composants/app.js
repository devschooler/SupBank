import React, { Component } from 'react';
import Blocks from './Block';
class App  extends Component  {
    state = { walletInfo: {}};

    componentDidMount(){ 
       fetch('http://localhost:3000/api/wallet-info').then(response => response.json()).then(json => this.setState({ walletInfo: json }));
       

    }



    render() { 
        const { address, balance } = this.state.walletInfo;
        return ( 
           <div> 
               Bienvenue sur la blockchain de SupBank
               <div> addresse du compte : {address}</div>
               <div> Solde du compte : {balance} </div>
               <br/>
               <Blocks/>
           </div> 
        );
    }
}

export default App;

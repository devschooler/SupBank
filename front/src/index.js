import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import App from '../composants/app';
import Blocks from '../composants/Blocks';
import './style.css';
import saveHistory from '../composants/saveHistory';
import LaunchTransaction from '../composants/LaunchTransaction';
import DisplayTransactionPool from '../composants/DisplayTransactionPool';



render(
    <Router history={saveHistory}>
        <Switch> 
        <Route exact path='/' component={App} />
      <Route path='/blocks' component={Blocks} />
      <Route path='/launch-transaction' component={LaunchTransaction} />
      <Route path='/display-transaction-pool' component={DisplayTransactionPool} />

        </Switch>
    </Router>,
     document.getElementById('root')
);
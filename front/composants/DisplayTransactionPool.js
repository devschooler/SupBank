import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import history from '../composants/saveHistory';

const POLL_INERVAL_MS = 10000;

class DisplayTransactionPool extends Component {
  state = { transactionPoolMap: {} };

  GetTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-map`)
      .then(response => response.json())
      .then(json => this.setState({ transactionPoolMap: json }));
  }

  getMinedTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`)
      .then(response => {
        if (response.status === 200) {
          alert('ok');
          history.push  ('/blocks');
        } else {
          alert('La liste des transactions minés est indisponible.');
        }
      });
  }

  componentDidMount() {
    this.GetTransactionPoolMap();

    this.fetchPoolMapInterval = setInterval(
      () => this.GetTransactionPoolMap(),
      POLL_INERVAL_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }

  render() {
    return (
      <div className='TransactionPool'>
        <div className='btn-nav'><Link to='/'>Retour à votre compte  </Link></div>
        <h3>Liste des transactions </h3>
        {
          Object.values(this.state.transactionPoolMap).map(transaction => {
            return (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            )
          })
        }
        <hr />
        <Button
          bsStyle="danger"
          onClick={this.getMinedTransactions}
        >
        Miner la transaction
          </Button>
      </div>
    )
  }
}

export default DisplayTransactionPool;
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {
  state = { TransactionOnScreen: false };

  hitTransact = () => {
    this.setState({ TransactionOnScreen: !this.state.TransactionOnScreen });
  }

  get TransactionScreen() {
    const { data } = this.props.block;

    const stringifiedData = JSON.stringify(data);

    const dataDisplay = stringifiedData.length > 35 ?
      `${stringifiedData.substring(0, 35)}...` :
      stringifiedData;

    if (this.state.TransactionOnScreen) {
      return (
        <div>
          {
            data.map(transaction => (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            ))
          }
          <br />
          <Button
            bsStyle="danger"
            bsSize="small"
            onClick={this.hitTransact}
          >
            masquer
          </Button>
        </div>
      )
    }

    return (
      <div>
        <div>Données: {dataDisplay}</div>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={this.hitTransact}
        >
          Plus de détails
        </Button>
      </div>
    );
  }

  render() {
    const { timestamp, hash } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
      <div className='Block'>
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
        {this.TransactionScreen}
      </div>
    );
  }
};

export default Block;
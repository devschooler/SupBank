import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../composants/saveHistory';

class LaunchTransaction extends Component {
    state = { recipient: '', amount: 0, knownAddresses: [] };
  
    componentDidMount() {
        fetch(`${document.location.origin}/api/known-addresses`)
          .then(response => response.json())
          .then(json => this.setState({ knownAddresses: json }));
      }
    
      ModifiyRecipient = event => {
        this.setState({ recipient: event.target.value });
      }
    
      ModifyAmount = event => {
        this.setState({ amount: Number(event.target.value) });
      }
    
      LaunchTransaction = () => {
        const { recipient, amount } = this.state;
    
        fetch(`${document.location.origin}/api/transact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
          .then(json => {
            alert(json.message || json.type);
            history.push('/home');
          });
      }
  render() {
    return (
      <div className='LaunchTransaction'>
       <div className='btn-nav'> <Link to='/home'>retour à votre compte</Link> </div>
        <h3>Effectuer un virement </h3>
        <br />
        <h4>Addresse connue</h4>
        {
          this.state.knownAddresses.map(knownAddress => {
            return (
              <div key={knownAddress}>
                <div>{knownAddress}</div>
                <br />
              </div>
            );
          })
        }
        <br />
        <FormGroup>
          <FormControl
            input='text'
            placeholder='addresse du receveur '
            value={this.state.recipient}
            onChange={this.ModifiyRecipient}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='number'
            placeholder='montant'
            value={this.state.amount}
            onChange={this.ModifyAmount}
          />
        </FormGroup>
        <div>
          <Button
            bsStyle="danger"
            onClick={this.LaunchTransaction}
          >
           Envoyer
          </Button>
        </div>
      </div>
    )
  }
};

export default LaunchTransaction;
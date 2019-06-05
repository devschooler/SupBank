import React from 'react';

const Transaction = ({ transaction }) => {
  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <div className='Transaction'>
      <div>From: {`${input.address.substring(0, 20)}...`} | Solde restant : {input.amount}</div>
      {
        recipients.map(recipient => (
          <div key={recipient}>
            To: {`${recipient.substring(0, 20)}...`} | montant envoyé : {outputMap[recipient]}
          </div>
        ))
      }
    </div>
  );
}

export default Transaction;
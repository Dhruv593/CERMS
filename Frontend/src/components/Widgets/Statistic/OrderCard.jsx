import React from 'react';
import { Card } from 'react-bootstrap';

// ==============================|| ORDER CARD ||============================== //

const OrderCard = ({ params }) => {
  let cardClass = ['order-card'];
  if (params.class) {
    cardClass = [...cardClass, params.class];
  }

  return (
    <Card className={cardClass.join(' ')}>
      <Card.Body>
        <h6 className="text-white">{params.title}</h6>
        <h2 className="text-end text-white">
          {typeof params.icon === 'object' ? (
            <span className="float-start">{params.icon}</span>
          ) : (
            <i className={`float-start ${params.icon}`} />
          )}
          <span>{params.primaryText}</span>
        </h2>
        <p className="mb-0">
          {params.secondaryText}
          <span className="float-end">{params.extraText}</span>
        </p>
      </Card.Body>
    </Card>
  );
};

export default OrderCard;
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 650px;
  display: flex;
  align-items: center;
`;

const ElementValue = styled.div`
  color: white;
  font-size: 1.5rem;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AlertElement = (props) => {
  return (
    <Container>
      <Link
        style={{
          color: "white",
          fontSize: "1.5rem",
          textDecoration: "none",
          width: "110px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        to={`/stock/${props.data.ticker.toUpperCase()}`}
      >
        {props.data.ticker.toUpperCase()}
      </Link>
      {props.data.MA_period ? (
        <ElementValue
          style={{ width: "325px" }}
        >{`${props.data.MA_period} Day Moving Avg`}</ElementValue>
      ) : (
        <ElementValue style={{ width: "325px" }}>Current Price</ElementValue>
      )}
      {props.data.operation === ">=" ? (
        <ElementValue style={{ width: "50px" }}>≥</ElementValue>
      ) : (
        <ElementValue style={{ width: "50px" }}>≤</ElementValue>
      )}
      <ElementValue
        style={{ width: "175px" }}
      >{`$${props.data.trigger_price.toFixed(2)}`}</ElementValue>
    </Container>
  );
};

export default AlertElement;

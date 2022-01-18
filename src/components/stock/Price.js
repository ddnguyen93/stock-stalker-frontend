import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 40px;
  width: 600px;
  position: relative;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
`;

const CurrentPrice = styled.div`
  color: white;
  font-size: 2rem;
  margin-right: 5px;
`;

const PriceChange = styled.div`
  color: ${(props) => props.color};
  font-size: 2rem;
  margin-left: 5px;
`;

const Price = (props) => {
  const { hist_data } = props.data;
  let changeInPrice =
    hist_data[hist_data.length - 1].price -
    hist_data[hist_data.length - 2].price;

  let color = "white";
  if (changeInPrice > 0) {
    color = "green";
  } else if (changeInPrice < 0) {
    color = "red";
  } else if (changeInPrice === 0) {
    color = "white";
  }
  let addSymbol = "";
  if (changeInPrice > 0) {
    addSymbol = "+";
  }

  let percentChange =
    (changeInPrice / hist_data[hist_data.length - 2].price) * 100;

  return (
    <Container>
      <CurrentPrice>
        {"$" + hist_data[hist_data.length - 1].price.toFixed(2)}
      </CurrentPrice>
      <PriceChange color={color}>
        {addSymbol +
          changeInPrice.toFixed(2) +
          "\xa0\xa0" +
          "(" +
          percentChange.toFixed(2) +
          "%)"}
      </PriceChange>
    </Container>
  );
};

export default Price;

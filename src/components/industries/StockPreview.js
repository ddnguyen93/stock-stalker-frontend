import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  height: 60px;
  width: 100%;
  position: relative;
`;

const FullName = styled.div`
  position: absolute;
  color: white;
  top: 40px;
  font-size: 0.9rem;
  left: 5px;
`;

const CurrentPrice = styled.div`
  position: absolute;
  color: ${(props) => props.color};
  right: 280px;
  top: 5px;
  font-size: 1.5rem;
`;

const PriceChange = styled.div`
  position: absolute;
  color: ${(props) => props.color};
  right: 150px;
  top: 5px;
  font-size: 1.5rem;
`;

const PercentChange = styled.div`
  position: absolute;
  color: ${(props) => props.color};
  right: 10px;
  top: 5px;
  font-size: 1.5rem;
`;

const StockPreview = (props) => {
  const { ticker, full_name, hist_data } = props.data;
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
      <Link
        style={{
          position: "absolute",
          color: "white",
          fontSize: "1.5rem",
          top: "5px",
          left: "5px",
          textDecoration: "none",
        }}
        to={`/stock/${ticker.toUpperCase()}`}
      >
        {ticker.toUpperCase()}
      </Link>
      <FullName>{full_name}</FullName>
      <CurrentPrice color={color}>
        {"$" + hist_data[hist_data.length - 1].price.toFixed(2)}
      </CurrentPrice>
      <PriceChange color={color}>
        {addSymbol + changeInPrice.toFixed(2)}
      </PriceChange>
      <PercentChange color={color}>
        {percentChange.toFixed(2) + "%"}
      </PercentChange>
    </Container>
  );
};

export default StockPreview;

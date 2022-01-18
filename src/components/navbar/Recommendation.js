import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 34px;
  font-size: 1.4rem;
  border-bottom: solid;
  border-width: 1px;
  border-color: rgb(122, 121, 121);
  display: flex;
  align-items: center;
  color: rgb(77, 77, 77);

  &:hover {
    background-color: rgb(191, 191, 191);
  }
`;

const Recommendation = (props) => {
  let companyName = props.data.full_name;
  if (props.data.full_name.length >= 18) {
    companyName = companyName.slice(0, 18) + "...";
  }
  companyName = companyName + ` (${props.data.ticker})`;
  return (
    <Link to={`/stock/${props.data.ticker}`} style={{ textDecoration: "none" }}>
      <Container>{companyName}</Container>
    </Link>
  );
};

export default Recommendation;

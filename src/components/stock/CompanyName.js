import React from "react";
import styled from "styled-components";

const Container = styled.div`
  font-size: 2rem;
  color: white;
  text-align: center;
  margin: 10px;
`;

const CompanyName = (props) => {
  return <Container>{props.fullName + " (" + props.ticker + ")"}</Container>;
};

export default CompanyName;

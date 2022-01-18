import React from "react";
import styled from "styled-components";
import SectorList from "../components/industries/SectorList";
import Navbar from "../components/navbar/Navbar";

const PageContainer = styled.div`
  background-color: rgb(16, 39, 41);
  min-width: 850px;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  background-color: transparent;
  width: 100%;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, 600px);
  align-items: center;
  justify-items: center;
  justify-content: center;
  padding-top: 25px;
`;

const HomePage = () => {
  const sectorList = [
    "Technology",
    "Financial Services",
    "Communication Services",
    "Healthcare",
    "Consumer Cyclical",
    "Consumer Defensive",
    "Energy",
    "Industrials",
    "Real Estate",
    "Basic Materials",
    "Utilities",
  ];

  return (
    <PageContainer>
      <Navbar />
      <MainContent>
        {sectorList.map((sector) => {
          return <SectorList sector={sector} />;
        })}
      </MainContent>
    </PageContainer>
  );
};

export default HomePage;

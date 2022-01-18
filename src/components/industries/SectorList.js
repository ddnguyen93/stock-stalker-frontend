import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StockPreview from "./StockPreview";

const Container = styled.div`
  width: 550px;
  height: 450px;
  border-style: solid;
  margin: 25px 0px 25px 0px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 5px rgb(11, 27, 28);
`;

const Title = styled.div`
  min-height: 50px;
  width: 100%;
  background-color: rgb(10, 20, 19);
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: solid black;
  border-radius: 8px 8px 0px 0px;
  color: white;
`;

const ListContainer = styled.div`
  width: 100%;
  flex-grow: 1;
  background-color: rgb(24, 41, 39);
  border-radius: 0px 0px 8px 8px;
  overflow-y: auto;
`;

const ListElement = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: solid;
  border-width: 2px;
  border-color: rgb(176, 176, 176);
  display: flex;
  align-items: center;
`;

const SectorList = (props) => {
  const [stockList, setStockList] = useState([]);

  async function fetchSectorList(sector_name) {
    try {
      const response = await fetch(
        `https://api.stock-stalker-api.com/sector/${sector_name}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      setStockList(responseData.sector_list);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchSectorList(props.sector);
  }, []);

  return (
    <Container>
      <Title>{props.sector}</Title>
      <ListContainer>
        {stockList.map((data) => {
          return (
            <ListElement>
              <StockPreview data={data} />
            </ListElement>
          );
        })}
      </ListContainer>
    </Container>
  );
};

export default SectorList;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

import { useAuth } from "../../context/auth-context";

import StockPreview from "../industries/StockPreview";

const Container = styled.div`
  width: 550px;
  min-height: 400px;
  max-height: 600px;
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
  position: relative;
  display: flex;
`;

const FavouritesList = () => {
  const [favList, setFavList] = useState([]);

  const auth = useAuth();

  const fetchFavList = async () => {
    const sortByTicker = (a, b) => {
      if (a.ticker < b.ticker) {
        return -1;
      } else {
        return 1;
      }
    };

    await auth.checkTokenExpiry();
    const storedData = await JSON.parse(localStorage.getItem("userData"));

    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/favourites_list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedData.accessToken,
          },
        }
      );
      const responseData = await response.json();
      responseData.fav_list.sort(sortByTicker);
      setFavList(responseData.fav_list);
    } catch (err) {
      console.log(err);
    }
  };

  const RemoveFavHandler = async (stockId) => {
    await auth.checkTokenExpiry();
    const storedData = await JSON.parse(localStorage.getItem("userData"));

    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/favourites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedData.accessToken,
          },
          body: JSON.stringify({
            stock_id: stockId,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.msg) {
        console.log(responseData.msg);
        return;
      } else {
        await fetchFavList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFavList();
  }, []);

  return (
    <Container>
      <Title>Favourites</Title>
      <ListContainer>
        {favList.map((data) => {
          return (
            <ListElement>
              <StockPreview data={data} />
              <AiOutlineClose
                size={20}
                style={{
                  color: "white",
                  position: "absolute",
                  right: "8px",
                  bottom: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  RemoveFavHandler(data._id);
                }}
              />
            </ListElement>
          );
        })}
      </ListContainer>
    </Container>
  );
};

export default FavouritesList;

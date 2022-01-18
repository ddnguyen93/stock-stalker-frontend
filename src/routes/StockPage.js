import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import CompanyName from "../components/stock/CompanyName";
import LoadingScreen from "../components/loadingscreen/LoadingScreen";
import Graph from "../components/stock/Graph";
import Price from "../components/stock/Price";
import Alert from "../components/stock/Alert";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { useAuth } from "../context/auth-context";

const PageContainer = styled.div`
  background-color: rgb(16, 39, 41);
  min-width: 900px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const MainContent = styled.div`
  background-color: transparent;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: white;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 10px;
`;

const StockPage = () => {
  const [data, setData] = useState();
  const [favourite, setFavourite] = useState(false);
  let { ticker } = useParams();

  const auth = useAuth();

  const fetchStockData = async (symbol) => {
    try {
      const response = await fetch(
        `https://api.stock-stalker-api.com/stock/${symbol}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFavourite = async () => {
    await auth.checkTokenExpiry();
    const storedData = await JSON.parse(localStorage.getItem("userData"));

    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/favourites",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedData.accessToken,
          },
        }
      );
      const responseData = await response.json();
      if (data) {
        if (responseData.fav_list.indexOf(data._id) >= 0) {
          setFavourite(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const FavouriteHandler = async () => {
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
            stock_id: data._id,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.msg) {
        return;
      }
      setFavourite(responseData.favourite);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setData();
    fetchStockData(ticker);
  }, [ticker]);

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchFavourite();
    }
  }, [data]);

  function displayPage() {
    if (!data) {
      return <LoadingScreen />;
    }

    if (!data.message) {
      return (
        <MainContent>
          <Container>
            <CompanyName
              fullName={data.full_name}
              ticker={data.ticker.toUpperCase()}
            />
            {auth.isLoggedIn &&
              (favourite ? (
                <AiFillStar
                  size={36}
                  style={{ color: "white" }}
                  onClick={FavouriteHandler}
                />
              ) : (
                <AiOutlineStar
                  size={36}
                  style={{ color: "white" }}
                  onClick={FavouriteHandler}
                />
              ))}
          </Container>
          <Price data={data} />
          <Graph data={data.hist_data} ticker={data.ticker.toUpperCase()} />
          <Alert stockId={data._id} />
        </MainContent>
      );
    } else {
      return (
        <MainContent style={{ justifyContent: "center" }}>
          <ErrorMessage>
            {data.recommended_list.length > 0
              ? "Sorry, this ticker does not exist. Do you mean?"
              : "Sorry, this ticker does not exist."}
          </ErrorMessage>
          {data.recommended_list.map((data) => {
            return (
              <Link
                style={{ color: "white", fontSize: "1.3rem" }}
                to={`/stock/${data.ticker.toUpperCase()}`}
              >
                {`${data.full_name} (${data.ticker.toUpperCase()})`}
              </Link>
            );
          })}
        </MainContent>
      );
    }
  }

  return (
    <PageContainer>
      <Navbar />
      {displayPage()}
    </PageContainer>
  );
};

export default StockPage;

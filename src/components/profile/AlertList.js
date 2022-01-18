import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/auth-context";

import AlertElement from "./AlertElement";

const Container = styled.div`
  width: 750px;
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
  display: flex;
  align-items: center;
`;

const RemoveBtn = styled.button`
  margin: 0px 5px 0px 5px;
  height: 25px;
  width: 80px;
  background-color: rgb(80, 250, 216);
  border-radius: 5px;
  border: none;
  font-size: 1rem;

  &:hover {
    cursor: pointer;
  }
`;

const AlertList = () => {
  const [alertList, setAlertList] = useState([]);
  const auth = useAuth();

  const fetchAlertList = async () => {
    await auth.checkTokenExpiry();
    const storedData = await JSON.parse(localStorage.getItem("userData"));

    const sortByTicker = (a, b) => {
      if (a.ticker < b.ticker) {
        return -1;
      } else {
        return 1;
      }
    };

    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/alertslist",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedData.accessToken,
          },
        }
      );
      const responseData = await response.json();
      responseData.alerts.sort(sortByTicker);
      setAlertList(responseData.alerts);
    } catch (err) {
      console.log(err);
    }
  };

  const AlertDeleteHandler = async (alertData) => {
    await auth.checkTokenExpiry();
    const storedData = await JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await fetch("https://api.stock-stalker-api.com/alerts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedData.accessToken,
        },
        body: JSON.stringify({
          operation: alertData.operation,
          stock_id: alertData.stock_id,
          alert_type: alertData.alert_type,
          trigger_price: alertData.trigger_price,
          MA_period: alertData.MA_period,
        }),
      });
      const responseData = await response.json();
      fetchAlertList();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAlertList();
  }, []);
  return (
    <Container>
      <Title>Alerts</Title>
      <ListContainer>
        {alertList.map((data) => {
          return (
            <ListElement>
              <AlertElement data={data} />
              <RemoveBtn
                onClick={() => {
                  AlertDeleteHandler(data);
                }}
              >
                Remove
              </RemoveBtn>
            </ListElement>
          );
        })}
      </ListContainer>
    </Container>
  );
};

export default AlertList;

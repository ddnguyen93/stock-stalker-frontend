import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/auth-context";

const Container = styled.div`
  width: 800px;
  border-style: solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  background-color: rgb(24, 60, 64);
  padding: 5px;
  position: relative;
`;

const Title = styled.div`
  color: white;
  font-size: 1.5rem;
  text-decoration: underline;
`;

const InputContainer = styled.form`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  filter: ${(props) => `blur(${props.blurValue})`};
`;

const InputLabel = styled.label`
  color: white;
  margin: 5px;
`;

const AlertType = styled.select`
  margin: 5px;
`;

const InputValue = styled.input`
  width: 50px;
  margin: 5px;
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
`;

const AddBtn = styled.button`
  margin: 0px 5px 0px 5px;
  background-color: rgb(80, 250, 216);
  border-radius: 5px;
  font-size: 1rem;
  padding: 3px 10px 3px 10px;
  border: none;
  &:hover {
    cursor: pointer;
  }
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

const ListContainer = styled.div`
  width: 510px;
  min-height: 150px;
  filter: ${(props) => `blur(${props.blurValue})`};
`;

const AlertInput = styled.div`
  display: grid;
  grid-template-columns: 220px 90px 150px 100px;
  align-items: center;
  justify-items: center;
`;

const LabelTitle = styled.div`
  color: white;
  margin: 5px;
  text-decoration: underline;
`;

const ElementValue = styled.div`
  color: white;
  margin: 5px;
  /* border: 1px solid rgb(140, 237, 227); */
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AlertColumnsLabel = styled.div`
  display: grid;
  grid-template-columns: 220px 90px 150px 100px;
  align-items: center;
  justify-items: center;
`;

const LoginBlocker = styled.div`
  background-color: transparent;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginMessage = styled.div`
  color: rgb(52, 209, 177);
  font-weight: 700;
  font-size: 1.2rem;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
`;

const LoginBtn = styled.button`
  font-size: 1rem;
  margin: 10px 0px 0px 0px;
  background-color: rgb(52, 209, 177);
  border-radius: 5px;
  border: none;
  height: 30px;
  width: 80px;
  color: black;

  &:hover {
    cursor: pointer;
  }
`;

const Alert = (props) => {
  const [alertType, setAlertType] = useState("current");
  const [inputOperator, setInputOperator] = useState(">=");
  const [inputPeriod, setInputPeriod] = useState();
  const [inputValue, setInputValue] = useState();
  const [alertList, setAlertList] = useState([]);
  const [blurValue, setBlurValue] = useState("0");
  const [redirectLogin, setRedirectLogin] = useState(false);

  const auth = useAuth();

  const fetchAlertList = async () => {
    await auth.checkTokenExpiry();
    const storedData = await JSON.parse(localStorage.getItem("userData"));

    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/alertslist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedData.accessToken,
          },
          body: JSON.stringify({
            stock_id: props.stockId,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.alerts) {
        setAlertList(responseData.alerts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const AlertAddHandler = async (event) => {
    event.preventDefault();
    await auth.checkTokenExpiry();
    const storedData = await JSON.parse(localStorage.getItem("userData"));

    try {
      const response = await fetch("https://api.stock-stalker-api.com/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + storedData.accessToken,
        },
        body: JSON.stringify({
          operation: inputOperator,
          stock_id: props.stockId,
          alert_type: alertType,
          trigger_price: inputValue,
          MA_period: inputPeriod,
        }),
      });
      const responseData = await response.json();
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
      fetchAlertList();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchAlertList();
    }
  }, []);

  useEffect(() => {
    if (auth.isLoggedIn) {
      setBlurValue("0");
    } else {
      setBlurValue("10px");
    }
  }, [auth.isLoggedIn]);

  return (
    <Container>
      {redirectLogin && <Redirect to="/login" push />}
      {!auth.isLoggedIn && (
        <LoginBlocker>
          <LoginMessage>
            To have alerts sent to your email, please log in.{" "}
          </LoginMessage>
          <LoginBtn
            onClick={(e) => {
              auth.setCurrentPage(window.location.pathname);
              setRedirectLogin(true);
            }}
          >
            Login
          </LoginBtn>
        </LoginBlocker>
      )}
      <Title>Alerts</Title>
      <InputContainer onSubmit={AlertAddHandler} blurValue={blurValue}>
        <InputLabel>Type:</InputLabel>
        <AlertType
          onChange={(e) => {
            setAlertType(e.target.value);
          }}
        >
          <option value="current">Current Price ($)</option>
          <option value="average">Moving Average ($)</option>
        </AlertType>
        <AlertType
          onChange={(e) => {
            setInputOperator(e.target.value);
          }}
        >
          <option value=">=">≥</option>
          <option value="<=">≤</option>
        </AlertType>
        <InputLabel style={{ marginRight: "0px" }}>Value: $</InputLabel>
        <InputValue
          onChange={(e) => setInputValue(e.target.value)}
          type="number"
          min="0"
          step=".01"
          required
        />
        {alertType === "average" && (
          <div>
            <InputLabel>Period:</InputLabel>
            <InputValue
              onChange={(e) => setInputPeriod(e.target.value)}
              type="number"
              min="2"
              step="1"
              required
            />
            <InputLabel>Days</InputLabel>
          </div>
        )}
        <AddBtn type="submit">Add</AddBtn>
      </InputContainer>
      <ListContainer blurValue={blurValue}>
        <AlertColumnsLabel>
          <LabelTitle>Type</LabelTitle>
          <LabelTitle>Operator</LabelTitle>
          <LabelTitle>Trigger Price</LabelTitle>
        </AlertColumnsLabel>
        {alertList.map((x) => {
          return (
            <AlertInput>
              {x.MA_period ? (
                <ElementValue>{`${x.MA_period} Day Moving Average`}</ElementValue>
              ) : (
                <ElementValue>Current Price</ElementValue>
              )}
              {x.operation === ">=" ? (
                <ElementValue>≥</ElementValue>
              ) : (
                <ElementValue>≤</ElementValue>
              )}
              <ElementValue>{`$${x.trigger_price.toFixed(2)}`}</ElementValue>
              <ElementValue>
                <RemoveBtn
                  onClick={() => {
                    AlertDeleteHandler(x);
                  }}
                >
                  Remove
                </RemoveBtn>
              </ElementValue>
            </AlertInput>
          );
        })}
      </ListContainer>
    </Container>
  );
};

export default Alert;

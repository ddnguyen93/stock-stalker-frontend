import React, { useState } from "react";
import styled from "styled-components";
import { FaUserAlt, FaKey } from "react-icons/fa";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import Logo from "../assets/logo6.png";

const PageContainer = styled.div`
  background-color: rgb(16, 39, 41);
  width: 100%;
  height: 100vh;
`;

const Title = styled.div`
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 10px;
`;

const LogoContainer = styled.img`
  width: 200px;
  margin: 50px 0px 20px 0px;
`;

const MainContainer = styled.div`
  background-image: linear-gradient(rgb(13, 38, 41), rgb(31, 86, 92));
  width: 450px;
  min-height: 425px;
  border-radius: 10px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  box-shadow: 0px 0px 15px 15px rgb(11, 27, 28);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 5px;
`;

const InputContainer = styled.div`
  width: 70%;
  margin: 10px;
  /* border: solid; */
  display: flex;
`;

const Input = styled.input`
  background-color: transparent;
  border-width: 0px 0px 2px 0px;
  color: white;
  margin-left: 10px;
  width: 80%;
  font-size: 1rem;
  outline: none;
`;

const ErrorContainer = styled.div`
  background-color: rgb(16, 39, 41);
  color: white;
  min-width: 200px;
  max-width: 300px;
  height: 75px;
  text-align: center;
  display: ${(props) => props.display.type};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border-color: white;
  border-style: solid;
  border-width: 1px;
  margin: 20px;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [display, setDisplay] = useState({ type: "none" });
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useAuth();

  const LoginHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://api.stock-stalker-api.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const responseData = await response.json();

      if (responseData.access_token && responseData.refresh_token) {
        auth.login(
          responseData.access_token,
          responseData.refresh_token,
          responseData.expiry_time
        );
      } else {
        setDisplay({ type: "flex" });
        setErrorMessage(responseData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer>
      {auth.isLoggedIn && <Redirect to={auth.currentPage} />}
      <MainContainer>
        <LogoContainer src={Logo} alt="logo" />
        <Title>Stock Stalker</Title>
        <FormContainer onSubmit={LoginHandler}>
          <InputContainer>
            <FaUserAlt color={"white"} size={24} />
            <Input
              type="email"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <FaKey color={"white"} size={24} />
            <Input
              type="password"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              required
            />
          </InputContainer>
          <input type="submit" hidden />
        </FormContainer>
        <Link to="/registration" style={{ color: "white", margin: "5px" }}>
          Create New Account
        </Link>
        <Link to={auth.currentPage} style={{ color: "white", margin: "5px" }}>
          Continue Without Logging In.
        </Link>
        <ErrorContainer display={display}>{errorMessage}</ErrorContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default LoginPage;

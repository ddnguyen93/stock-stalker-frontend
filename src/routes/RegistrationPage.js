import React, { useState } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";
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
  min-height: 500px;
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
  display: flex;
  justify-content: right;
`;

const InputLabel = styled.label`
  color: white;
`;

const Input = styled.input`
  background-color: transparent;
  border-width: 0px 0px 2px 0px;
  color: white;
  margin-left: 10px;
  width: 60%;
  font-size: 1rem;
  outline: none;
`;

const ErrorContainer = styled.div`
  background-color: rgb(16, 39, 41);
  color: white;
  min-width: 200px;
  max-width: 400px;
  text-align: center;
  display: ${(props) => props.display.type};
  align-items: center;
  border-radius: 10px;
  border-color: white;
  border-style: solid;
  border-width: 1px;
  margin: 10px 5px 20px 5px;
  padding: 5px;
`;

const RegisterBtn = styled.button`
  margin: 10px;
  font-size: 1.2rem;
  background-color: rgb(80, 250, 216);
  border-radius: 5px;
  padding: 5px;
  border: none;
  color: black;

  &:hover {
    cursor: pointer;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  color: rgb(80, 250, 216);
  top: 0px;
  left: 0px;
  margin: 10px 0px 0px 20px;

  &:hover {
    cursor: pointer;
  }
`;

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [display, setDisplay] = useState({ type: "none" });
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [message, setMessage] = useState("");

  const RegisterHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.message === "Data saved") {
        setDisplay({ type: "flex" });
        setMessage(
          "Your account has been created. Please check your email and click the link to verify your account. You will be redirected to the login page shortly."
        );
        setTimeout(() => {
          setRedirectLogin(true);
        }, 10000);

        // setRedirectLogin(true);
      } else {
        console.log(responseData.message);
        setDisplay({ type: "flex" });
        setMessage(
          "Email has already been taken. Please try again with another email."
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PageContainer>
      {redirectLogin && <Redirect to="/login" />}
      <MainContainer>
        <IconContainer onClick={() => setRedirectLogin(true)}>
          <IoReturnUpBackOutline size={42} />
        </IconContainer>
        <LogoContainer src={Logo} alt="Logo" />
        <Title>Registration</Title>
        <FormContainer onSubmit={RegisterHandler}>
          <InputContainer>
            <InputLabel>First Name:</InputLabel>
            <Input
              type="name"
              value={firstName}
              onInput={(e) => setFirstName(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Last Name:</InputLabel>
            <Input
              type="name"
              value={lastName}
              onInput={(e) => setLastName(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Email:</InputLabel>
            <Input
              type="email"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Password:</InputLabel>
            <Input
              type="password"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              required
            />
          </InputContainer>
          <RegisterBtn type="submit">Register</RegisterBtn>
        </FormContainer>
        <ErrorContainer display={display}>{message}</ErrorContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default RegistrationPage;

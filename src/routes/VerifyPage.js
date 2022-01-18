import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";

const PageContainer = styled.div`
  background-color: rgb(16, 39, 41);
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  color: white;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(14, 47, 51);
  border-radius: 10px;
  padding: 40px 10px 40px 10px;
  box-shadow: 0px 0px 15px 15px rgb(11, 27, 28);
`;

const MessageContainer = styled.div`
  max-width: 600px;
  text-align: center;
`;

const RequestNewLink = styled.form`
  display: ${(props) => props.display.type};
  flex-direction: column;
  align-items: center;
  margin: 5px;
`;

const EmailInput = styled.input`
  font-size: 1.2rem;
  margin: 5px;
`;

const SubmitBtn = styled.button`
  font-size: 1.2rem;
  margin: 5px;
  background-color: rgb(80, 250, 216);
  border-radius: 5px;
  border: none;
  height: 30px;
  width: 150px;
  color: black;

  &:hover {
    cursor: pointer;
  }
`;

const EmailMessage = styled.div`
  font-size: 1.1rem;
  margin: 5px 0px 0px 0px;
  /* border-style: solid;
  border-width: 1px;
  border-color: black; */
  /* padding: 2px; */
`;

const VerifyPage = () => {
  let { jwt } = useParams();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [display, setDisplay] = useState({ type: "none" });
  const [emailMessage, setEmailMessage] = useState("");

  const verifyAccount = async () => {
    try {
      const response = await fetch("https://api.stock-stalker-api.com/verify", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
      const responseData = await response.json();
      if (responseData.message) {
        setMessage(responseData.message);
      }
      if (responseData.msg === "Token has expired") {
        setMessage(
          "This verification link has expired. Please request a new verification link."
        );
        setDisplay({ type: "flex" });
      } else if (responseData.msg) {
        setMessage(
          "This verification link is not valid. Please check the link again or request a new verification link."
        );
        setDisplay({ type: "flex" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ResendHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://api.stock-stalker-api.com/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData) {
        setEmailMessage(responseData.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    verifyAccount();
  }, []);

  return (
    <PageContainer>
      <Container>
        <MessageContainer>{message}</MessageContainer>
        <RequestNewLink onSubmit={ResendHandler} display={display}>
          <EmailInput
            type="email"
            value={email}
            onInput={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <SubmitBtn type="submit">Send New Link</SubmitBtn>
          <EmailMessage>{emailMessage}</EmailMessage>
        </RequestNewLink>
        <Link to="/login" style={{ color: "rgb(80, 250, 216)" }}>
          Back to Login Page
        </Link>
      </Container>
    </PageContainer>
  );
};

export default VerifyPage;

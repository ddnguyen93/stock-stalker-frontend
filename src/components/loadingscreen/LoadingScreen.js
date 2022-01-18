import React from "react";
import styled, { keyframes } from "styled-components";
import { VscLoading } from "react-icons/vsc";

const Container = styled.div`
  background-color: rgb(16, 39, 41);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 1.5s linear infinite;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 2rem;
`;

const LoadingScreen = () => {
  const style = { color: "white" };
  return (
    <Container>
      <LoadingContainer>
        <Rotate>
          <VscLoading size={160} style={style}></VscLoading>
        </Rotate>
        <LoadingText>Loading</LoadingText>
      </LoadingContainer>
    </Container>
  );
};

export default LoadingScreen;

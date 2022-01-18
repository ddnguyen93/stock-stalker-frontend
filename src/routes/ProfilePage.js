import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";

import { useAuth } from "../context/auth-context";
import FavouritesList from "../components/profile/FavouritesList";
import AlertList from "../components/profile/AlertList";

const PageContainer = styled.div`
  background-color: rgb(16, 39, 41);
  min-width: 900px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  background-color: transparent;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const ProfilePage = () => {
  const auth = useAuth();
  return (
    <PageContainer>
      {!auth.isLoggedIn && <Redirect to="/" push />}
      <Navbar />
      <MainContent>
        <FavouritesList />
        <AlertList />
      </MainContent>
    </PageContainer>
  );
};

export default ProfilePage;

import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import { Redirect, Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/auth-context";
import Recommendation from "./Recommendation";

const NavContainer = styled.div`
  background-color: rgb(25, 63, 66);
  height: 50px;
  /* width: 100%; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0px 15px 15px rgb(11, 27, 28);
`;

const NavElementContainer = styled.div`
  width: 250px;
  display: flex;
  align-items: center;
`;

const WebsiteName = styled.div`
  color: white;
  font-size: 1.5rem;
  margin: 0px 5px 0px 5px;
  text-decoration: none;
`;

const LogoContainer = styled.img`
  width: 35px;

  margin: 0px 5px 0px 10px;
`;

const SearchBar = styled.input`
  width: 100%;
  outline: none;
  font-size: 1.5rem;
  border-radius: 5px;
`;

const Btn = styled.button`
  font-size: 1rem;
  margin: 0px 10px 0px 0px;
  background-color: rgb(80, 250, 216);
  border-radius: 5px;
  border: none;
  height: 30px;
  width: 80px;
  color: black;

  &:hover {
    cursor: pointer;
  }
`;

const RecommendedListContainer = styled.div`
  width: 408px;
  background-color: white;
  position: absolute;
  transform: translate(0%, 0%);
  top: 42px;
  border-radius: 5px;
  z-index: 1;
`;

const Navbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [recommendedList, setRecommendedList] = useState([]);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [redirectProfile, setRedirectProfile] = useState(false);
  const [redirectStock, setRedirectStock] = useState("");
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    window.addEventListener("click", (event) => {
      setRecommendedList([]);
    });
  }, []);

  const auth = useAuth();

  let { ticker } = useParams();

  async function fetchData(input) {
    if (!input) {
      setRecommendedList([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.stock-stalker-api.com/search/${input}`,
        {
          method: "GET",
        }
      );
      const responseData = await response.json();
      setRecommendedList(responseData.recommended_list);
      setFetchingData(true);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setSearchInput("");
    setRecommendedList([]);
  }, [ticker]);

  const debouncedFetchData = useCallback(debounce(fetchData, 200), []);

  return (
    <NavContainer>
      {redirectLogin && <Redirect to="/login" push />}
      {redirectProfile && <Redirect to="/profile" push />}
      {fetchingData && redirectStock && (
        <Redirect to={`/stock/${redirectStock}`} push />
      )}
      <NavElementContainer>
        <Link to="/" style={{ textDecoration: "none" }}>
          <WebsiteName>Stock Stalker</WebsiteName>
        </Link>
      </NavElementContainer>
      <NavElementContainer style={{ width: "400px" }}>
        <form
          style={{ width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
            setRedirectStock(searchInput);
          }}
        >
          <SearchBar
            placeholder="Search Stock Ticker"
            value={searchInput}
            onChange={(e) => {
              setFetchingData(false);
              setSearchInput(e.target.value);
              debouncedFetchData(e.target.value);
            }}
          />
          <input type="submit" hidden />
        </form>

        <RecommendedListContainer
          onClick={() => {
            setSearchInput("");
            setRecommendedList([]);
          }}
        >
          {recommendedList.map((data) => {
            return <Recommendation data={data} />;
          })}
        </RecommendedListContainer>
      </NavElementContainer>
      <NavElementContainer style={{ justifyContent: "right" }}>
        {auth.isLoggedIn ? (
          <div style={{ display: "flex", color: "white" }}>
            <Btn
              onClick={() => {
                setRedirectProfile(true);
              }}
            >
              Profile
            </Btn>
            <Btn
              onClick={() => {
                auth.logout();
              }}
            >
              Sign Out
            </Btn>
          </div>
        ) : (
          <Btn
            onClick={(e) => {
              auth.setCurrentPage(window.location.pathname);
              setRedirectLogin(true);
            }}
          >
            Login
          </Btn>
        )}
      </NavElementContainer>
    </NavContainer>
  );
};

export default Navbar;

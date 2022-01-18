import React, { useContext, useState } from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");

  function login(accessToken, refreshToken, expiryTime) {
    localStorage.setItem(
      "userData",
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiryTime: new Date(expiryTime + "Z"),
      })
    );
    setIsLoggedIn(true);
  }

  const checkAccessToken = async (accessToken, refreshToken) => {
    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/check_token",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      const responseData = await response.json();
      if (
        responseData.msg === "Token has expired" ||
        responseData.message === "Internal Server Error"
      ) {
        newAccessToken(refreshToken);
      } else if (responseData.msg === "Signature verification failed") {
        logout();
      } else if (responseData.msg === "Verification success") {
        setIsLoggedIn(true);
      } else {
        logout();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const newAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(
        "https://api.stock-stalker-api.com/refresh",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + refreshToken,
          },
        }
      );
      const responseData = await response.json();
      if (
        responseData.msg ||
        responseData.message === "Internal Server Error"
      ) {
        logout();
        return;
      }
      localStorage.setItem(
        "userData",
        JSON.stringify({
          accessToken: responseData.access_token,
          refreshToken: refreshToken,
          expiryTime: new Date(responseData.expiry_time + "Z"),
        })
      );
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
    }
  };

  const checkTokenExpiry = async () => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (new Date(storedData.expiryTime) < new Date(Date.now())) {
      await newAccessToken(storedData.refreshToken);
    }
    return;
  };

  function logout() {
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        login: login,
        logout: logout,
        setCurrentPage: setCurrentPage,
        currentPage: currentPage,
        newAccessToken: newAccessToken,
        checkAccessToken: checkAccessToken,
        checkTokenExpiry: checkTokenExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

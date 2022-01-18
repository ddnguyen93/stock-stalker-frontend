import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./routes/HomePage";
import LoginPage from "./routes/LoginPage";
import RegistrationPage from "./routes/RegistrationPage";
import StockPage from "./routes/StockPage";
import VerifyPage from "./routes/VerifyPage";

import { useAuth } from "./context/auth-context";
import ProfilePage from "./routes/ProfilePage";

const Routes = () => {
  const auth = useAuth();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (!storedData) {
      return;
    }
    if (new Date(storedData.expiryTime) > new Date(Date.now())) {
      auth.checkAccessToken(storedData.accessToken, storedData.refreshToken);
    } else {
      auth.newAccessToken(storedData.refreshToken);
    }
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/verify/:jwt" component={VerifyPage} />
        <Route exact path="/stock/:ticker" component={StockPage} />
        <Route exact path="/" component={HomePage} />
        <Route exact path="/registration" component={RegistrationPage} />
        <Route exact path="/profile" component={ProfilePage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;

import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/auth-context";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes />
      </div>
    </AuthProvider>
  );
}

export default App;

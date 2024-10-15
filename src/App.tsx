import React, { useContext } from "react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import Login from "./components/Login";
import Home from "./components/Home";
import { AuthContext, AuthContextType } from "./context/AuthContext";

const App: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        PDF Viewer & File Manager
      </h1>

      {!isAuthenticated ? <Login /> : <Home />}
    </div>
  );
};

export default App;

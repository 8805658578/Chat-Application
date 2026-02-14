import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import AppRoutes from "./config/Routess.jsx";
import App from "./App.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" /> 
        <ChatProvider>
          <AppRoutes/>
        </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);

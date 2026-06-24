import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { ContactsApp } from "./ContactsApp";
import { BlogPage } from "./pages/Blog";
import { TodoApp } from "./TodoApp";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <ContactsApp />
      <BlogPage />
      <TodoApp />
    </AuthProvider>
  </StrictMode>,
);

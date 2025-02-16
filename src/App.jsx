import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "@/components/AuthPage";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import ConfirmationModal from "@/components/ConfirmationModal";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import "./index.css";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const login = (credentials) => {
    const userExists = registeredUsers.find(
      (user) =>
        user.username === credentials.username &&
        user.password === credentials.password
    );
    if (userExists) setUser(credentials);
    else throw new Error("Invalid username or password");
  };

  const register = (credentials) => {
    setRegisteredUsers((prev) => [...prev, credentials]);
    setIsModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>Registration Successful!</h2>
        <p>You have been registered successfully.</p>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </AuthContext.Provider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<AuthPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

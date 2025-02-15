import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const toggleRegister = () => setShowRegister(!showRegister);
  const handleLogin = () => navigate("/dashboard");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 rounded-xl shadow bg-white">
        {showRegister ? (
          <RegisterForm toggleRegister={toggleRegister} />
        ) : (
          <LoginForm
            toggleRegister={toggleRegister}
            handleLogin={handleLogin}
          />
        )}
      </Card>
    </div>
  );
}

function LoginForm({ toggleRegister, handleLogin }) {
  return (
    <>
      <CardHeader className="text-2xl font-bold mb-4">Login</CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Username" />
        <Input placeholder="Password" type="password" />
        <Button className="w-full mt-4" onClick={handleLogin}>
          Login
        </Button>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={toggleRegister}
        >
          Register
        </Button>
      </CardContent>
    </>
  );
}

function RegisterForm({ toggleRegister }) {
  return (
    <>
      <CardHeader className="text-2xl font-bold mb-4">Register</CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Username" />
        <Input placeholder="Email" />
        <Input placeholder="Password" type="password" />
        <Input placeholder="Confirm Password" type="password" />
        <Button className="w-full mt-4">Register</Button>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={toggleRegister}
        >
          Back to Login
        </Button>
      </CardContent>
    </>
  );
}

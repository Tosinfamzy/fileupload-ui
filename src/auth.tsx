import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
interface IauthProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Auth = ({ setIsAuthenticated }: IauthProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        password,
      });
      alert(`User registered: ${response.data.username}`);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);
      alert("Login successful!");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  return (
    <>
      <h2 className="text-xl font-bold">Register / Login</h2>
      <TextInput
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2"
      />
      <TextInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2"
      />
      <div className="flex space-x-4">
        <Button
          onClick={handleRegister}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Register
        </Button>
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Auth;

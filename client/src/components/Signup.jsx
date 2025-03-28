import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SubmitButton from "./SubmitButton";
import Input from "./Input";
import Label from "./Label";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("User registered:", data);
      navigate("/home");
    } else {
      const errorData = await response.json();
      alert("Registration error: " + errorData.message);
    }
  };

  return (
    <div className="text-white bg-gradient-to-br from-green-500 via-orange-500 to-purple-500 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor={"email"}>Email address</Label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor={"password"}>Password</Label>
            </div>

            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <SubmitButton>Sign up</SubmitButton>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

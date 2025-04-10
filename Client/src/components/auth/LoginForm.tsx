import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authAPI } from "../../lib/apiServices";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await authAPI.login({ email, password });

      if (data.message === "You are logged in successfully!") {
        // Store the user ID
        localStorage.setItem("userId", data.userId);

        // Update auth state using your auth store
        await signIn(email, "dummy-token", data.userId);

        navigate("/dashboard");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
              <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-200">
                      Welcome back
                  </h2>
                  <p className="mt-2 text-center text-sm text-gray-400">
                      Sign in to continue your journey
                  </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {error && (
                      <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                          {error}
                      </div>
                  )}

                  <div className="rounded-md space-y-4">
                      <div className="relative">
                          <label htmlFor="email" className="sr-only">
                              Email address
                          </label>
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Email address"
                          />
                      </div>

                      <div className="relative">
                          <label htmlFor="password" className="sr-only">
                              Password
                          </label>
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                              id="password"
                              name="password"
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="appearance-none rounded-lg relative block w-full px-3 py-4 pl-10 bg-gray-800/50 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Password"
                          />
                      </div>
                  </div>

                  <div>
                      <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading}
                          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {isLoading ? (
                              <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                              "Sign In"
                          )}
                      </motion.button>
                  </div>

                  <div className="text-center">
                      <p className="text-sm text-gray-400">
                          Don't have an account?{" "}
                          <Link
                              to="/register"
                              className="text-blue-500 hover:text-blue-400"
                          >
                              Sign up
                          </Link>
                      </p>
                  </div>
              </form>
          </div>
      </div>
  );
};

export default LoginForm;

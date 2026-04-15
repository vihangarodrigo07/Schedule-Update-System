import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, University } from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../services/api";
import { saveUserData } from "../utils/auth";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters");
      return toast.error("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return toast.error("Passwords do not match");
    }

    try {
      const response = await authAPI.register(
        formData.first_name.trim(),
        formData.last_name.trim(),
        formData.email.trim(),
        formData.password
      );

      // Save user data (same as login)
      saveUserData(response);

      toast.success("Registration successful!");
      navigate("/profile");
    } catch (err) {
      const msg = err.message || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-university-blue p-4 rounded-2xl shadow-lg">
              <University className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agile University</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        {/* Card */}
        <div className="card">
          <div className="flex items-center mb-6">
            <UserPlus className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Sign Up</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* First Name */}
            <div className="mb-5">
              <label className="label">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  First Name
                </div>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                placeholder="First name"
                required
                disabled={loading}
              />
            </div>

            {/* Last Name */}
            <div className="mb-5">
              <label className="label">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Last Name
                </div>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Last name"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="label">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="student@university.edu"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="label">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  Password
                </div>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="label">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  Confirm Password
                </div>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? "Creating..." : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Link back to login (no change to Login page needed) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary-600 font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

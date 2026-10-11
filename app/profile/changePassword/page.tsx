"use client";

import React, { useState } from "react";
import { changePassword } from "@/lib/auth-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { translateAuthErrors } from "@/app/_lib/helpers/translateAuthErrors";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors = {} as typeof errors;
    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (error) {
        if (error.code === "INVALID_PASSWORD") {
          setErrors({ currentPassword: "Current password is incorrect" });
        }
        toast.error(
          translateAuthErrors(error.code || error.message || "") ||
            "Failed to update password"
        );
        console.error("Password update error:", error);
        setIsLoading(false);
        return;
      }

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Change Password</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password Field */}
        <div>
          <div className="flex justify-between mb-2">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-white"
            >
              Current Password
            </label>
          </div>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full px-3 py-2 bg-navy border rounded focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent ${
                errors.currentPassword
                  ? "border-red-500"
                  : "border-electric-blue/30"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div>
          <div className="flex justify-between mb-2">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-white"
            >
              New Password
            </label>
          </div>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2 bg-navy border rounded focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent ${
                errors.newPassword
                  ? "border-red-500"
                  : "border-electric-blue/30"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <div className="flex justify-between mb-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm New Password
            </label>
          </div>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 bg-navy border rounded focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-electric-blue/30"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;

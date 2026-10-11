"use client";

import { logoutUser } from "../actions/auth-actions";
import { toast } from "react-toastify";

/**
 * Client-side utility to handle logout, coordinating between auth context
 * and server actions
 *
 * @param {Function} contextLogout - The logout function from auth context
 * @param {Function} callback - Optional callback to run after logout
 * @returns {Promise<void>}
 */
export const handleLogout = async (contextLogout, callback) => {
  try {
    // Call server action to clear session
    const result = await logoutUser();

    if (!result.success) {
      toast.error("An error occurred while logging out");
      return;
    }

    // Update client-side auth state
    contextLogout();

    toast.success("Logged out successfully");

    if (callback && typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("An error occurred while logging out");
  }
};

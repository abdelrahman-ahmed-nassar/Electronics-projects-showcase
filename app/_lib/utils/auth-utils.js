"use client";

import { logoutUser } from "../actions/auth-actions";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

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

    // Show success message
    toast.success("Logged out successfully");

    // Run callback if provided (e.g., redirect to login)
    if (callback && typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("An error occurred while logging out");
  }
};

/**
 * Updates the user's auth state on application load or refresh
 *
 * @param {Function} updateAuthContext - The function to update auth context
 * @returns {Promise<void>}
 */
export const synchronizeAuthState = debounce(async (updateAuthContext) => {
  try {
    const response = await fetch("/api/auth/session");
    const data = await response.json();

    if (data.user) {
      updateAuthContext(data.user);
    }
  } catch (error) {
    console.error("Error synchronizing auth state:", error);
  }
}, 1000); // Debounce to limit calls to once per second

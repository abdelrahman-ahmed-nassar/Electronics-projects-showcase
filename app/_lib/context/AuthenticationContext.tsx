"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { UserInterface as User } from "@/app/Types";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: Partial<User>, redirectTo?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthenticationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load authentication state and user data from cookies on initial render
  useEffect(() => {
    const loadAuthState = async () => {
      setIsLoading(true);
      try {
        // Always check the session first
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
          // We don't set cookies here anymore - they should only be set during login
        } else {
          // Clear authentication state if session is invalid
          setIsAuthenticated(false);
          setUser(null);
          // Let the logout process handle cookie removal
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear authentication state on error
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = useCallback(
    (userData: Partial<User>, redirectTo?: string) => {
      try {
        if (!userData || !userData.id) {
          console.error("Invalid user data for login:", userData);
          toast.error("Invalid user data");
          return;
        }

        const userWithDefaults = {
          id: userData.id,
          name: userData.name,
          phone: userData.phone,
          nationalId: userData.nationalId,
          yearId: userData.yearId,
          email: userData.email,
          avatarImage: userData.avatarImage,
          isGraduated: userData.isGraduated,
          about: userData.about,
          skills: userData.skills,
          specialization: userData.specialization,
          role: userData.role,
          team: userData.team,
        } as User;

        setIsAuthenticated(true);
        setUser(userWithDefaults);

        const cookieOptions = {
          expires: 9999,
          sameSite: "strict" as const,
          secure: window?.location.protocol === "https:",
        };

        Cookies.set("isAuthenticated", "true", cookieOptions);
        Cookies.set("user", JSON.stringify(userWithDefaults), cookieOptions);

        toast.success("Login successful");

        if (redirectTo) {
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 500);
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred while trying to log in.");
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      Cookies.remove("isAuthenticated");
      Cookies.remove("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      if (user) {
        try {
          const updatedUser = { ...user, ...userData };
          setUser(updatedUser);

          // Update the cookie with the new user data
          const cookieOptions = {
            expires: 9999,
            sameSite: "strict" as const,
            secure: window?.location.protocol === "https:",
          };

          Cookies.set("user", JSON.stringify(updatedUser), cookieOptions);
        } catch (error) {
          console.error("Update user error:", error);
          toast.error("An error occurred while trying to update user data");
        }
      }
    },
    [user]
  );

  // Enhanced refreshUser function to properly handle team data
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if we already have a user ID in state
      const currentUserId = user?.id;
      // Preserve the current team value to compare after fetch
      const currentTeam = user?.team;

      const response = await fetch("/api/auth/session");
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();

      // If we have user data from the API
      if (data.user) {
        // Security check: if we already have a user but the IDs don't match,
        // this could be a session confusion issue - don't update
        if (currentUserId && data.user.id !== currentUserId) {
          console.error("Session user ID mismatch - possible security issue");
          setIsLoading(false);
          return;
        }

        // Log team values for debugging
        if (currentTeam !== data.user.team) {
          console.log(
            `Team value updated: ${currentTeam} -> ${data.user.team}`
          );
        }

        // Make sure team value is preserved and correctly typed
        const userData = {
          ...data.user,
          team: data.user.team !== undefined ? data.user.team : currentTeam,
        };

        setIsAuthenticated(true);
        setUser(userData);

        // We only update cookies if the user was not already authenticated
        // This prevents recreating cookies after logout
        if (!isAuthenticated) {
          // Update cookies with fresh data
            const cookieOptions = {
            expires: 9999, // No expiration (very far future date)
            sameSite: "strict" as const,
            secure: window?.location.protocol === "https:",
            };

          // Ensure all user profile fields are included in the cookie
          const userDataForCookie = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            nationalId: userData.nationalId,
            yearId: userData.yearId,
            avatarImage: userData.avatarImage,
            isGraduated: userData.isGraduated,
            about: userData.about,
            specialization: userData.specialization,
            role: userData.role,
            team: userData.team, // Ensure team is included
            skills: userData.skills,
          };

          Cookies.set("isAuthenticated", "true", cookieOptions);
          Cookies.set("user", JSON.stringify(userDataForCookie), cookieOptions);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove("isAuthenticated");
        Cookies.remove("user");
      }
    } catch (error) {
      console.error("Error refreshing user session:", error);
      setIsAuthenticated(false);
      setUser(null);
      Cookies.remove("isAuthenticated");
      Cookies.remove("user");
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Consolidate refreshUser logic to use a timer for hourly updates.
  useEffect(() => {
    // Call refreshUser once on initial load
    refreshUser();

    // Set up hourly refresh interval
    const interval = setInterval(() => {
      refreshUser();
    }, 3600000); // 1 hour in milliseconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthenticationProvider");
  }
  return context;
};

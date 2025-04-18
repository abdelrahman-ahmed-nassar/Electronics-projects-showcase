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
          // Update cookies with fresh data
          const cookieOptions = {
            expires: 7,
            sameSite: "strict" as const,
            secure: window.location.protocol === "https:",
          };
          Cookies.set("isAuthenticated", "true", cookieOptions);
          Cookies.set("user", JSON.stringify(data.user), cookieOptions);
        } else {
          // Clear cookies if session is invalid
          Cookies.remove("isAuthenticated");
          Cookies.remove("user");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Clear authentication state on error
        Cookies.remove("isAuthenticated");
        Cookies.remove("user");
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
          name: userData.name,
          phone: userData.phone,
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
          expires: 7,
          sameSite: "strict" as const,
          secure: window.location.protocol === "https:",
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
            expires: 7,
            sameSite: "strict" as const,
            secure: window.location.protocol === "https:",
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

  // Reintroduce the refreshUser function to restore session state on reload.
  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      if (data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user session:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  // Use refreshUser only once during the initial load.
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Modify the refreshUser logic to use a timer for hourly updates.
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 3600000); // 1 hour in milliseconds

    // Call refreshUser once on initial load
    refreshUser();

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

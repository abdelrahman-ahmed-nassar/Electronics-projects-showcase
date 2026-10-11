"use client";
import React, { createContext, useContext, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { UserInterface as User } from "@/app/Types";
import { useSession } from "@/lib/auth-client";

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
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  const [profileOverride, setProfileOverride] = React.useState<Partial<User>>(
    {}
  );

  const sessionUser = session?.user;
  const isAuthenticated = Boolean(sessionUser);

  const user = useMemo<User | null>(() => {
    if (!sessionUser) return null;
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name,
      ...profileOverride,
    } as User;
  }, [sessionUser, profileOverride]);

  const login = useCallback(
    (userData: Partial<User>, redirectTo?: string) => {
      if (!userData || !userData.id) {
        console.error("Invalid user data for login:", userData);
        toast.error("Invalid user data");
        return;
      }

      setProfileOverride(userData);
      refetch();
      toast.success("Login successful");

      if (redirectTo) {
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 500);
      }
    },
    [router, refetch]
  );

  const logout = useCallback(() => {
    setProfileOverride({});
    refetch();
  }, [refetch]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setProfileOverride((prev) => ({ ...prev, ...userData }));
  }, []);

  const refreshUser = useCallback(async () => {
    setProfileOverride({});
    await refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading: isPending,
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

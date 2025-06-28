'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

import { UserType } from '@/lib/types/user.type';

import useAuth from '@/hooks/use-auth';

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextType = {
  user?: UserType;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  isLoggingOut: boolean;
  refetch: () => void;
  setIsLoggingOut: (state: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();
  const user = data?.data?.user;

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isLoading,
        isFetching,
        isLoggingOut,
        refetch,
        setIsLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};

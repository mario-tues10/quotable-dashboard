import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { firebaseLogin } from "../services/firebaseAuth";

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  userEmail: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedEmail = localStorage.getItem("authEmail");
    if (savedToken) setToken(savedToken);
    if (savedEmail) setUserEmail(savedEmail);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { idToken, email: returnedEmail } = await firebaseLogin(
        email,
        password
      );
      setToken(idToken);
      setUserEmail(returnedEmail);
      localStorage.setItem("authToken", idToken);
      localStorage.setItem("authEmail", returnedEmail);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authEmail");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        userEmail,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

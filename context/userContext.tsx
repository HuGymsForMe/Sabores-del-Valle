import { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLogged: boolean;
  login: (usuario: string, password: string) => boolean;
  logout: () => void;
}

export const UserContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);

  const login = (usuario: string, password: string) => {
    if (usuario.trim() === "HuGyms" && password.trim() === "1234") {
      setIsLogged(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLogged(false);
  };

  return (
    <UserContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
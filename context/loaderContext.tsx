import { createContext, ReactNode, useContext, useState } from "react";

interface LoadingContextProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading debe usarse dentro de un LoadingProvider");
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  return (
    <LoadingContext.Provider value={{ loading, setLoading, loadingText, setLoadingText }}>
      {children}
    </LoadingContext.Provider>
  );
};

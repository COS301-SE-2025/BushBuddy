import React, { createContext, useState, useContext } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = () => setLoadingCount((count) => count + 1);
  const stopLoading = () => setLoadingCount((count) => Math.max(0, count - 1));

  return (
    <LoadingContext.Provider value={{ loadingCount, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
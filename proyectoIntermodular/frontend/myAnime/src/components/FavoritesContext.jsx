import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(prev => !prev);
  };

  return (
    <FavoritesContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
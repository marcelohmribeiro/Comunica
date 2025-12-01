import { createContext, useContext, useState, useCallback } from "react";

const VLibrasContext = createContext(undefined);

export const VLibrasProvider = ({ children }) => {
  const [content, setContent] = useState("");

  const updateContent = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const clearContent = useCallback(() => {
    setContent("");
  }, []);

  return (
    <VLibrasContext.Provider value={{ content, updateContent, clearContent }}>
      {children}
    </VLibrasContext.Provider>
  );
};

export const useVLibras = () => {
  const context = useContext(VLibrasContext);
  return context;
};

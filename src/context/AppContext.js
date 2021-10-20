const { useContext, createContext, useState } = wp.element;

export const getEndpoint = () => {
  return window?.wpGraphiQLSettings?.graphqlEndpoint ?? null;
};

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const [endpoint, setEndpoint] = useState(getEndpoint());
  const [nonce] = useState(window?.wpGraphiQLSettings?.nonce ?? null);
  const [query, setQuery] = useState(null);
  const [schema, setSchema] = useState(null);

  const appContext = {
    endpoint,
    setEndpoint,
    nonce,
    query,
    setQuery,
    schema,
    setSchema,
  };

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

const { useContext, useState, createContext } = wp.element;
const { hooks } = window.wpGraphiQL;

/**
 * Create context to maintain state for the Explorer
 */
export const ExplorerContext = createContext();

/**
 * Export the useExplorer hook to access the Explorer context
 * @returns {*}
 */
export const useExplorer = () => {
  return useContext(ExplorerContext);
};

/**
 * Export the ExplorerProvider, allowing children of the provider access to the Explorer context.
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const ExplorerProvider = ({ children }) => {
  /**
   * Handle state for the explorer
   */
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);

  /**
   * Expose function to toggle the explorer
   */
  const toggleExplorer = () => {
    setIsExplorerOpen(!isExplorerOpen);
  };

  /**
   * Filter the default state of the context
   */
  const value = hooks.applyFilters("graphiql_explorer_context_default_value", {
    isExplorerOpen,
    toggleExplorer,
  });

  /**
   * Wrap children in the Provider
   */
  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
};

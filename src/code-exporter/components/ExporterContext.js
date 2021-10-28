const { useContext, useState, createContext, useEffect } = wp.element;
const { hooks, useAppContext } = wpGraphiQL;

/**
 * Create context to maintain state for the CodeExporter
 */
export const CodeExporterContext = createContext();

/**
 * Export the useCodeExporter hook to access the CodeExporter context
 * @returns {*}
 */
export const useCodeExporter = () => {
  return useContext(CodeExporterContext);
};

/**
 * Export the CodeExporterProvider, allowing children of the provider access to the CodeExporter context.
 *
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const CodeExporterProvider = ({ children }) => {
  // Access the query params from AppContext
  const { queryParams, setQueryParams } = useAppContext();

  // Determine the default state of the code exporter based
  // on queryParam, then localStorage
  const getCodeExporterDefaultOpenState = () => {
    let defaultState = false;

    const localValue =
      window?.localStorage.getItem("graphiql:isCodeExporterOpen") ?? null;

    // get the state of the code exporter from the url param
    const urlState = queryParams?.isCodeExporterOpen ?? false;

    // if the localStorage value is set, use it
    if (null !== localValue) {
      defaultState = localValue;
    }

    // if the urlState is set, use it
    if (null !== urlState) {
      defaultState = urlState;
    }

    console.log({
      exporterDefaultState: {
        defaultState,
      },
    });

    // leave code exporter closed by default
    return defaultState;
  };

  /**
   * Handle state for the code exporter
   */
  const [isCodeExporterOpen, setIsCodeExporterOpen] = useState(
    getCodeExporterDefaultOpenState()
  );

  /**
   * When a new state is passed,
   * - update the component state
   * - update the url query param
   * - update localStorage
   * @param newState
   */
  const updateCodeExporter = (newState) => {
    if (isCodeExporterOpen !== newState) {
      // update component state
      setIsCodeExporterOpen(newState);
    }

    const newQueryParams = { ...queryParams, isCodeExporterOpen: newState };

    //
    if (JSON.stringify(newQueryParams) !== JSON.stringify(queryParams)) {
      // Update the url query param
      setQueryParams(newQueryParams);
    }

    // Store the state in localStorage
    window?.localStorage.setItem("graphiql:isCodeExporterOpen", `${newState}`);
  };

  /**
   * Expose function to toggle the code exporter to the opposite state
   */
  const toggleCodeExporter = () => {
    // get the toggledState
    const toggledState = !isCodeExporterOpen;

    // Set the code exporter to the toggledState
    updateCodeExporter(toggledState);
  };

  /**
   * Filter the default state of the context
   */
  const value = hooks.applyFilters(
    "graphiql_code_exporter_context_default_value",
    {
      isCodeExporterOpen,
      toggleCodeExporter,
    }
  );

  /**
   * Wrap children in the Provider
   */
  return (
    <CodeExporterContext.Provider value={value}>
      {children}
    </CodeExporterContext.Provider>
  );
};

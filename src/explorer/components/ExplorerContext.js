const { useContext, useState, createContext, useEffect } = wp.element;
const { hooks, useAppContext } = wpGraphiQL;

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
  // Access the query params from AppContext
  const { queryParams, setQueryParams } = useAppContext();

  useEffect(effect => {

    console.log( {
      queryParamsChanged: {
        queryParams,
        effect
      }
    })

    // setQueryParams(queryParams)

  }, [ queryParams ])

  // Determine the default state of the explorer based
  // on queryParam, then localStorage
  const getExplorerDefaultOpenState = () => {
    const localValue =
      window?.localStorage.getItem("graphiql:isExplorerOpen") ?? null;

    // no-longer-supported query param
    const deprecatedQueryParam = queryParams?.explorerIsOpen ?? null

    // get the state of the explorer from the url param
    const urlState = queryParams?.isExplorerOpen ?? deprecatedQueryParam;

    // if the urlState is set, use it
    if (null !== urlState) {
      return urlState;
    }

    // if the localStorage value is set, use it
    if (null !== localValue) {
      return localValue;
    }

    // leave explorer closed by default
    return false;
  };

  /**
   * Handle state for the explorer
   */
  const [isExplorerOpen, setIsExplorerOpen] = useState(getExplorerDefaultOpenState());

  /**
   * When a new state is passed,
   * - update the component state
   * - update the url query param
   * - update localStorage
   * @param newState
   */
  const updateExplorer = (newState) => {

    if ( isExplorerOpen !== newState ) {
      // update component state
      setIsExplorerOpen(newState);
    }

    const newQueryParams = { ...queryParams, isExplorerOpen: newState }

    console.log( { updateExplorer: {
        queryParams,
        newQueryParams
      }})

    // // Delete deprecated query param
    // delete( newQueryParams.explorerIsOpen )
    //
    // if ( JSON.stringify( newQueryParams ) !== JSON.stringify(queryParams) ) {
    //   // Update the url query param
    //   setQueryParams(newQueryParams);
    // }
    //
    // // Store the state in localStorage
    // window?.localStorage.setItem("graphiql:isExplorerOpen", `${newState}`);
  };

  /**
   * Expose function to toggle the explorer to the opposite state
   */
  const toggleExplorer = () => {
    // get the toggledState
    const toggledState = !isExplorerOpen;

    // Set the explorer to the toggledState
    updateExplorer(toggledState);
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

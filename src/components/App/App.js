import Router from "../Router/Router.js";
import { useEffect } from "@wordpress/element";
import { QueryParamProvider } from "use-query-params";
const { hooks, AppContextProvider, useAppContext } = window.wpGraphiQL;

/**
 * Filter the app to allow 3rd party plugins to wrap with their own context
 */
const FilteredApp = () => {
  /**
   * Pass the AppContext down to the filter
   */
  const appContext = useAppContext();

  /**
   * Pass the router through a filter, allowing
   */
  return hooks.applyFilters("graphiql_app", <Router />, appContext);
};

/**
 * Return the app
 *
 * @returns
 */
export const AppWithContext = () => {
  useEffect(() => {
    hooks.doAction("graphiql_rendered");
  }, []);

  return (
    <QueryParamProvider>
      <AppContextProvider>
        <FilteredApp />
      </AppContextProvider>
    </QueryParamProvider>
  );
};

export default AppWithContext;

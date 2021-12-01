import { createContext, useState, useContext } from "@wordpress/element";
import LZString from "lz-string";
import { getExternalFragments } from "../utils/externalFragments";
import { hooks } from "../../../index"
import { parse } from "graphql/index";

export const GraphiQLContext = createContext();
export const useGraphiQLContext = () => useContext(GraphiQLContext);
export const GraphiQLContextProvider = ({ children }) => {

    const getDefaultQuery = () => {
        return `{posts{nodes{id,title,date}}}`
    }

  const [query, setQuery] = useState( getDefaultQuery() );
  const [variables, setVariables] = useState({});
  const [externalFragments, setExternalFragments] = useState(
    getExternalFragments()
  );

  const _updateQuery = (newQuery) => {
    hooks.doAction("graphiql_update_query", { query, newQuery });

    let update = false;
    let encoded;
    let decoded;

    if (null !== newQuery && newQuery === query) {
      return;
    }

    if (null === newQuery || "" === newQuery) {
      update = true;
    } else {
      decoded = LZString.decompressFromEncodedURIComponent(newQuery);
      // the newQuery is not encoded, lets encode it now
      if (null === decoded) {
        // Encode the query
        encoded = LZString.compressToEncodedURIComponent(newQuery);
      } else {
        encoded = newQuery;
      }

      try {
        parse(newQuery);
        update = true;
      } catch (e) {
        console.warn({
          error: {
            e,
            newQuery,
          },
        });
        return;
      }
    }

    if (!update) {
      return;
    }

    // Store the query to localStorage
    if (window && window.localStorage && "" !== newQuery && null !== newQuery) {
      window?.localStorage.setItem("graphiql:query", newQuery);
    }

    // const newQueryParams = { ...queryParams, query: encoded };

    // if (JSON.stringify(newQueryParams !== JSON.stringify(queryParams))) {
    //   updateQueryParams(newQueryParams);
    // }

    if (query !== newQuery) {
      setQuery(newQuery);
    }
  };

  // Filter the context values
  const context = hooks.applyFilters("graphiql_context_value", {
    query,
    setQuery: _updateQuery,
    variables,
    setVariables,
    externalFragments,
    setExternalFragments,
  });

  return (
    <GraphiQLContext.Provider value={context}>
      {children}
    </GraphiQLContext.Provider>
  );
};

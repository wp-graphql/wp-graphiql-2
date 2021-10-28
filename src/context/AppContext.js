import { createHooks } from "@wordpress/hooks";
import LZString from "lz-string";
import { parse } from "graphql/index.js";
import { getExternalFragments } from "../utils/externalFragments";
const { useContext, createContext, useState, useEffect } = wp.element;

/**
 * Create hooks to be used throughout the plugin
 * @type {Hooks}
 */
export const hooks = createHooks();

/**
 * Gets the endpoint from the WordPress local variable
 *
 * @returns {*|null}
 */
export const getEndpoint = () => {
  return window?.wpGraphiQLSettings?.graphqlEndpoint ?? null;
};

/**
 * Exports the context
 */
export const AppContext = createContext();

/**
 * Allows components to use the AppContext
 *
 * @returns {*}
 */
export const useAppContext = () => {
  return useContext(AppContext);
};

/**
 * Provides context for the app, including the commonly shared state such as:
 *
 * - endpoint
 * - nonce
 * - query
 * - schema
 *
 * @param setQueryParams
 * @param queryParams
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const AppContextProvider = ({
  setQueryParams,
  queryParams,
  children,
}) => {
  const [endpoint, setEndpoint] = useState(getEndpoint());
  const [nonce] = useState(window?.wpGraphiQLSettings?.nonce ?? null);
  const [query, setQuery] = useState(null);
  const [schema, setSchema] = useState(null);
  const [externalFragments, setExternalFragments] = useState(
    getExternalFragments()
  );
  const [_queryParams, _setQueryParams] = useState(queryParams);

  const updateQueryParams = (newParams) => {
    if (queryParams !== newParams) {
      setQueryParams(newParams);
      _setQueryParams(newParams);
    }
  };

  /**
   * Update the Query in AppContext and set the encoded query in the URL
   *
   * @param newQuery
   */
  const updateQuery = (newQuery) => {
    console.log({
      updateQuery: {
        newQuery,
        query,
      },
    });

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

    const newQueryParams = { ...queryParams, query: encoded };

    if (JSON.stringify(newQueryParams !== JSON.stringify(queryParams))) {
      updateQueryParams(newQueryParams);
    }

    if (query !== newQuery) {
      setQuery(newQuery);
    }
  };

  /**
   * Filter the default values of the app context
   */
  const appContext = hooks.applyFilters("graphiql_app_context", {
    endpoint,
    setEndpoint,
    nonce,
    query,
    setQuery: updateQuery,
    schema,
    setSchema,
    queryParams: _queryParams,
    setQueryParams: updateQueryParams,
    externalFragments,
    setExternalFragments,
  });

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};

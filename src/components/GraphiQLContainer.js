import {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  print,
  specifiedRules,
} from "graphql";
import { client } from "../data/client";
import { gql } from "@apollo/client";
import GraphiQL from "graphiql";
import { getFetcher } from "../utils/fetcher";
import styled from "styled-components";

import "graphiql/graphiql.css";
import "./style.css";
import GraphiQLToolbar from "./GraphiQLToolbar";

/**
 * WP Dependencies
 */
const { useState, useEffect, useRef } = wp.element;
const { hooks, useAppContext } = wpGraphiQL;

/**
 * Handle the resize of the App when the window size changes
 */
const handleResize = () => {
  // Hide update nags and errors on the graphiql page
  // document.getElementsByClassName('update-nag' )[0].style.visibility = 'hidden';
  // document.getElementsByClassName('error' )[0].style.visibility = 'hidden';

  let defaultHeight = 500;
  let windowHeight = window.innerHeight;
  let footerHeight = document.getElementById("wpfooter").clientHeight ?? 60;
  let adminBarHeight = document.getElementById("wpadminbar").clientHeight ?? 60;
  let height = windowHeight - adminBarHeight - footerHeight - 65;
  let graphqlHeight = height < defaultHeight ? defaultHeight : height;

  document.getElementById(
    "wp-graphiql-wrapper"
  ).style.height = `${graphqlHeight}px`;
};

const StyledWrapper = styled.div`
  display: flex;
  border: 1px solid #ccc;
  .topBar {
    height: 50px;
  }
  .doc-explorer-title, 
  .history-title {
    padding-top: 5px;
  }
  width:100%
  display: flex;
  flex-direction: row;
  margin: 0;
  overflow: hidden;
  width: 100%;
`;

/**
 * Get the admin URL based on the url params
 *
 * @param urlParams
 * @returns {string}
 */
const getAdminUrl = (urlParams) => {
  return (
    "admin.php" +
    "?" +
    Object.keys(urlParams)
      .map(function (key) {
        return (
          encodeURIComponent(key) + `=` + encodeURIComponent(urlParams[key])
        );
      })
      .join(`&`)
  );
};

/**
 * Get initial Url Params
 * @returns {{}}
 */
const getInitialUrlParams = () => {
  let urlParams = {};

  window.location.search
    .substr(1)
    .split(`&`)
    .forEach((entry) => {
      let eq = entry.indexOf(`=`);
      if (eq >= 0) {
        urlParams[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(
          entry.slice(eq + 1).replace(/\+/g, "%20")
        );
      }
    });

  return urlParams;
};

/**
 * Set the Fallback Query should GraphiQL fail to load a good initial query from localStorage or
 * url params
 *
 * @type {string}
 */
const FALLBACK_QUERY = `# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# An example GraphQL query might look like:
#
query GetPosts {
  posts {
    nodes {
      id
      title
      date
    }    
  }
}
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#  Run Query:  Ctrl-Enter (or press the play button above)
#
#  Auto Complete:  Ctrl-Space (or just start typing)
#
`;

/**
 * Determine the initial query
 *
 * @returns {null|string|*}
 */
const getInitialQuery = () => {
  const urlParams = getInitialUrlParams();

  const DEFAULT_QUERY = `
        {  
            posts {
                nodes { 
                    id
                    title
                }
            }
        }`;

  let initialQuery = null;

  if (
    window &&
    window.localStorage &&
    window.localStorage.getItem(`graphiql:query`)
  ) {
    initialQuery = window.localStorage.getItem(`graphiql:query`);
  }

  if (urlParams && urlParams.query) {
    try {
      initialQuery = print(parse(urlParams.query));
    } catch (error) {
      return FALLBACK_QUERY;
    }
  }

  return initialQuery ? initialQuery : print(parse(DEFAULT_QUERY));
};

/**
 * GraphiQLContainer
 *
 * This is the container for GraphiQL which sets up state to be shared with GraphiQL and extensions
 *
 * @param string endpoint The endpoint GraphiQL should fetch from
 * @param string|null nonce The nonce to be used to identify the requesting user
 *
 * @returns {JSX.Element}
 * @constructor
 */
const GraphiQLContainer = ({ endpoint, nonce, useNonce }) => {

  const [urlParams, setUrlParams] = useState(null);
  const { schema, setSchema, query, setQuery } = useAppContext();

  let graphiql = useRef(null);

  /**
   * Get the fetcher to use for GraphiQL
   *
   * @type {function(*=): Promise<*>}
   */
  const fetcher = getFetcher(endpoint, { nonce, useNonce });

  /**
   * Get the Schema from the GraphQL Endpoint
   */
  const getRemoteSchema = () => {
    if (null !== schema) {
      return;
    }
    const remoteQuery = getIntrospectionQuery();

    client(endpoint)
      .query({
        query: gql`
          ${remoteQuery}
        `,
      })
      .then((res) => {
        const clientSchema = res?.data ? buildClientSchema(res.data) : null;

        setSchema(clientSchema);
      });
  };

  /**
   * Given urlParams, updates the url using the browser's history API
   *
   * @param params
   */
  const updateUrl = (params) => {
    history.replaceState(null, null, getAdminUrl(params));
  };

  /**
   * Callback when the query is edited in GraphiQL
   *
   * @param editedQuery
   */
  const handleEditQuery = (editedQuery) => {
    let update = false;

    if (editedQuery === query) {
      return;
    }

    if (null === editedQuery || "" === editedQuery) {
      update = true;
    } else {
      try {
        parse(editedQuery);
        update = true;
      } catch (error) {
        return;
      }
    }

    // If the query is valid and should be updated
    if (update) {
      // Update the state with the new query
      setQuery(editedQuery);

      // Add the query to the URL params and update the url
      const newUrlParams = { ...urlParams, query: editedQuery };
      setUrlParams(newUrlParams);
      updateUrl(newUrlParams);
    }
  };

  /**
   * Setup initial state when the component mounts
   */
  useEffect(() => {
    // Listen for resizes to keep the app sized for the window
    handleResize();
    window.addEventListener("resize", handleResize);

    // If no urlParams have been set, set them now
    if (!urlParams) {
      setUrlParams(getInitialUrlParams());
    }

    // If a query doesnt exist, get the initial query
    if (null === query || undefined === query) {
      setQuery(getInitialQuery());
    }

    // Load the remote schema
    getRemoteSchema(setSchema);
  });

  // Set the args to pass to the hooks
  const hookArgs = {
    query,
    setQuery,
    urlParams,
    setUrlParams,
    schema,
    setSchema,
  };

  const beforeGraphiql = hooks.applyFilters(
    "graphiql_before_graphiql",
    [],
    hookArgs
  );
  const afterGraphiQL = hooks.applyFilters(
    "graphiql_after_graphiql",
    [],
    hookArgs
  );

  const app = (
    <StyledWrapper id="wp-graphiql-wrapper">
      {beforeGraphiql.length > 0 ? beforeGraphiql : null}

      <GraphiQL
        ref={(node) => {
          graphiql = node;
        }}
        fetcher={(params) => {
          return fetcher(params);
        }}
        schema={schema}
        query={query}
        onEditQuery={handleEditQuery}
        validationRules={specifiedRules}
      >
        <GraphiQL.Toolbar>
          <GraphiQLToolbar graphiql={() => graphiql} />
        </GraphiQL.Toolbar>
      </GraphiQL>
      {afterGraphiQL.length > 0 ? afterGraphiQL : null}
    </StyledWrapper>
  );

  return hooks.applyFilters("graphiql_container", app, {
    schema,
    query,
    graphiql,
  });
};

export default GraphiQLContainer;

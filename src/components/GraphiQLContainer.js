import {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  print,
  specifiedRules,
} from "graphql";
import { client } from "../data/client";
import { gql, useQuery } from "@apollo/client";
import GraphiQL from "graphiql";
import { getFetcher } from "../utils/fetcher";
import styled from "styled-components";
import LZString from "lz-string";
import "graphiql/graphiql.css";
import "./style.css";
import GraphiQLToolbar from "./GraphiQLToolbar";
import { useQueryParam, StringParam } from "use-query-params";

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
 * Set the Fallback Query should GraphiQL fail to load a good initial query from localStorage or
 * url params
 *
 * @type {string}
 */
export const FALLBACK_QUERY = `# Welcome to GraphiQL
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
 * GraphiQLContainer
 *
 * This is the container for GraphiQL which sets up state to be shared with GraphiQL and extensions
 *
 * @param object props The props to establish the container. Includes the endpoint, nonce and useNonce fields.
 *
 * @returns {JSX.Element}
 * @constructor
 */
const GraphiQLContainer = ({ endpoint, nonce, useNonce }) => {
  const [urlParams, setUrlParams] = useState(null);
  const appContext = useAppContext();
  const { schema, setSchema, query, setQuery, queryParams, externalFragments } =
    appContext;

  const queryUrlParam = queryParams?.query ?? null;

  let graphiql = useRef(null);

  /**
   * Get the fetcher to use for GraphiQL
   *
   * @type {function(*=): Promise<*>}
   */
  let fetcher = getFetcher(endpoint, { nonce, useNonce });
  fetcher = hooks.applyFilters("graphiql_fetcher", fetcher, appContext);

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
    }
  };

  /**
   * Setup initial state when the component mounts
   */
  useEffect(() => {
    // Listen for resizes to keep the app sized for the window
    handleResize();
    window.addEventListener("resize", handleResize);

    let defaultQuery = null;

    // If there's a query url param, try to decode it
    if (queryUrlParam) {
      defaultQuery = LZString.decompressFromEncodedURIComponent(queryUrlParam);

      // if it's null, it's not an encoded query, but a string query, i.e. {posts{nodes{id}}}
      if (null === defaultQuery) {
        defaultQuery = queryUrlParam;
      }
    }

    try {
      defaultQuery = print(parse(defaultQuery));
    } catch (e) {
      defaultQuery =
        window?.localStorage.getItem("graphiql:query") ?? FALLBACK_QUERY;
    }

    // If a query doesnt exist, get the initial query
    if (null === query || undefined === query) {
      setQuery(defaultQuery);
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
        externalFragments={externalFragments}
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

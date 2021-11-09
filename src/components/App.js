import GraphiQLContainer from "./GraphiQLContainer";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import ActiveDocuments from "./ActiveDocuments";
import {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  print,
  specifiedRules,
} from "graphql";
import { client } from "../data/client";
import { gql, useQuery } from "@apollo/client";
const { hooks, useAppContext } = window.wpGraphiQL;
const { useEffect } = wp.element;

/**
 * Get the ApolloClient to wrap the app with
 *
 * This should allow various components to use Apollo to fetch resources
 * from WPGraphQL to load into the interface. For example, we can
 * save queries to a post type, then use a GraphQL query to fetch the
 * saved queries for display in the UI ... 🤯 use GraphQL queries to query GraphQL
 * queries!
 *
 *
 * @param options
 * @returns {ApolloClient<unknown>}
 */
const getClient = (options) => {
  return new ApolloClient(options);
};

/**
 * The entry point for the App
 *
 * @returns {any}
 * @constructor
 */
const App = () => {
  let app;

  const appContext = useAppContext();

  const { schema, setSchema, endpoint, setEndpoint, nonce } = appContext;

  // if the endpoint can't be found, GraphiQL won't function properly
  // We can probably add a way for users to set this manually later, like
  // a settings form they can manually add the endpoint, etc,
  // but for now this is how things work.
  if (!endpoint) {
    app = null;
  }

  /**
   * Configure the Apollo Client, pass it through a filter
   * so 3rd party plugins can extend if needed
   */
  const apolloClientConfig = hooks.applyFilters(
    "graphiql_apollo_client_config",
    {
      uri: endpoint,
      cache: new InMemoryCache(),
    }
  );

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

  app = (
    <ApolloProvider client={getClient(apolloClientConfig)}>
      {/* <GraphiQLContainer nonce={nonce} endpoint={endpoint} /> */}
      <ActiveDocuments />
    </ApolloProvider>
  );

  useEffect(() => {

    // Load the remote schema
    getRemoteSchema(setSchema);

    hooks.doAction("graphiql_app_rendered", app, {
      endpoint,
      setEndpoint,
      nonce,
    });
  });

  return hooks.applyFilters("graphiql_app", app, {
    endpoint,
    setEndpoint,
    nonce,
  });
};

export default App;

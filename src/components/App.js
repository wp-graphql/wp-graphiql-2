import GraphiQLContainer from "./GraphiQLContainer";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
const { hooks, useAppContext } = window.wpGraphiQL;

const SetEndpoint = (props) => {
  return (
    <>
      <h2>Set Endpoint</h2>
      <p>
        @todo: Add form to set endpoint if the app was loaded outside of
        WordPress and there is no `window.wpGraphiQLSettings`
      </p>
    </>
  );
};

const getClient = (options) => {
  return new ApolloClient(options);
};

const App = () => {
  let app;

  const appContext = useAppContext();

  const { endpoint, setEndpoint, nonce } = appContext;

  // if the endpoint can't be found, GraphiQL won't function properly
  // We can probably add a way for users to set this manually later, like
  // a settings form they can manually add the endpoint, etc,
  // but for now this is how things work.
  if (!endpoint) {
    app = <SetEndpoint setEndpoint={setEndpoint} />;
  }

  const apolloClientConfig = hooks.applyFilters(
    "graphiql_apollo_client_config",
    {
      uri: endpoint,
      cache: new InMemoryCache(),
    }
  );

  app = (
    <ApolloProvider client={getClient(apolloClientConfig)}>
      <GraphiQLContainer nonce={nonce} endpoint={endpoint} />
    </ApolloProvider>
  );

  return hooks.applyFilters("graphiql_app", app, {
    endpoint,
    setEndpoint,
    nonce,
  });
};

export default App;

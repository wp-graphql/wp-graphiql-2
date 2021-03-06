import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

export const client = (uri) => {
  return new ApolloClient({
    uri,
    connectToDevTools: true,
    cache: new InMemoryCache(),
  });
};

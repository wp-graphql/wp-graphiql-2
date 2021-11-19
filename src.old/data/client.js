import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  makeVar,
} from "@apollo/client";

export const remoteSchema = makeVar(null);
export const currentQuery = makeVar(null);
export const currentResponse = makeVar(null);

export const client = (uri) => {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache({
      typePolicies: {
        RootQuery: {
          fields: {
            remoteSchema: {
              read() {
                return remoteSchema();
              },
            },
            currentQuery: {
              read() {
                return currentQuery();
              },
            },
            currentResponse: {
              read() {
                return currentResponse();
              },
            },
          },
        },
      },
    }),
  });
};

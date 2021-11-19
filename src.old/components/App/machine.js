import { createMachine, assign } from "xstate";
import { client } from "../../data/client";
import { gql } from "@apollo/client";
import { getIntrospectionQuery } from "graphql";

export const AppStateMachine = createMachine(
  {
    id: "app",
    initial: "idle",
    context: {
      schema: null,
      endpoint: null,
    },
    states: {
      idle: {
        on: {
          FETCH_SCHEMA: "fetchingSchema",
        },
      },
      fetchingSchema: {
        invoke: {
          id: "loadSchema",
          src: "loadSchema",
          onDone: {
            target: "idle",
            actions: "setSchema",
          },
          onError: {
            target: "schemaFetchError",
          },
        },
      },
      schemaFetchError: {
        target: "idle",
        on: {
          RETRY: "fetchingSchema",
          CANCEL: "idle",
        },
      },
    },
  },
  {
    actions: {
      setSchema: assign({
        schema: (context, event) => {
          console.log({ setSchema: event?.data?.data?.__schema ?? null });
          return event?.data?.data?.__schema ?? null;
        },
      }),
    },
    services: {
      loadSchema: (context) => async (event) => {
        const { endpoint } = context;

        console.log({
          loadSchema: {
            context,
            introspectionQuery: getIntrospectionQuery(),
          },
        });

        return client(endpoint).query({
          query: gql`
            ${getIntrospectionQuery()}
          `,
        });
        // .then((res) => {
        //     const clientSchema = res?.data ? buildClientSchema(res.data) : null;
        //     return clientSchema;
        // })
      },
    },
  }
);

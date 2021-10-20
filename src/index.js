import * as GraphQL from "graphql/index.js";
import { createHooks } from "@wordpress/hooks";
export const hooks = createHooks();
import { createContext } from "@wordpress/element";

const getEndpoint = () => {
  return window?.wpGraphiQLSettings?.graphqlEndpoint ?? null;
};

const AppContext = createContext({
  endpoint: getEndpoint(),
});

window.wpGraphiQL = {
  hooks,
  GraphQL,
  getEndpoint: getEndpoint(),
  AppContext,
};

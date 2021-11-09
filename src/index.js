import * as GraphQL from "graphql/index.js";

import {
  hooks,
  AppContextProvider,
  useAppContext,
  getEndpoint,
} from "./context/AppContext";

window.wpGraphiQL = {
  hooks,
  GraphQL,
  getEndpoint: getEndpoint(),
  useAppContext,
  AppContextProvider,
  
};

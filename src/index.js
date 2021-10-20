import * as GraphQL from "graphql/index.js";
import { createHooks } from "@wordpress/hooks";
export const hooks = createHooks();
import {
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

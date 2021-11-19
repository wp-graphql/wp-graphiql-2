import * as GraphQL from "graphql/index.js";
import { createHooks } from "@wordpress/hooks";

export const hooks = createHooks();

window.wpGraphiQL = {
  GraphQL,
  hooks,
};

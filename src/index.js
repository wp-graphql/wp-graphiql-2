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

// Examples
/**
 * This is an example showing how to add a custom action
 * to the operation action menu
 *
 *
 */
hooks.addFilter(
  "graphiql_operation_action_menu_items",
  "graphiql-extension",
  (menuItems, props) => {
    const { Menu } = props;

    console.log({
      graphiql_operation_action_menu_items: {
        menuItems,
        props,
      },
    });

    // Return the menuItems, with our new item added
    return {
      ...menuItems,
      test: (
        <Menu.Item
          onClick={({ domEvent }) => {
            domEvent.preventDefault();
            domEvent.stopPropagation();
            alert(`clicked the new menu item!`);
            console.log({
              filteredOperationActionMenuItem: {
                menuItems,
                props,
              },
            });
          }}
        >
          Filtered Item!
        </Menu.Item>
      ),
    };
  }
);

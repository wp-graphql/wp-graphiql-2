import Explorer from "./components/Explorer";

const { hooks } = window.wpGraphiQL;
import {
  ExplorerContext,
  ExplorerProvider,
  useExplorer,
} from "./components/ExplorerContext";
import { GraphiQL } from "graphiql";

/**
 * Hook into the GraphiQL Toolbar to add the button to toggle the Explorer
 */
hooks.addFilter(
  "graphiql_toolbar_after_buttons",
  "graphiql-extension",
  (res, props) => {
    const { GraphiQL } = props;

    const { toggleExplorer } = useExplorer();

    res.push(
      <ExplorerContext.Consumer>
        {(context) => {
          return (
            <GraphiQL.Button
              onClick={() => {
                // Toggle the state of the explorer context
                toggleExplorer();
              }}
              label="Explorer"
              title="Explorer"
            />
          );
        }}
      </ExplorerContext.Consumer>
    );

    return res;
  }
);

/**
 * Add the Explorer panel before GraphiQL
 */
hooks.addFilter(
  "graphiql_before_graphiql",
  "graphiql-explorer",
  (res, props) => {
    res.push(<Explorer {...props} />);
    return res;
  }
);

/**
 * Wrap the GraphiQL App with the explorer context
 */
hooks.addFilter("graphiql_app", "graphiql-explorer", (app, args) => {
  return <ExplorerProvider>{app}</ExplorerProvider>;
});

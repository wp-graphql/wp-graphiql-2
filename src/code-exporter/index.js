const { hooks } = window.wpGraphiQL;

/**
 * Hook into the GraphiQL Toolbar to add the button to toggle the code exporter
 */
hooks.addFilter(
  "graphiql_toolbar_after_buttons",
  "graphiql-code-exporter",
  (res, props) => {
    res.push(<span>Exporter!!</span>);
    return res;
  }
);

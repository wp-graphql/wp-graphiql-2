const defaults = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

module.exports = {
  ...defaults,
  entry: {
    index: path.resolve(process.cwd(), "src", "index.js"),
    app: path.resolve(process.cwd(), "src", "App.js"),
    // codeExporter: path.resolve(process.cwd(), "src/code-exporter", "index.js"),
    // explorer: path.resolve(process.cwd(), "src/explorer", "index.js"),
    // authSwitch: path.resolve(process.cwd(), "src/auth-switch", "index.js"),
    // documentTabs: path.resolve(process.cwd(), "src/document-tabs", "index.js"),
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    wpGraphiQL: "wpGraphiQL",
    graphql: "wpGraphiQL.GraphQL",
  },
};

// import {
//   CodeExporterContext,
//   useCodeExporter,
//   CodeExporterProvider,
// } from "./components/ExporterContext";
//
// import CodeExporter from "./components/CodeExporter";
// import "graphiql-code-exporter/CodeExporter.css";
//
// import snippets from "./snippets";
//
// import "codemirror/theme/neo.css";
// import "codemirror/mode/clike/clike.js";
// import { BooleanParam } from "use-query-params";
//
// const { hooks, useAppContext } = window.wpGraphiQL;
//
// /**
//  * Hook into the GraphiQL Toolbar to add the button to toggle the Explorer
//  */
// hooks.addFilter(
//   "graphiql_toolbar_after_buttons",
//   "graphiql-code-exporter",
//   (res, props) => {
//     const { GraphiQL } = props;
//
//     const { toggleCodeExporter } = useCodeExporter();
//
//     res.push(
//       <CodeExporterContext.Consumer>
//         {(context) => {
//           return (
//             <GraphiQL.Button
//               onClick={() => {
//                 // Toggle the state of the code exporter context
//                 toggleCodeExporter();
//               }}
//               label="Code Exporter"
//               title="Code Exporter"
//             />
//           );
//         }}
//       </CodeExporterContext.Consumer>
//     );
//
//     return res;
//   }
// );
//
// /**
//  * Wrap the GraphiQL App with the exporter context
//  */
// hooks.addFilter("graphiql_app", "graphiql-code-exporter", (app, args) => {
//   return <CodeExporterProvider>{app}</CodeExporterProvider>;
// });
//
// const CodeExporterWrapper = () => {
//   const { isCodeExporterOpen, toggleCodeExporter } = useCodeExporter();
//   const { query } = useAppContext();
//
//   return isCodeExporterOpen ? (
//     <CodeExporter
//       toggleCodeExporter={toggleCodeExporter}
//       snippets={snippets}
//       query={query}
//       codeMirrorTheme="default"
//       theme={"neo"}
//     />
//   ) : null;
// };
//
// hooks.addFilter(
//   "graphiql_after_graphiql",
//   "graphiql-code-exporter",
//   (res, props) => {
//     res.push(<CodeExporterWrapper {...props} />);
//     return res;
//   }
// );
//
// hooks.addFilter(
//   "graphiql_query_params_provider_config",
//   "graphiql-code-exporter",
//   (config) => {
//     return { ...config, ...{ isCodeExporterOpen: BooleanParam } };
//   }
// );

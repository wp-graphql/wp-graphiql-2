const { hooks } = wpGraphiQL;
const { print, parse } = wpGraphiQL.GraphQL;
import defaultSnippets from "graphiql-code-exporter/lib/snippets";

const getQuery = (arg, spaceCount) => {
  const { operationDataList } = arg;
  const { query } = operationDataList[0];
  return print(parse(query));

  // const { operationDataList } = arg
  // const { query } = operationDataList[0]
  // const anonymousQuery = query.replace(/query\s.+{/gim, `{`)
  // return (
  //     ` `.repeat(spaceCount) +
  //     anonymousQuery.replace(/\n/g, `\n` + ` `.repeat(spaceCount))
  // )
};

// const wpRemoteRequest = {
//     name: `wp_remote_post`,
//     language: `PHP`,
//     codeMirrorMode: `php`,
//     generate: arg => `
//     <?php
//     $request = wp_remote_request( $endpoint, [
//       "method" => "POST",
//       "headers" => [
//         "Content-Type" => "application/json",
//       ],
//       "body" => wp_json_encode([
//         "query" => "${getQuery(arg, 4)}",
//         "variables" => [],
//         "extensions" => [],
//       ])
//     ] );
//     `
// }

const pageQuery = {
  name: `Gatsby`,
  language: `JavaScript`,
  codeMirrorMode: `jsx`,
  options: [],
  generate: (args) => `
import React from "react"
import { graphql } from "gatsby"

const ComponentName = ({ data }) => <pre>{JSON.stringify(data, null, 4)}</pre>

export const query = graphql\`
${getQuery(args, 2)}
\`

export default ComponentName
    `,
};

const wpRemoteRequest = {
  name: `WordPress`,
  language: `PHP`,
  codeMirrorMode: `PHP`,
  options: [
    {
      id: "wp_remote_post",
      label: "wp_remote_post",
      initial: true,
    },
  ],
  generate: (args) => {
    console.log({ generateArgs: args });

    return `
<?php
$response = wp_remote_request( $endpoint, [
  'method' => 'POST',
  'headers' => [
    'Content-Type' => 'application/json',
  ],
  'body' => wp_json_encode([
    'query' => "
${getQuery(args, 2)}",
    'variables' => [],
    'extensions' => [],
  ])
]);
        `;
  },
};

const snippets = hooks.applyFilters("graphiql_code_exporter_snippets", [
  ...defaultSnippets,
  ...[pageQuery, wpRemoteRequest],
]);

console.log({ snippets });

export default snippets;

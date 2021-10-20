import ExplorerWrapper from "./ExplorerWrapper";
import QueryBuilder from "./QueryBuilder";
import ErrorBoundary from "./ErrorBoundary";
import { memoizeParseQuery } from "../utils/utils";
import { Spin } from "antd";
const { useAppContext } = wpGraphiQL;
const { useState, useEffect } = wp.element;

const Wrapper = ({ schema, children }) => {
  if (!schema) {
    return (
      <div
        style={{
          fontFamily: "sans-serif",
          textAlign: `center`,
        }}
        className="error-container"
      >
        <Spin />
      </div>
    );
  }

  return (
    <div
      style={{
        fontSize: 12,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        margin: 0,
        padding: 0,
        fontFamily:
          'Consolas, Inconsolata, "Droid Sans Mono", Monaco, monospace',
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      className="graphiql-explorer-root"
    >
      {children}
    </div>
  );
};

const getActionsOptions = (schema) => {
  const queryType = schema && schema.getQueryType();
  const mutationType = schema && schema.getMutationType();
  const subscriptionType = schema && schema.getSubscriptionType();

  const queryFields = queryType && queryType.getFields();
  const mutationFields = mutationType && mutationType.getFields();
  const subscriptionFields = subscriptionType && subscriptionType.getFields();

  let actionsOptions = [];

  if (queryFields) {
    actionsOptions.push({
      type: `query`,
      label: `Queries`,
      fields: () => {
        return queryFields;
      },
    });
  }

  if (subscriptionFields) {
    actionsOptions.push({
      type: `subscription`,
      label: `Subscriptions`,
      fields: () => {
        return subscriptionFields;
      },
    });
  }

  if (mutationFields) {
    actionsOptions.push({
      type: `mutation`,
      label: `Mutations`,
      fields: () => {
        return mutationFields;
      },
    });
  }

  return actionsOptions;
};

const Explorer = () => {
  const appContext = useAppContext();
  const { query, schema, setQuery } = appContext;
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const parsedQuery = memoizeParseQuery(query);

    if (document !== parsedQuery) {
      setDocument(parsedQuery);
    }
  });

  // Determine the actions that can be taken on the document
  // - add query
  // - add mutation
  // - add subscription
  const actionOptions = getActionsOptions(schema);

  return (
    <>
      <ExplorerWrapper>
        <ErrorBoundary>
          <Wrapper schema={schema}>
            <QueryBuilder
              schema={schema}
              query={query}
              onEdit={(query) => {
                setQuery(query);
              }}
            />
          </Wrapper>
        </ErrorBoundary>
      </ExplorerWrapper>
    </>
  );
};

export default Explorer;

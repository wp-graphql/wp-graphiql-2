import GraphiQL from "graphiql";
import { useRef } from "@wordpress/element";
import { getFetcher } from "../../utils/fetcher";
import styled from "styled-components";
import "./style.scss";
import { Spin } from "antd";
import GraphiQLToolbar from "./components/GraphiQLToolbar";
import { GraphiQLContextProvider, useGraphiQLContext } from "./context/GraphiQLContext";
const { hooks, useAppContext } = wpGraphiQL;

const StyledWrapper = styled.div`
  display: flex;
  .topBar {
    height: 50px;
  }
  .doc-explorer-title,
  .history-title {
    padding-top: 5px;
  }
  height: 100%;
  display: flex;
  flex-direction: row;
  margin: 0;
  overflow: hidden;
  width: 100%;
  .graphiql-container {
    border: 1px solid #ccc;
  }
  .graphiql-container .execute-button-wrap {
    margin: 0 14px;
  }
  padding: 20px;
`;

/**
 * The GraphiQL screen.
 * 
 * @returns
 */
const GraphiQLScreen = () => {
  let graphiql = useRef(null);

  const appContext = useAppContext();
  const graphiqlContext = useGraphiQLContext();
  const { query } = graphiqlContext;
  const { endpoint, nonce, schema, setSchema } = appContext;

  let fetcher = getFetcher(endpoint, { nonce });
  fetcher = hooks.applyFilters("graphiql_fetcher", fetcher, appContext);

  const beforeGraphiql = hooks.applyFilters(
    "graphiql_before_graphiql",
    [],
    { ...appContext, ...graphiqlContext }
  );
  const afterGraphiQL = hooks.applyFilters(
    "graphiql_after_graphiql",
    [],
    { ...appContext, ...graphiqlContext }
  );

  return (
    <StyledWrapper data-testid="wp-graphiql-wrapper" id="wp-graphiql-wrapper">
      {
        // Panels can hook here to render before GraphiQL
        beforeGraphiql.length > 0 ? beforeGraphiql : null
      }

      <GraphiQL
        ref={(node) => {
          graphiql = node;
        }}
        fetcher={(params) => {
          return fetcher(params);
        }}
        schema={schema}
        query={query}
      >
        <GraphiQL.Toolbar>
          <GraphiQLToolbar graphiql={() => graphiql} />
        </GraphiQL.Toolbar>
        <GraphiQL.Logo>{<></>}</GraphiQL.Logo>
      </GraphiQL>

      {
        // Panels can hook here to render after GraphiQL
        afterGraphiQL.length > 0 ? afterGraphiQL : null
      }
    </StyledWrapper>
  );
};

const GraphiQLScreenWithContext = () => {
  const { schema } = useAppContext();

  return schema ? (
    <GraphiQLContextProvider>
      <GraphiQLScreen />
    </GraphiQLContextProvider>
  ) : (
    <Spin style={{ margin: `50px` }} />
  );
}

export default GraphiQLScreenWithContext;

import GraphiQL from "graphiql";
import { useRef } from "@wordpress/element";
import { getFetcher } from "../../utils/fetcher";
import styled from "styled-components";
import "./style.scss";
import { Spin } from "antd";
import GraphiQLToolbar from "./components/GraphiQLToolbar";
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
 * The 
 * @returns 
 */
const GraphiQLScreen = () => {

  let graphiql = useRef(null);

  const appContext = useAppContext();
  const { endpoint, nonce, schema, setSchema } = appContext;
  
  let fetcher = getFetcher( endpoint, { nonce } );
  fetcher = hooks.applyFilters( "graphiql_fetcher", fetcher, appContext );

  return schema ? (
    <StyledWrapper id="wp-graphiql-wrapper">
      <GraphiQL 
        ref={(node) => {
          graphiql = node;
        }}
        fetcher={(params) => {
          return fetcher(params);
        }}
      >
        <GraphiQL.Toolbar>
          <GraphiQLToolbar graphiql={() => graphiql} />
        </GraphiQL.Toolbar>
        <GraphiQL.Logo>{<></>}</GraphiQL.Logo>
      </GraphiQL>
    </StyledWrapper>
  ) : <Spin style={{margin: `50px` }}/>;
}

export default GraphiQLScreen;
import { QueryParamProvider, QueryParams, StringParam } from "use-query-params";
import App from "./components/App";
const { AppContextProvider, hooks } = window.wpGraphiQL;
const { render } = wp.element;

const AppWithContext = () => {
  // Filter the query params config
  const filteredQueryParamsConfig = hooks.applyFilters(
    "graphiql_query_params_provider_config",
    {
      query: StringParam,
      variables: StringParam,
    }
  );

  return (
    <QueryParamProvider>
      <QueryParams config={filteredQueryParamsConfig}>
        {renderProps => {
            const { query, setQuery } = renderProps
            return(
                <AppContextProvider queryParams={query} setQueryParams={setQuery}>
                    <App />
                </AppContextProvider>
            )
        }}
      </QueryParams>
    </QueryParamProvider>
  );
};

render(<AppWithContext />, document.getElementById(`graphiql`));

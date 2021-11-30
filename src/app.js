import Router from "./components/Router/Router.js";
import { render } from "@wordpress/element";
import "./app.scss";
import { QueryParamProvider } from "use-query-params";
import { LineChartOutlined } from "@ant-design/icons";
import { AppContextProvider } from "./context/AppContext.js";

const App = () => {
  return (
    <QueryParamProvider>
      <AppContextProvider >
        <Router />
      </AppContextProvider>
    </QueryParamProvider>
    
  );
};

/**
 * Render the application to the DOM
 */
render(<App />, document.getElementById(`graphiql`));

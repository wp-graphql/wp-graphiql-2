import Router from "./components/Router/Router.js";
import { render } from "@wordpress/element";
import "./app.scss";

const App = () => {
  return <Router />;
};

/**
 * Render the application to the DOM
 */
render(<App />, document.getElementById(`graphiql`));

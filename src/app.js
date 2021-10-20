const { AppContextProvider } = window.wpGraphiQL;

const { render } = wp.element;
import App from "./components/App";

const AppWithContext = () => {
  return (
    <AppContextProvider>
      <App />
    </AppContextProvider>
  );
};

render(<AppWithContext />, document.getElementById(`graphiql`));

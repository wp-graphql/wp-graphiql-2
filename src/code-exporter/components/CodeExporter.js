import ErrorBoundary from "./ErrorBoundary";
import ExporterWrapper from "./ExporterWrapper";
import Exporter from "./Exporter";

const CodeExporter = (props) => {
  const { snippets } = props;

  return (
    <ExporterWrapper {...props}>
      <ErrorBoundary>
        {snippets && snippets.length ? <Exporter {...props} /> : null}
      </ErrorBoundary>
    </ExporterWrapper>
  );
};

export default CodeExporter;

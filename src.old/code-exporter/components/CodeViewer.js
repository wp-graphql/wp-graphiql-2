import CodeMirror from "react-codemirror";

const CodeViewer = (props) => {
  const { activeSnippet } = props;

  return <pre>{JSON.stringify(activeSnippet, null, 2)}</pre>;

  return <CodeMirror value={activeSnippet.generate() ?? null} mode="php" />;
};

export default CodeViewer;

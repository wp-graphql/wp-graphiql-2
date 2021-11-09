import CodeMirror from "react-codemirror";
const { useAppContext } = wpGraphiQL

const CodeViewer = (props) => {
  const { activeSnippet } = props;

  const { endpoint, schema } = useAppContext();

  const _collectOptions = (
      snippet,
      operationDataList,
      schema,
  ) => {

    const serverUrl = endpoint;
    const {context = {}, headers = {}} = props;
    const optionValues = _getOptionValues(snippet);
    return {
      serverUrl,
      headers,
      context,
      operationDataList,
      options: optionValues,
      schema,
    };
  };

  return <pre>{JSON.stringify(activeSnippet, null, 2)}</pre>;


  return <pre>{JSON.stringify(activeSnippet.generate( _collectOptions( activeSnippet, [], schema ) ), null, 2)}</pre>;

  return <CodeMirror value={activeSnippet.generate( _collectOptions( activeSnippet, [], schema )) ?? null} mode="php" />;
};

export default CodeViewer;

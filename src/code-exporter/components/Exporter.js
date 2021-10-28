import ToolbarMenu from "./ToolbarMenu";
import CodeViewer from "./CodeViewer";

const { useState } = wp.element;

const Exporter = (props) => {
  const { snippet, snippets, onSetOptionValue, optionValues } = props;

  const _getDefaultActiveSnippet = () => {
    return snippet || snippets[0];
  };

  const [activeSnippet, setActiveSnippet] = useState(
    _getDefaultActiveSnippet()
  );
  const [optionValuesBySnippet, setOptionValuesBySnippet] = useState(null);

  /**
   * Set the language of the Code Exporter
   *
   * @param language
   * @private
   */
  const _setLanguage = (language) => {
    if (activeSnippet.language === language) {
      return;
    }

    const snippet = snippets.find((snippet) => snippet.language === language);
    if (snippet) {
      setActiveSnippet(snippet);
    }
  };

  const handleSetOptionValue = (snippet, id, value) => {
    onSetOptionValue(snippet, id, value);
    const snippetOptions = optionValuesBySnippet.get(snippet) || {};
    optionValuesBySnippet.set(snippet, { ...snippetOptions, [id]: value });
    return optionValuesBySnippet;
  };

  const getOptionValues = (snippet) => {
    const snippetDefaults = snippet.options.reduce((acc, option) => ({
      ...acc,
      [option.id]: option.initial,
    }));
    return {
      ...snippetDefaults,
      ...(optionValuesBySnippet.get(snippet) || {}),
      ...optionValues,
    };
  };

  return (
    <div className="graphiql-code-exporter antd-app" style={{ minWidth: 410 }}>
      <div
        style={{
          fontFamily:
            "system, -apple-system, San Francisco, Helvetica Neue, arial, sans-serif",
        }}
      >
        <div style={{ padding: "12px 7px 8px" }}>
          <ToolbarMenu
            activeSnippet={activeSnippet}
            handleClickMenuItem={_setLanguage}
            {...props}
          />
        </div>
        {activeSnippet && activeSnippet?.options.length > 0 ? (
          <div style={{ padding: "0px 11px 10px" }}>
            <div
              style={{
                fontWeight: 700,
                color: "rgb(177, 26, 4)",
                fontVariant: "small-caps",
                textTransform: "lowercase",
              }}
            >
              Options
            </div>
            <pre>{JSON.stringify(activeSnippet, null, 2)}</pre>
          </div>
        ) : null}
        <CodeViewer {...props} activeSnippet={activeSnippet} />
      </div>
    </div>
  );
};

export default Exporter;

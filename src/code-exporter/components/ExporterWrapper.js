const ExporterWrapper = (props) => {
  const { children, toggleCodeExporter } = props;

  return (
    <div
      className="docExplorerWrap"
      style={{
        width: 440,
        minWidth: 440,
        zIndex: 7,
      }}
    >
      <div className="doc-explorer-title-bar">
        <div className="doc-explorer-title">Code Exporter</div>
        <div className="doc-explorer-rhs">
          <div className="docExplorerHide" onClick={toggleCodeExporter}>
            {"\u2715"}
          </div>
        </div>
      </div>
      <div
        className="doc-explorer-contents"
        style={{ borderTop: "1px solid #d6d6d6", padding: 0 }}
      >
        {children}
      </div>
    </div>
  );
};

export default ExporterWrapper;

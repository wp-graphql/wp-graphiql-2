import { useExplorer } from "./ExplorerContext";

const ExplorerWrapper = (props) => {
  const { isExplorerOpen, toggleExplorer } = useExplorer();

  const { children } = props;
  const width = `400px`;

  return isExplorerOpen ? (
    <div
      className="doc-explorer-app docExplorerWrap antd-app"
      style={{
        height: "100%",
        width: width,
        minWidth: width,
        zIndex: 8,
        display: isExplorerOpen ? "flex" : "none",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div className="doc-explorer">
        <div className="doc-explorer-title-bar">
          <div className="doc-explorer-title">Query Builder</div>
          <div className="doc-explorer-rhs">
            <div className="docExplorerHide" onClick={toggleExplorer}>
              {"\u2715"}
            </div>
          </div>
        </div>
        <div
          className="doc-explorer-contents"
          style={{
            padding: "0px",
            /* Unset overflowY since docExplorerWrap sets it and it'll
                        cause two scrollbars (one for the container and one for the schema tree) */
            overflowY: "unset",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  ) : null;
};

export default ExplorerWrapper;

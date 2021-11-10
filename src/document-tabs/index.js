import { Tabs } from "antd";
import styled from "styled-components";
const { TabPane } = Tabs;
const { hooks, useAppContext } = wpGraphiQL;
const { useState, useEffect } = wp.element;
const { parse, print } = wpGraphiQL.GraphQL;

const StyledTabContainer = styled.div`
  width: 100%;
  .ant-tabs-top > .ant-tabs-nav {
    margin-bottom: 0;
  }
`;

const StyledTabContents = styled.div`
  padding: 10px;
  background: white;
  border: 1px solid #eaeaea;
  margin-top: -1px;
`;

const DocumentTabs = ({ children }) => {
  const { query, setQuery } = useAppContext();

  const getInitialDocumentPanes = () => {
    const localDocumentPanes =
      localStorage.getItem("graphiql:documentPanes") ?? null;
    if (localDocumentPanes && localDocumentPanes.length > 0) {
      return JSON.parse(localDocumentPanes);
    }

    return [
      {
        key: "1",
        title: "Default Query",
        query: `query GetPosts($first:Int){ posts(first:$first) { nodes { id, title } } }`,
      },
    ];
  };

  const getInitialActiveKey = () => {
      return "1";
  }

  const [documentPanes, setDocumentPanes] = useState(getInitialDocumentPanes());
  const [activeKey, setActiveKey] = useState( getInitialActiveKey() );

  const updateActiveKey  = key => {
      localStorage.setItem("graphiql:documentPaneActiveKey", key );
      setActiveKey(key);
  }

  const updateDocumentPanes = (newDocumentPanes) => {
    if (JSON.stringify(newDocumentPanes) !== JSON.stringify(documentPanes)) {
      setDocumentPanes(newDocumentPanes);
      localStorage.setItem(
        "graphiql:documentPanes",
        JSON.stringify(newDocumentPanes)
      );
    }
  };

  const updateActivePaneQuery = () => {
    const newPanes = [...documentPanes];
    const activePane = documentPanes.find((pane) => pane.key === activeKey);

    if (!activePane) {
      return;
    }

    const activeIndex = newPanes.indexOf(activePane);
    const newActivePane = { ...activePane, query: query };
    newPanes.splice(activeIndex, 1, newActivePane);
    updateDocumentPanes(newPanes);
  };

  useEffect(() => {
    // If the current query doesn't match the query of the active tab, update the query
    const activePane = documentPanes.find((pane) => pane.key === activeKey);
    if (!query && activePane?.query) {
      setQuery(print(parse(activePane.query)));
    } else {
      updateActivePaneQuery();
    }
  });

  const handleChangeTab = (key) => {
    console.log({
      handleChangeTab: {
        key,
        documentPanes,
      },
    });

    const activePane = documentPanes.find((pane) => pane.key === key);
    console.log({ activePane });
    setQuery(print(parse(activePane.query)));
    setActiveKey(key);
  };

  const addTab = () => {
    const lastKey = parseInt(documentPanes[documentPanes.length - 1].key);

    const newPane = {
        key: `${lastKey + 1}`,
        title: "New Query",
        query: `query { posts { nodes { id, title } } }`,
      }

    updateDocumentPanes([
      ...documentPanes,
      newPane,
    ]);

    setActiveKey(newPane.key);
    
  };

  const removeTab = (key) => {
    console.log({ removeTab: key });
    if (documentPanes.length > 1) {
        updateDocumentPanes(documentPanes.filter((pane) => pane.key !== key));
    }
  };

  const handleEditTab = (targetKey, action) => {
    console.log({
      handleEditTab: {
        targetKey,
        action,
      },
    });

    switch (action) {
      case "add":
        addTab();
        break;
      case "remove":
        removeTab(targetKey);
        break;
    }
  };

  const getDocumentTitle = (tabPane) => {
    const defaultTitle = tabPane.title ?? "New Query";
    return parse(tabPane.query)?.definitions[0]?.name?.value ?? defaultTitle;
  };

  return documentPanes && documentPanes.length ? (
    <Tabs
      type="editable-card"
      activeKey={activeKey}
      onChange={handleChangeTab}
      onEdit={handleEditTab}
    >
      {documentPanes.map((tabPane) => {
        const title = getDocumentTitle(tabPane);
        return <TabPane tab={title} key={tabPane.key} />;
      })}
    </Tabs>
  ) : null;
};

hooks.addFilter(
  "graphiql_container",
  "graphiql-document-tabs",
  (res, props) => {
    return (
      <StyledTabContainer>
        <div className="antd-app">
          <DocumentTabs />
        </div>
        <StyledTabContents>{res}</StyledTabContents>
      </StyledTabContainer>
    );
  }
);

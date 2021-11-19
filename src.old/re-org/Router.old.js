import {
  BookOutlined,
  CodeOutlined,
  DatabaseOutlined,
  ForkOutlined,
  LineChartOutlined,
  SettingOutlined,
  UserOutlined,
  ToolOutlined,
  SaveOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Layout, Menu, Tabs, List } from "antd";
import GraphiQL from "graphiql";
import styled from "styled-components";
import GraphiQLContainer from "../components/GraphiQLContainer";

import { getFetcher } from "../utils/fetcher";
// import DocumentEditor from "./screens/DocumentEditor/DocumentEditor";
// import { DocumentEditorContextProvider } from "./screens/DocumentEditor/context";
const { Header, Sider, Content } = Layout;
const { useState, createElement } = wp.element;
const { hooks, useAppContext } = wpGraphiQL;
const { print, parse } = wpGraphiQL.GraphQL;

const StyledRouter = styled.div`
  .graphiql-app-screen-sider .ant-layout-sider-trigger {
    position: relative;
  }
  border: 1px solid #e8e8e8;
  width: 100%;
`;

// hooks.addFilter("graphiql_screens", "test-new-scren", (screens) => {
//   screens.push({
//     name: "test",
//     title: "Test",
//     icon: createElement(UserOutlined),
//     render: () => (
//       <Content style={{ padding: `20px` }}>
//         <h2>Test...</h2>
//       </Content>
//     ),
//   });

//   return screens;
// });

hooks.addFilter("graphiql_screens", "test-new-scren", (screens) => {
  screens.push({
    name: "metrics",
    title: "Metrics",
    icon: createElement(LineChartOutlined),
    render: () => (
      <Content style={{ padding: `20px` }}>
        <h2>Metrics...</h2>
      </Content>
    ),
  });

  return screens;
});

hooks.addFilter("graphiql_screens", "test-new-scren", (screens) => {
  screens.push({
    name: "extensions",
    title: "Extensions",
    icon: createElement(ForkOutlined),
    render: () => (
      <Content style={{ padding: `20px` }}>
        <h2>Extensions...</h2>
      </Content>
    ),
  });

  return screens;
});

hooks.addFilter("graphiql_screens", "test-new-scren", (screens) => {
  screens.push({
    name: "settings",
    title: "Settings",
    icon: createElement(SettingOutlined),
    render: () => (
      <Content style={{ padding: `20px` }}>
        <h2>Settings...</h2>
      </Content>
    ),
  });

  return screens;
});

const screens = hooks.applyFilters("graphiql_screens", [
  {
    name: "ide",
    title: "IDE",
    icon: createElement(CodeOutlined),
    render: ({ endpoint, nonce }) => {
      return <h2>Document Editor...</h2>;
      // return (
      //   <DocumentEditorContextProvider>
      //     <DocumentEditor endpoint={endpoint} nonce={nonce} />
      //   </DocumentEditorContextProvider>
      // );
    },
  },
  {
    name: "schema",
    title: "Schema",
    icon: createElement(DatabaseOutlined),
    render: () => (
      <Content style={{ padding: `20px` }}>
        <h2>Schema...</h2>
      </Content>
    ),
  },
  {
    name: "docs",
    title: "Docs",
    icon: createElement(BookOutlined),
    render: () => (
      <Content style={{ padding: `20px` }}>
        <h2>Docs...</h2>
      </Content>
    ),
  },
]);

const Router = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const [currentScreen, setCurrentScreen] = useState("ide");

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const getCurrentScreen = () => {
    return (
      screens.find((screen) => screen.name === currentScreen) ?? screens[0]
    );
  };

  const renderScreen = (props) => {
    const currentScreen = getCurrentScreen();
    return currentScreen?.render(props) || <h2>No screen...</h2>;
  };

  return (
    <StyledRouter>
      <Layout
        className="graphiql-app-layout"
        style={{ height: `calc(100vh - 65px)`, width: `100%` }}
      >
        <Sider
          className="graphiql-app-screen-sider"
          collapsible
          collapsed={collapsed}
          onCollapse={handleCollapse}
        >
          <Menu theme="dark" mode="inline">
            {screens &&
              screens.map((screen) => {
                return (
                  <Menu.Item
                    key={screen.name}
                    icon={screen.icon}
                    onClick={() => setCurrentScreen(screen.name)}
                  >
                    {screen.title}
                  </Menu.Item>
                );
              })}
          </Menu>
        </Sider>
        <Layout className="screen-layout" style={{ background: "#fff" }}>
          {renderScreen(props)}
        </Layout>
      </Layout>
    </StyledRouter>
  );
};

export default Router;

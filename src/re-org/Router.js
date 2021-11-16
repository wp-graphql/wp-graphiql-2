import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  CodeOutlined,
  DatabaseOutlined,
  LeftOutlined,
  LineChartOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import styled from "styled-components";
import { useState } from "@wordpress/element";
const { hooks } = wpGraphiQL;
const { Header, Sider, Content } = Layout;

const StyledRouter = styled.div`
  .graphiql-app-screen-sider .ant-layout-sider-trigger {
    position: relative;
  }
  border: 1px solid #e8e8e8;
  width: 100%;
`;

const getDefaultScreens = () => {
  return hooks.applyFilters("graphiql_screens", [
    {
      name: "ide",
      title: "IDE",
      icon: createElement(CodeOutlined),
      render: ({ endpoint, nonce }) => {
        return (
          <h2>IDE...</h2>
        );
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
};

const Router = (props) => {
  const [screens, setScreens] = useState(getDefaultScreens());
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
    return (
      (
        <span data-testid={`render-screen-${currentScreen.name}`}>
          {currentScreen?.render(props)}
        </span>
      ) || <h2>No screen...</h2>
    );
  };

  return (
    <StyledRouter data-testid="graphiql-router">
      <Layout
        className="graphiql-app-layout"
        style={{ height: `calc(100vh - 65px)`, width: `100%` }}
      >
        <Sider
          id="graphiql-router-sider"
          data-testid="graphiql-router-sider"
          className="graphiql-app-screen-sider"
          collapsible
          defaultCollapsed={collapsed}
          collapsed={collapsed}
          trigger={
            <span
              data-testid="router-menu-collapse-trigger"
            >
              {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </span>
          }
          onCollapse={() => {
            handleCollapse();
          }}
        >
          <Menu theme="dark" mode="inline">
            {screens &&
              screens.map((screen) => {
                return (
                  <Menu.Item
                    data-testid={`router-menu-item-${screen.name}`}
                    id={`router-menu-item-${screen.name}`}
                    key={screen.name}
                    icon={screen.icon}
                    onClick={() => {
                      setCurrentScreen(screen.name);
                    }}
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

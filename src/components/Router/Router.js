import { CodeOutlined, RightOutlined, LeftOutlined, DatabaseOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "@wordpress/element";
import styled from "styled-components";
import { hooks } from "../..";

const { Sider } = Layout;

const StyledRouter = styled.div`
.graphiql-app-screen-sider .ant-layout-sider-trigger {
    position: relative;
  }
  border: 1px solid #e8e8e8;
  width: 100%;
`;

/**
 * Get the screens that should be displayed in the router.
 * 
 * @returns 
 */
const getScreens = () => {

    const screens = [
        {
          id: "graphiql",
          title: "GraphiQL",
          icon: <CodeOutlined />,
          render: () => {
            return <h2>GraphiQL Screen...</h2>;
          },
        },
        {
            id: "schema",
            title: "Schema",
            icon: <DatabaseOutlined />,
            render: () => {
              return <h2>Schema...</h2>;
            },
          },
      ];

    const filteredScreens = hooks.applyFilters( 'graphiql_router_screens', screens );
    
    // @todo: consider better validation to ensure the screens are valid after being filtered?
    // Ensure the filtered screens are an array with at least one screen, else return the default screens
    return filteredScreens.constructor === Array && filteredScreens.length > 0 ? filteredScreens : screens;
};

const RouterSider = props => {

    const { setCurrentScreen, screens } = props;
    const [ collapsed, setCollapsed ] = useState(true);
    const handleCollapse = () => {
        setCollapsed(!collapsed);
    }

    return (
        <Sider
          id="graphiql-router-sider"
          data-testid="graphiql-router-sider"
          className="graphiql-app-screen-sider"
          collapsible
          defaultCollapsed={collapsed}
          collapsed={collapsed}
          trigger={
            <span data-testid="router-menu-collapse-trigger">
              {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </span>
          }
          onCollapse={() => { handleCollapse() }}
        >
          <Menu theme="dark" mode="inline">
            {screens &&
              screens.map((screen) => {
                return (
                  <Menu.Item
                    data-testid={`router-menu-item-${screen.id}`}
                    id={`router-menu-item-${screen.id}`}
                    key={screen.id}
                    icon={screen.icon}
                    onClick={() => {
                      setCurrentScreen(screen.id);
                    }}
                  >
                    {screen.title}
                  </Menu.Item>
                );
              })}
          </Menu>
        </Sider>
    )
}

const Router = (props) => {
  const [screens, setScreens] = useState(getScreens());
  const [currentScreen, setCurrentScreen] = useState("graphiql");

  const getCurrentScreen = () => {
    return screens.find((screen) => screen.id === currentScreen) ?? screens[0];
  };

  const renderScreen = (props) => {
    const screen = getCurrentScreen();

    return screen ? (
      <Layout data-testid={`router-screen-${screen.id}`}>
        {screen?.render(props)}
      </Layout>
    ) : null;
  };

  return currentScreen ? (
    <StyledRouter data-testid="graphiql-router">
        <Layout style={{ height: `calc(100vh - 65px)`, width: `100%` }}>
            <RouterSider
                setCurrentScreen={setCurrentScreen} 
                screens={screens}
            />  
            <Layout className="screen-layout" style={{ background: "#fff" }}>
                {renderScreen(props)}
            </Layout>
        </Layout>
    </StyledRouter>
    ) : null;
};

export default Router;

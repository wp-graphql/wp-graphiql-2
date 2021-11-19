import { LineChartOutlined } from "@ant-design/icons";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import Router from "./Router";

beforeEach(() => {});

afterEach(() => {
  cleanup();
});

describe("Router", () => {
  test("it should render", async () => {
    await act(async () => {
      render(<Router />);
    });
  });

  test("router should render GraphiQL by default", async () => {
    await act(async () => {
      render(<Router />);
      expect(screen.getByTestId("router-screen-graphiql")).toBeInTheDocument();
    });
  });

  test("clicking router menu item changes route to associated screen", async () => {
      await act(async () => {
          render(<Router />);

          // Default router layout is graphiql
          expect(screen.queryByTestId("router-screen-graphiql")).toBeInTheDocument();
         
          // schema screen should not be rendered
          expect(screen.queryByTestId("router-screen-schema")).not.toBeInTheDocument();

            // click menu item to change route
            const button = screen.getByTestId("router-menu-item-schema");
            fireEvent.click(button);
            
            await waitFor(() => {
                screen.queryByTestId('router-screen-schema')
            })

            // graphiql screen should no longer be rendered
            expect(screen.queryByTestId("router-screen-graphiql")).not.toBeInTheDocument();
            
            // schema screen should be rendered
            expect(screen.queryByTestId("router-screen-schema")).toBeInTheDocument();

      })
      
  })

  test("clicking expand menu button expands the menu", async () => {
    await act(async () => {
        render(<Router />);
        let sider = screen.queryByTestId("graphiql-router-sider");
        let siderClassList = sider.classList;
        const trigger = screen.queryByTestId("router-menu-collapse-trigger");
        expect(trigger).toBeInTheDocument();
        expect(sider).toBeInTheDocument();

        // The sider should be collapsed by default
        expect(sider).toHaveClass("ant-layout-sider-collapsed");

        // Clicking the trigger should expand the sider
        fireEvent.click(trigger);

        // Wait for the sider to expand
        waitFor(() => {
        // The sider should now be expanded
        expect(sider).not.toHaveClass("ant-layout-sider-collapsed");
        });
    });
    });

    test("clicking filtered screen menu item should replace screen with filtered screen", async () => {
        const { hooks } = wpGraphiQL;
    
        hooks.addFilter("graphiql_router_screens", "router-test", (screens) => {
            screens.push({
                id: "testScreen",
                title: "Test Screen Menu Item",
                icon: <LineChartOutlined />,
                render: () => <h2>Test Screen...</h2>,
            });
            return screens;
        });
    
        await act(async () => {
            render(<Router />);
    
            expect(screen.getByText("Test Screen Menu Item")).toBeInTheDocument();
    
            // IDE is the defualt screen we should see
            expect(screen.queryByTestId("router-screen-graphiql")).toBeInTheDocument();
    
            // testScreen should not be present until we navigate to it
            expect(
            screen.queryByTestId("router-screen-testScreen")
            ).not.toBeInTheDocument();
    
            // Click the testScreen menu button
            const button = screen.queryByTestId("router-menu-item-testScreen");
            fireEvent.click(button);
    
            // Wait for the state change caused by the click
            await waitFor(() => screen.queryByTestId("router-screen-testScreen"));
    
            // IDE screen should not be present anymore
            expect(screen.queryByTestId("router-screen-ide")).not.toBeInTheDocument();
    
            // testScreen screen should now be present
            expect(
            screen.queryByTestId("router-screen-testScreen")
            ).toBeInTheDocument();
        });
        });

        
});

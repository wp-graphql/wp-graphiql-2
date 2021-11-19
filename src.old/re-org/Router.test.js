import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import Router from "./Router";
import { LineChartOutlined } from "@ant-design/icons";

beforeEach(() => {
  // setup functions to run before each test
});

afterEach(() => {
  //
  cleanup();
});

describe("Router", () => {
  test("it should render", async () => {
    await act(async () => {
      render(<Router />);
      const router = screen.getByTestId("graphiql-router");
      expect(router).toBeInTheDocument();
    });
  });

  test("menu should have links to different screens", async () => {
    await act(async () => {
      render(<Router />);
      expect(screen.getByText("IDE...")).toBeInTheDocument();
    });
  });

  test("clicking schema renders schema screen", async () => {
    await act(async () => {
      render(<Router />);

      // IDE is the defualt screen we should see
      expect(screen.queryByTestId("render-screen-ide")).toBeInTheDocument();

      // testScreen should not be present until we navigate to it
      expect(
        screen.queryByTestId("render-screen-schema")
      ).not.toBeInTheDocument();

      // Click the testScreen menu button
      const button = screen.queryByTestId("router-menu-item-schema");
      fireEvent.click(button);

      // Wait for the state change caused by the click
      await waitFor(() => screen.queryByTestId("render-screen-schema"));

      // IDE screen should not be present anymore
      expect(screen.queryByTestId("render-screen-ide")).not.toBeInTheDocument();

      // testScreen screen should now be present
      expect(screen.queryByTestId("render-screen-schema")).toBeInTheDocument();
    });
  });

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

    hooks.addFilter("graphiql_screens", "router-test", (screens) => {
      screens.push({
        name: "testScreen",
        title: "Test Screen Menu Item",
        icon: createElement(LineChartOutlined),
        render: () => <h2>Test Screen...</h2>,
      });
      return screens;
    });

    await act(async () => {
      render(<Router />);

      expect(screen.getByText("Test Screen Menu Item")).toBeInTheDocument();

      // IDE is the defualt screen we should see
      expect(screen.queryByTestId("render-screen-ide")).toBeInTheDocument();

      // testScreen should not be present until we navigate to it
      expect(
        screen.queryByTestId("render-screen-testScreen")
      ).not.toBeInTheDocument();

      // Click the testScreen menu button
      const button = screen.queryByTestId("router-menu-item-testScreen");
      fireEvent.click(button);

      // Wait for the state change caused by the click
      await waitFor(() => screen.queryByTestId("render-screen-testScreen"));

      // IDE screen should not be present anymore
      expect(screen.queryByTestId("render-screen-ide")).not.toBeInTheDocument();

      // testScreen screen should now be present
      expect(
        screen.queryByTestId("render-screen-testScreen")
      ).toBeInTheDocument();
    });
  });
});

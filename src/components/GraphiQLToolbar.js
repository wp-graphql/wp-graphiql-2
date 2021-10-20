import { GraphiQL } from "graphiql";
const { hooks } = wpGraphiQL;
const { useState, useEffect, useRef } = wp.element;

const GraphiQLToolbar = (props) => {
  const { graphiql } = props;

  const [state, setState] = useState({
    buttons: [],
  });

  const { buttons } = state;

  const updateState = (newState) => {
    setState({ ...state, ...newState });
  };

  useEffect(() => {
    let defaultButtons = [
      {
        label: `Prettify`,
        title: `Prettify Query (Shift-Ctrl-P)`,
        onClick: (GraphiQL) => {
          GraphiQL().handlePrettifyQuery();
        },
      },
      {
        label: `History`,
        title: `Show History`,
        onClick: (GraphiQL) => {
          GraphiQL().handleToggleHistory();
        },
      },
    ];

    if (!buttons.length) {
      defaultButtons = hooks.applyFilters(
        "graphiql_toolbar_buttons",
        defaultButtons,
        state,
        updateState,
        graphiql
      );

      console.log({ defaultButtons });

      if (buttons !== defaultButtons) {
        setState({ ...state, buttons: defaultButtons });
      }
    }
  });

  const filterContext = {
    ...props,
    ...{ GraphiQL },
  };

  const beforeToolbarButtons = hooks.applyFilters(
    "graphiql_toolbar_before_buttons",
    [],
    filterContext
  );
  const afterToolbarButtons = hooks.applyFilters(
    "graphiql_toolbar_after_buttons",
    [],
    filterContext
  );

  return (
    <>
      {beforeToolbarButtons.length > 0 ? beforeToolbarButtons : null}

      {buttons &&
        buttons.map((button) => {
          const { label, title, onClick } = button;
          return (
            <GraphiQL.Button
              onClick={() => {
                onClick(graphiql);
              }}
              label={label}
              title={title}
            />
          );
        })}

      {afterToolbarButtons.length > 0 ? afterToolbarButtons : null}
    </>
  );
};

export default GraphiQLToolbar;

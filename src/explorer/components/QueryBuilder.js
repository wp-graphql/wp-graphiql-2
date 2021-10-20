import {
  defaultGetDefaultFieldNames,
  defaultGetDefaultScalarArgValue,
  defaultColors,
  defaultStyles,
  defaultCheckboxChecked,
  defaultCheckboxUnchecked,
  defaultArrowClosed,
  defaultArrowOpen,
  memoizeParseQuery,
  DEFAULT_DOCUMENT,
  capitalize,
} from "../utils/utils";
import RootView from "./RootView";
import AddOperations from "./AddOperations";
import "../index.scss";
import { root } from "postcss";

const { GraphQLObjectType, print } = wpGraphiQL.GraphQL;

const { useState, useEffect, useRef } = wp.element;

const QueryBuilder = (props) => {
  const [newOperationType, setNewOperationType] = useState("query");
  const [operation, setOperation] = useState(null);
  const [operationToScrollTo, setOperationToScrollTo] = useState(null);

  let container = useRef(null);

  const _resetScroll = () => {
    if (container) {
      container.scrollLeft = 0;
    }
  };

  useEffect(() => {
    // _resetScroll()
  });

  const _onEdit = (query) => props.onEdit(query);

  const _setAddOperationType = (value) => {
    setNewOperationType(value);
  };

  const _handleRootViewMount = (rootViewElId) => {
    console.log(`_handleRootViewMount ${rootViewElId}`);

    if (!!operationToScrollTo && operationToScrollTo === rootViewElId) {
      // let selector = `.graphiql-explorer-root #${rootViewElId}`;
      //
      // let el = document.querySelector(selector);
      // el && el.scrollIntoView();
      console.log(`scrollIntoView...`);
    }
  };

  const { schema, query, makeDefaultArg } = props;

  if (!schema) {
    return (
      <div style={{ fontFamily: "sans-serif" }} className="error-container">
        No Schema Available
      </div>
    );
  }

  const styleConfig = {
    colors: props.colors || defaultColors,
    checkboxChecked: props.checkboxChecked || defaultCheckboxChecked,
    checkboxUnchecked: props.checkboxUnchecked || defaultCheckboxUnchecked,
    arrowClosed: props.arrowClosed || defaultArrowClosed,
    arrowOpen: props.arrowOpen || defaultArrowOpen,
    styles: props.styles
      ? {
          ...defaultStyles,
          ...props.styles,
        }
      : defaultStyles,
  };

  const queryType = schema.getQueryType();
  const mutationType = schema.getMutationType();
  const subscriptionType = schema.getSubscriptionType();

  if (!queryType && !mutationType && !subscriptionType) {
    return <div>Missing query type</div>;
  }
  const queryFields = queryType && queryType.getFields();
  const mutationFields = mutationType && mutationType.getFields();
  const subscriptionFields = subscriptionType && subscriptionType.getFields();

  const parsedQuery = memoizeParseQuery(query);

  const getDefaultFieldNames =
    props.getDefaultFieldNames || defaultGetDefaultFieldNames;

  const getDefaultScalarArgValue =
    props.getDefaultScalarArgValue || defaultGetDefaultScalarArgValue;

  const definitions = parsedQuery.definitions;

  const _relevantOperations = definitions
    .map((definition) => {
      if (definition.kind === "FragmentDefinition") {
        return definition;
      } else if (definition.kind === "OperationDefinition") {
        return definition;
      } else {
        return null;
      }
    })
    .filter(Boolean);

  const relevantOperations =
    // If we don't have any relevant definitions from the parsed document,
    // then at least show an expanded Query selection
    _relevantOperations.length === 0
      ? DEFAULT_DOCUMENT.definitions
      : _relevantOperations;

  const renameOperation = (targetOperation, name) => {
    const newName =
      name == null || name === ""
        ? null
        : { kind: "Name", value: name, loc: undefined };
    const newOperation = { ...targetOperation, name: newName };

    const existingDefs = parsedQuery.definitions;

    const newDefinitions = existingDefs.map((existingOperation) => {
      if (targetOperation === existingOperation) {
        return newOperation;
      } else {
        return existingOperation;
      }
    });

    return {
      ...parsedQuery,
      definitions: newDefinitions,
    };
  };

  const cloneOperation = (targetOperation) => {
    let kind;
    if (targetOperation.kind === "FragmentDefinition") {
      kind = "fragment";
    } else {
      kind = targetOperation.operation;
    }

    const newOperationName =
      ((targetOperation.name && targetOperation.name.value) || "") + "Copy";

    const newName = {
      kind: "Name",
      value: newOperationName,
      loc: undefined,
    };

    const newOperation = { ...targetOperation, name: newName };

    const existingDefs = parsedQuery.definitions;

    const newDefinitions = [...existingDefs, newOperation];

    console.log(`scroll to ${kind}-${newOperationName}`);
    // setOperationToScrollTo(`${kind}-${newOperationName}`);

    return {
      ...parsedQuery,
      definitions: newDefinitions,
    };
  };

  const destroyOperation = (targetOperation) => {
    const existingDefs = parsedQuery.definitions;

    const newDefinitions = existingDefs.filter((existingOperation) => {
      if (targetOperation === existingOperation) {
        return false;
      } else {
        return true;
      }
    });

    return {
      ...parsedQuery,
      definitions: newDefinitions,
    };
  };

  const addOperation = (kind) => {
    const existingDefs = parsedQuery.definitions;

    const viewingDefaultOperation =
      parsedQuery.definitions.length === 1 &&
      parsedQuery.definitions[0] === DEFAULT_DOCUMENT.definitions[0];

    const MySiblingDefs = viewingDefaultOperation
      ? []
      : existingDefs.filter((def) => {
          if (def.kind === "OperationDefinition") {
            return def.operation === kind;
          } else {
            // Don't support adding fragments from explorer
            return false;
          }
        });

    const newOperationName = `My${capitalize(kind)}${
      MySiblingDefs.length === 0 ? "" : MySiblingDefs.length + 1
    }`;

    // Add this as the default field as it guarantees a valid selectionSet
    const firstFieldName = "__typename # Placeholder value";

    const selectionSet = {
      kind: "SelectionSet",
      selections: [
        {
          kind: "Field",
          name: {
            kind: "Name",
            value: firstFieldName,
            loc: null,
          },
          arguments: [],
          directives: [],
          selectionSet: null,
          loc: null,
        },
      ],
      loc: null,
    };

    const newDefinition = {
      kind: "OperationDefinition",
      operation: kind,
      name: { kind: "Name", value: newOperationName },
      variableDefinitions: [],
      directives: [],
      selectionSet: selectionSet,
      loc: null,
    };

    const newDefinitions =
      // If we only have our default operation in the document right now, then
      // just replace it with our new definition
      viewingDefaultOperation
        ? [newDefinition]
        : [...parsedQuery.definitions, newDefinition];

    const newOperationDef = {
      ...parsedQuery,
      definitions: newDefinitions,
    };

    console.log(`scroll to ${kind}-${newOperationName}`);
    // setOperationToScrollTo(`${kind}-${newOperationName}`);

    props.onEdit(print(newOperationDef));
  };

  let actionsOptions = [];

  if (queryFields) {
    actionsOptions.push({
      type: `query`,
      label: `Queries`,
      fields: () => {
        return queryFields;
      },
    });
  }

  if (subscriptionFields) {
    actionsOptions.push({
      type: `subscription`,
      label: `Subscriptions`,
      fields: () => {
        return subscriptionFields;
      },
    });
  }

  if (mutationFields) {
    actionsOptions.push({
      type: `mutation`,
      label: `Mutations`,
      fields: () => {
        return mutationFields;
      },
    });
  }

  const actionsEl = (
    <AddOperations
      query={query}
      actionOptions={actionsOptions}
      addOperation={addOperation}
    />
  );

  // const actionsEl =
  //   actionsOptions.length === 0 ? null : (
  //     <div
  //       style={{
  //         minHeight: "50px",
  //         maxHeight: "50px",
  //         overflow: "none",
  //       }}
  //     >
  //       <form
  //         className="variable-editor-title graphiql-explorer-actions"
  //         style={{
  //           ...styleConfig.styles.explorerActionsStyle,
  //           display: "flex",
  //           flexDirection: "row",
  //           alignItems: "center",
  //           borderTop: "1px solid rgb(214, 214, 214)",
  //         }}
  //         onSubmit={(event) => event.preventDefault()}
  //       >
  //         <span
  //           style={{
  //             display: "inline-block",
  //             flexGrow: "0",
  //             textAlign: "right",
  //           }}
  //         >
  //           Add new{" "}
  //         </span>
  //         <select
  //           onChange={(event) => _setAddOperationType(event.target.value)}
  //           value={newOperationType}
  //           style={{ flexGrow: "2" }}
  //         >
  //           {actionsOptions}
  //         </select>
  //         <button
  //           type="submit"
  //           className="toolbar-button"
  //           onClick={() =>
  //             newOperationType ? addOperation(newOperationType) : null
  //           }
  //           style={{
  //             ...styleConfig.styles.buttonStyle,
  //             height: "22px",
  //             width: "22px",
  //           }}
  //         >
  //           <span>+</span>
  //         </button>
  //       </form>
  //     </div>
  //   );

  const availableFragments = relevantOperations.reduce((acc, operation) => {
    if (operation.kind === "FragmentDefinition") {
      const fragmentTypeName = operation.typeCondition.name.value;
      const existingFragmentsForType = acc[fragmentTypeName] || [];
      const newFragmentsForType = [...existingFragmentsForType, operation].sort(
        (a, b) => a.name.value.localeCompare(b.name.value)
      );
      return {
        ...acc,
        [fragmentTypeName]: newFragmentsForType,
      };
    }

    return acc;
  }, {});

  return (
    <div
      ref={(node) => {
        container = node;
      }}
      style={{
        fontSize: 12,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        margin: 0,
        padding: 8,
        fontFamily:
          'Consolas, Inconsolata, "Droid Sans Mono", Monaco, monospace',
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      className="graphiql-explorer-root antd-app"
    >
      <div
        style={{
          flexGrow: 1,
          overflowY: "scroll",
          width: `100%`,
          padding: "10px",
        }}
      >
        {relevantOperations.map((operation, index) => {
          const operationName =
            operation && operation.name && operation.name.value;

          const operationType =
            operation.kind === "FragmentDefinition"
              ? "fragment"
              : (operation && operation.operation) || "query";

          const onOperationRename = (newName) => {
            const newOperationDef = renameOperation(operation, newName);
            props.onEdit(print(newOperationDef));
          };

          const onOperationClone = () => {
            const newOperationDef = cloneOperation(operation);
            props.onEdit(print(newOperationDef));
          };

          const onOperationDestroy = () => {
            const newOperationDef = destroyOperation(operation);
            props.onEdit(print(newOperationDef));
          };

          const fragmentType =
            operation.kind === "FragmentDefinition" &&
            operation.typeCondition.kind === "NamedType" &&
            schema.getType(operation.typeCondition.name.value);

          const fragmentFields =
            fragmentType instanceof GraphQLObjectType
              ? fragmentType.getFields()
              : null;

          const fields =
            operationType === "query"
              ? queryFields
              : operationType === "mutation"
              ? mutationFields
              : operationType === "subscription"
              ? subscriptionFields
              : operation.kind === "FragmentDefinition"
              ? fragmentFields
              : null;

          const fragmentTypeName =
            operation.kind === "FragmentDefinition"
              ? operation.typeCondition.name.value
              : null;

          const onCommit = (parsedDocument) => {
            const textualNewDocument = print(parsedDocument);

            props.onEdit(textualNewDocument);
          };

          return (
            <RootView
              key={index}
              index={index}
              isLast={index === relevantOperations.length - 1}
              fields={fields}
              operationType={operationType}
              name={operationName}
              definition={operation}
              onOperationRename={onOperationRename}
              onOperationDestroy={onOperationDestroy}
              onOperationClone={onOperationClone}
              onTypeName={fragmentTypeName}
              onMount={_handleRootViewMount}
              onCommit={onCommit}
              onEdit={(newDefinition, options) => {
                let commit;
                if (
                  typeof options === "object" &&
                  typeof options.commit !== "undefined"
                ) {
                  commit = options.commit;
                } else {
                  commit = true;
                }

                if (!!newDefinition) {
                  const newQuery = {
                    ...parsedQuery,
                    definitions: parsedQuery.definitions.map(
                      (existingDefinition) =>
                        existingDefinition === operation
                          ? newDefinition
                          : existingDefinition
                    ),
                  };

                  if (commit) {
                    onCommit(newQuery);
                    return newQuery;
                  } else {
                    return newQuery;
                  }
                } else {
                  return parsedQuery;
                }
              }}
              schema={schema}
              getDefaultFieldNames={getDefaultFieldNames}
              getDefaultScalarArgValue={getDefaultScalarArgValue}
              makeDefaultArg={makeDefaultArg}
              onRunOperation={() => {
                if (!!props.onRunOperation) {
                  props.onRunOperation(operationName);
                }
              }}
              styleConfig={styleConfig}
              availableFragments={availableFragments}
            />
          );
        })}
      </div>
      {actionsEl}
    </div>
  );
};

export default QueryBuilder;

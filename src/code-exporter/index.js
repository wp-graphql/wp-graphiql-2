import {
    CodeExporterContext,
    useCodeExporter,
    CodeExporterProvider
} from "./components/ExporterContext";

const { hooks } = window.wpGraphiQL;

/**
 * Hook into the GraphiQL Toolbar to add the button to toggle the Explorer
 */
hooks.addFilter(
    "graphiql_toolbar_after_buttons",
    "graphiql-code-exporter",
    (res, props) => {
        const { GraphiQL } = props;

        const { toggleCodeExporter } = useCodeExporter();

        res.push(
            <CodeExporterContext.Consumer>
                {(context) => {
                    return (
                        <GraphiQL.Button
                            onClick={() => {
                                // Toggle the state of the code exporter context
                                toggleCodeExporter();
                            }}
                            label="Exporter"
                            title="Exporter"
                        />
                    );
                }}
            </CodeExporterContext.Consumer>
        );

        return res;
    }
);

/**
 * Wrap the GraphiQL App with the exporter context
 */
hooks.addFilter("graphiql_app", "graphiql-code-exporter", (app, args) => {
    return <CodeExporterProvider>{app}</CodeExporterProvider>;
});

const CodeExporter = () => {

    const { isCodeExporterOpen } = useCodeExporter()

    return isCodeExporterOpen ? (
        <h2>Code Exporter!!</h2>
    ) : null
}

hooks.addFilter(
    "graphiql_after_graphiql",
    "graphiql-code-exporter",
    (res, props) => {
        res.push(<CodeExporter {...props} />);
        return res;
    }
);

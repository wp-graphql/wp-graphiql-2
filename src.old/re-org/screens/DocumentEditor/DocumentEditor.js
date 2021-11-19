import ActiveDocument from "./ActiveDocument/ActiveDocument";
import DocumentFinder from "./DocumentFinder/DocumentFinder";
import FileMenu from "./FileMenu/FileMenu";
import { documentEditorMachine } from "./machine";
import { useMachine } from "@xstate/react";
import { interpret } from "xstate";
import { Layout } from "antd";
const { Header, Content, Sider } = Layout;

const getNewDocument = () => {
  return {
    id: Math.random().toString(36).substring(7),
    title: "New Document...",
  };
};

const DocumentEditor = () => {
  const [state, dispatch] = useMachine(documentEditorMachine);

  // if ( 'loadingInitialDocuments' === state.value ) {

  //     console.log( {
  //         dispatch: {
  //             'LOAD_INITIAL_DOCUMENTS': {
  //                 event: { documents: [getNewDocument()] }
  //         }}
  //     })

  //     dispatch({
  //         type: 'LOAD_INITIAL_DOCUMENTS',
  //         event: {
  //             documents: [getNewDocument()]
  //         }
  //     })
  // }

  const service = interpret(documentEditorMachine)
    .onTransition((state) => {
      console.log(state.value);
    })
    .start();

  return (
    <>
      <Header>
        <FileMenu />
      </Header>
      <Content>
        <Layout style={{ height: "100%" }}>
          <Sider style={{ height: "100%", overflow: "scroll" }}>
            <DocumentFinder />
          </Sider>
          <Content style={{ padding: `20px` }}>
            <ActiveDocument />
          </Content>
        </Layout>
      </Content>
    </>
  );
};

export default DocumentEditor;

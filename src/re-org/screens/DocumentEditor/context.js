import { useState, useContext, createContext } from "@wordpress/element";
const { print, parse } = wpGraphiQL.GraphQL;
export const DocumentEditorContext = createContext();

export const useDocumentEditorContext = () => useContext(DocumentEditorContext);

const getUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const getDefaultDocument = (documentName) => {
  return {
    key: getUniqueId(),
    documentName: documentName ?? "untitled",
    databaseId: null,
    document: `
        query GetPosts {
            posts {
                nodes {
                id
                title
                date
                }
            }
        }  
        `,
  };
};

export const DocumentEditorContextProvider = ({ children }) => {
  const getDefaultOpenDocuments = () => {
    const localDocuments = JSON.parse(
      localStorage.getItem("graphiql:openDocuments")
    );
    return localDocuments ? localDocuments : [getDefaultDocument()];
  };

  const [currentlyOpenDocuments, setCurrentlyOpenDocuments] = useState(
    getDefaultOpenDocuments()
  );

  const [activeDocumentKey, setActiveDocumentKey] = useState(
    currentlyOpenDocuments[0].key ?? null
  );

  const updateCurrentlyOpenDocuments = (newCurrentlyOpenDocuments) => {
    setCurrentlyOpenDocuments(newCurrentlyOpenDocuments);
    localStorage.setItem(
      "graphiql:openDocuments",
      JSON.stringify(newCurrentlyOpenDocuments)
    );
  };

  const getActiveDocument = () => {
    return currentlyOpenDocuments.find((doc) => doc.key === activeDocumentKey);
  };

  const getActiveDocumentKey = () => {
    return activeDocumentKey;
  };

  const renameDocument = (document, newName) => {};

  const saveDocument = () => {
    console.log("saveDocument");
    alert("saveDocument");
  };

  const deleteDocument = (document) => {};

  const value = {
    currentlyOpenDocuments,
    setCurrentlyOpenDocuments: updateCurrentlyOpenDocuments,
    updateCurrentDocument: () => {
      console.log("updateCurrentDocument");
    },
    saveDocument,
    createNewDocument: () => {
      console.log("createNewDocument");
      const newCurrentlyOpenDocuments = [...currentlyOpenDocuments];

      // find docoments with a name starting with untitled
      const untitledDocumentCount = newCurrentlyOpenDocuments.filter((doc) =>
        doc?.documentName.startsWith("untitled")
      ).length;
      const documentName =
        untitledDocumentCount > 0
          ? `untitled-${untitledDocumentCount + 1}`
          : "untitled";

      const newDocument = getDefaultDocument(documentName);
      newCurrentlyOpenDocuments.push(newDocument);
      updateCurrentlyOpenDocuments(newCurrentlyOpenDocuments);

      console.log({ newDocument });

      setActiveDocumentKey(newDocument.key);
    },
    removeDocumentFromOpenDocuments: (key) => {
      if (currentlyOpenDocuments.length <= 1) {
        return;
      }

      // get index of current document
      let lastIndex =
        currentlyOpenDocuments.findIndex((doc) => doc.key === key) ?? 0;
      let newActiveKey = activeDocumentKey;

      const newCurrentlyOpenDocuments = currentlyOpenDocuments.filter(
        (document) => document.key !== key
      );

      if (lastIndex >= 0) {
        newActiveKey =
          lastIndex > 0
            ? newCurrentlyOpenDocuments[lastIndex - 1].key
            : newCurrentlyOpenDocuments[lastIndex + 1].key;
      } else {
        newActiveKey = newCurrentlyOpenDocuments[0].key;
      }

      updateCurrentlyOpenDocuments(newCurrentlyOpenDocuments);
      setActiveDocumentKey(newActiveKey);
    },
    deleteDocument: () => {
      console.log("deleteDocument");
    },
    duplicateDocument: () => {
      console.log("duplicateDocument");
    },
    renameDocument: () => {
      console.log("renameDocument");
    },
    getActiveDocument,
    getActiveDocumentKey,
    setActiveDocumentKey,
  };

  return (
    <DocumentEditorContext.Provider value={value}>
      {children}
    </DocumentEditorContext.Provider>
  );
};

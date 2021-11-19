import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

const getNewDocument = () => {
  return {
    id: Math.random().toString(36).substring(7),
    title: "New Document...",
  };
};

const getInitialDocument = () => {
  return {
    id: Math.random().toString(36).substring(7),
    title: "Initial Document...",
  };
};
// const machine = {
//     id: "documentEditor",
//     initial: "idle",
//     context: {
//       activeDocuments: [],
//       currentDocument: null,
//     },
//     states: {
//       idle: {
//         on: {
//           openDocument: {
//               target: 'loadingDocument'
//           },
//           closeDocument: {
//               target: "closeDocument",
//           },
//         },
//       },
//       closeDocument: {
//         invoke: {
//           id: "closeDocument",
//           src: "closeDocument",
//           onDone: {
//             target: "idle",
//           },
//         },
//       },
//       loadingDocument: {
//         invoke: {
//           id: "loadingDocument",
//           src: "openNewDocument",
//           onError: {
//             target: "openDocumentFailure",
//           },
//           onDone: {
//             target: "idle",
//           },
//           actions: assign((context, event) => {

//                 const newDocument = {
//                     id: Math.random().toString(36).substring(7),
//                     title: 'New Document...',
//                 };

//                   return {
//                       activeDocuments: [...context.activeDocuments, newDocument],
//                       currentDocument: newDocument,
//                   }

//               }),
//         },
//       },
//       openDocumentFailure: {
//         on: {
//           RETRY: "loadingDocument",
//           CANCEL: "idle",
//         },
//       },
//     },
//   }

const machine = {
  id: "documentEditor",
  initial: "loadingInitialDocuments",
  context: {
    activeDocuments: [],
    currentDocument: null,
  },
  states: {
    idle: {
      on: {
        createNewDocument: {
          target: "creatingNewDocument",
        },
        closeDocument: {
          target: "closingDocument",
        },
        selectNewDocument: {
          target: "idle",
          actions: assign((context, event) => {
            return {
              currentDocument: event.documentId,
            };
          }),
        },
        saveDocument: {},
      },
    },
    loadingInitialDocuments: {
      invoke: {
        id: "loadInitialDocuments",
        src: () => async (send) => {
          console.log("LOAD_INITIAL_DOCUMENTS: invoked...");
          send({
            type: "LOAD_INITIAL_DOCUMENTS",
            payload: { documents: [getInitialDocument()] },
          });
        },
      },
      on: {
        LOAD_INITIAL_DOCUMENTS: {
          target: "idle",
          actions: assign((context, event) => {
            return {
              activeDocuments: event.payload.documents ?? [],
              currentDocument: event.payload.documents[0].id ?? null,
            };
          }),
        },
      },
      onDone: {
        target: "idle",
      },
    },
    creatingNewDocument: {
      invoke: {
        id: "createNewDocument",
        src: () => async (send) => {
          console.log("CREATE_NEW_DOCUMENT: invoked...");
          send({
            type: "CREATE_NEW_DOCUMENT",
            payload: { document: getNewDocument() },
          });
        },
      },
      on: {
        CREATE_NEW_DOCUMENT: {
          target: "idle",
          actions: assign((context, event) => {
            console.log({
              assignNewDocumentToContext: {
                context,
                event,
              },
            });

            return {
              currentDocument: event.payload.document.id ?? null,
              activeDocuments:
                [...context.activeDocuments, event.payload.document] ?? [],
            };
          }),
        },
      },
      onDone: {
        target: "idle",
      },
    },
    closingDocument: {
      onDone: {
        target: "savingDocument",
      },
    },
    savingDocument: {
      onDone: {
        target: "idle",
      },
    },
  },
};

export const documentEditorMachine = createMachine(machine);

// import { render } from "@testing-library/react"
// import userEvent from "@testing-library/user-event"
// import DocumentEditor from "./DocumentEditor"

// describe('DocumentEditor.Context', () => {

//     beforeEach(() =>{
//         render(<DocumentEditor />)
//     })

//     describe('when page is initialized', () => {
//         it('should have one document tab visible', () => {
//             expect(document.getElementsByClassName('editable-graphql-document').length).toBe(1)
//         })
//     })

//     describe('when a new document is added', () => {
//         beforeEach(()=>{
//             userEvent.click(document.getElementById('add-document-button'))
//         })
//         it('should have two document tabs visible', () => {
//             expect(document.getElementsByClassName('editable-graphql-document').length).toBe(2)
//         })
//     })

//     // describe('when an untouched document is closed', () => {
//     //     beforeEach(()=>{

//     //         // get first remove document button from tabs
//     //         const closeDocument = document.getElementsByClassName('close-document-button')[0]
//     //         userEvent.click(closeDocument)
//     //     })
//     //     it('should no longer be visible', () => {
//     //         expect(document.getElementsByClassName('editable-graphql-document').length).toBe(1)
//     //     })
//     // })

//     describe('when the "document close" button is clicked', () => {
//         describe('if the document is a local document', () => {
//             describe('when the document is untouched', () => {})
//             describe('when the document is has unsaved changes', () => {})
//         })
//         describe('if the docmeunt is a remote document', () => {
//             describe('when the document is untouched', () => {})
//             describe('when the document is has unsaved changes', () => {})
//         })
//     })

//     describe('when the "save document" button is clicked', () => {

//         // If we're saving a document that hasn't been saved before, we should
//         // validate that the document is unique. If there's a document
//         // with the same normalized operation, we should show an error.
//         // The user will need to make the document unique prior to saving,
//         // chose to apply the changes to an existing document, or cancel the save.
//         describe('if the document is a local document', () => {
//             describe('when the document is untouched', () => {
//                 // The user should be prompted to give the document a name
//                 // and a description.
//                 // The document should be validated to ensure that it is unique.
//             })
//             describe('when the document is has unsaved changes', () => {})
//         })
//         describe('if the document is a remote document', () => {
//             describe('when the document is untouched', () => {})
//             describe('when the document is has unsaved changes', () => {})
//         })
//     })

//     describe('when the "delete document" button is clicked', () => {
//         describe('if the document is a local document', () => {
//             describe('when the document is untouched', () => {})
//             describe('when the document is has unsaved changes', () => {})
//         })
//         describe('if the document is a remote document', () => {
//             describe('when the document is untouched', () => {})
//             describe('when the document is has unsaved changes', () => {})
//         })
//     });

// })

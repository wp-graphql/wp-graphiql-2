import ActiveDocumentEditor from "./components/ActiveDocumentEditor/ActiveDocumentEditor";
import ResponseInspector from "./components/ResponseInspector/ResponseInspector";

const ActiveDocument = () => {
  return (
    <div>
      <ActiveDocumentEditor />
      <ResponseInspector />
    </div>
  );
};

export default ActiveDocument;

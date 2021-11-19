import { AppStateMachine } from "../../../components/App/machine";
import { useMachine } from "@xstate/react";

const Schema = ({ schema }) => {
  const [current, send] = useMachine(AppStateMachine);

  return (
    <div>
      <h1>Schema</h1>
      <pre>{JSON.stringify(current.value, null, 2)}</pre>
      <pre>{JSON.stringify(current.context, null, 2)}</pre>
    </div>
  );
};

export default Schema;

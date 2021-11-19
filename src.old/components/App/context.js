import React, { createContext } from "react";
import { useInterpret } from "@xstate/react";
import { AppStateMachine } from "./machine";

export const AppStateContext = createContext({});

export const AppStateProvider = (props) => {
  const appMachineService = useInterpret(AppStateMachine);

  return (
    <AppStateContext.Provider value={{ appMachineService }}>
      {props.children}
    </AppStateContext.Provider>
  );
};

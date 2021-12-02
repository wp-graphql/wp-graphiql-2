import { useContext, createContext, useState } from "@wordpress/element";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

/**
 * Get the enpoint from the localized settings provided by WordPress when it enqueues the app
 * @returns 
 */
export const getEndpoint = () => {
    return window?.wpGraphiQLSettings?.graphqlEndpoint ?? null;
};

/**
 * Get the nonce from the localized settings provided by WordPress when it enqueues the app
 * 
 * @returns 
 */
export const getNonce = () => {
    return window?.wpGraphiQLSettings?.nonce ?? null;
}

/**
 * AppContextProvider
 * 
 * This provider maintains context useful for the entire application.
 * 
 * @param {*} param0 
 * @returns 
 */
export const AppContextProvider = ({ children }) => {
    
    const [ schema, setSchema ] = useState(null);

    let appContextValue = {
        endpoint: getEndpoint(),
        nonce: getNonce(),
        schema,
        setSchema, 
    }

    // appContextValue = hooks.applyFilters( 'graphiql_app_context', appContextValue );

    return (
        <AppContext.Provider value={ appContextValue }>
            {children}
        </AppContext.Provider>
    )
}
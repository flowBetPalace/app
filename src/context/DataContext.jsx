'use client';

import { createContext, useEffect, useState, useContext } from "react";
import * as fcl from "@onflow/fcl";

export const DataContext = createContext(null);

export const DataProvider = ({children}) => {
    const [userWallet, setUserWallet] = useState(null);

    useEffect(() => {
        // Connect with Blocto using FCL
        fcl.authenticate().then((user) => {
        if (user.cid) {
            setUserWallet(user);
        }
        });
    }, []);

    return (
        <DataContext.Provider value={{ userWallet, setUserWallet }}>
            {children}
        </DataContext.Provider>
    );
}
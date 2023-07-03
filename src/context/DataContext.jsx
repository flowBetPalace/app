'use client';

import { createContext, useEffect, useState, useContext } from "react";
import * as fcl from "@onflow/fcl";
import "../../flow/config";

export const DataContext = createContext(null);

export const DataProvider = ({children}) => {
    // const [userWallet, setUserWallet] = useState(null);
    const [user, setUser] = useState({loggedIn: null})
    const [categories, setCategories] = useState(["soccer", "nfl", "basketball", "mma", "formula1", "motogp"]);

    // useEffect(() => {
    //     // Connect with Blocto using FCL
    //     fcl.authenticate().then((user) => {
    //     if (user.cid) {
    //         setUserWallet(user);
    //     }
    //     });
    // }, []);

    return (
        <DataContext.Provider value={{ user, setUser, categories, setCategories }}>
            {children}
        </DataContext.Provider>
    );
}
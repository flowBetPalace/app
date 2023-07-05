'use client';

import { createContext, useEffect, useState, useContext } from "react";
import * as fcl from "@onflow/fcl";
import "../../flow/config";

export const DataContext = createContext(null);

export const DataProvider = ({children}) => {
    // const [userWallet, setUserWallet] = useState(null);
    const [user, setUser] = useState({loggedIn: null})
    const [categories, setCategories] = useState(["soccer", "nfl", "basketball", "mma", "formula1", "motogp"]);

    const [PopUpActive, setPopUpActive] = useState(false);
    const [PopUpStatus, setPopUpStatus] = useState('loading');
    const [PopUpMessage, setPopUpMessage] = useState('message');
    const [PopUpCloseable, setPopUpCloseable] = useState(false);

    const [BetModalActive, setBetModalActive] = useState(false);
    const [BetModalStatus, setBetModalStatus] = useState('');
    const [BetModalMessage, setBetModalMessage] = useState('message');
    const [BetModalCloseable, setBetModalCloseable] = useState(true);

    // useEffect(() => {
    //     // Connect with Blocto using FCL
    //     fcl.authenticate().then((user) => {
    //     if (user.cid) {
    //         setUserWallet(user);
    //     }
    //     });
    // }, []);

    return (
        <DataContext.Provider value={{ user, setUser, categories, setCategories, PopUpActive, setPopUpActive, PopUpStatus, setPopUpStatus, PopUpMessage, setPopUpMessage, PopUpCloseable, setPopUpCloseable, BetModalActive, setBetModalActive, BetModalStatus, setBetModalStatus, BetModalMessage, setBetModalMessage, BetModalCloseable, setBetModalCloseable}}>
            {children}
        </DataContext.Provider>
    );
}
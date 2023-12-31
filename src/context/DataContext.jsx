'use client';

import { createContext, useEffect, useState, useContext } from "react";
import * as fcl from "@onflow/fcl";
import "../../flow/config";

export const DataContext = createContext(null);

export const DataProvider = ({children}) => {
    // const [userWallet, setUserWallet] = useState(null);
    const [user, setUser] = useState({loggedIn: null})
    const [balance, setBalance] = useState(null);

    const [categories, setCategories] = useState(["soccer", "nfl", "basketball", "mma", "formula1", "motogp"]);

    const [PopUpActive, setPopUpActive] = useState(false);
    const [PopUpStatus, setPopUpStatus] = useState('loading');
    const [PopUpMessage, setPopUpMessage] = useState('message');
    const [PopUpCloseable, setPopUpCloseable] = useState(false);

    const [BetModalActive, setBetModalActive] = useState(false);
    const [BetModalStatus, setBetModalStatus] = useState('');
    const [BetModalMessage, setBetModalMessage] = useState('message');
    const [BetModalCloseable, setBetModalCloseable] = useState(true);

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleOpenNavbar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    }
    const closeNavbar = () => {
        setIsNavbarOpen(false);
    }

    // useEffect(() => {
    //     // Connect with Blocto using FCL
    //     fcl.authenticate().then((user) => {
    //     if (user.cid) {
    //         setUserWallet(user);
    //     }
    //     });
    // }, []);

    return (
        <DataContext.Provider value={{ user, setUser, balance, setBalance, categories, setCategories, PopUpActive, setPopUpActive, PopUpStatus, setPopUpStatus, PopUpMessage, setPopUpMessage, PopUpCloseable, setPopUpCloseable, BetModalActive, setBetModalActive, BetModalStatus, setBetModalStatus, BetModalMessage, setBetModalMessage, BetModalCloseable, setBetModalCloseable, isNavbarOpen, setIsNavbarOpen, toggleOpenNavbar, closeNavbar}}>
            {children}
        </DataContext.Provider>
    );
}
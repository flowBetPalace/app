'use client';

import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Navbar.module.css'

import * as fcl from "@onflow/fcl";
import { FlowApp, getAccountBalance } from '@onflow/fcl';

export default function Navbar() {

    // const [balance, setBalance] = useState(null);
    
    const formatAddress = (address) => {
        if (address?.length === 18) {
          return address.substring(0, 3) + "..." + address.substring(16);
        } else {
          return address;
        }
    }

    const { user, setUser, balance, setBalance } = useContext(DataContext);

    useEffect(() => fcl.currentUser.subscribe(setUser), [])
    console.log(user)
    console.log('hola')

    const AuthedState = () => {
        return (
          <div className={styles.connectBtn}>
            <button>
                {(formatAddress(user?.addr))}
                <Image
                    src="/icons/chevron.svg"
                    alt="Chevron icon"
                    width={20}
                    height={20}
                />
            </button>
            <div className={styles.dropdown}>
                <Link href="#" onClick={fcl.unauthenticate} className={styles.dropdownLink}>
                <Image
                src="/icons/logout.svg"
                alt="Logout icon"
                width={30}
                height={30}
                />
                Log out
                </Link>
            </div>
            {/* <button onClick={fcl.unauthenticate}>Log Out</button> */}
          </div>
        )
      }

      const UnauthenticatedState = () => {
        return (
          <div className={styles.connectBtn}>
            <button onClick={fcl.logIn}>Log In</button>
            {/* <button onClick={fcl.signUp}>Sign Up</button> */}
          </div>
        )
      }

    //   

      
    //   const getFlowBalancee = async (address) => {
    //     if(address == null){
    //         return(
    //             'Try again'
    //         )
    //     } else {
    //         return fcl.account(address).then(d => {
    //                 console.log(d.balance)
    //        })
    //     }
    //   }

    const getFlowBalance = async (address) => {
        if (address) {
            const account = await fcl.account(address);
            setBalance((parseInt(account.balance) / 100000000).toFixed(2));
            return account.balance;
        }
        return 'Try again';
      };
    
    useEffect(() => {
        getFlowBalance(user?.addr);
      }, [user])

    //   Three decimals
    //   const formattedBalance = balance ? (parseInt(balance) / 1000000000).toLocaleString() : '';
    // No decimals
    // const formattedBalance = balance ? (parseInt(balance) / 100000000).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '';
    // Two decimals
    // const formattedBalance = balance ? (parseInt(balance) / 100000000).toFixed(2) : '';



    return(
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer + ' container'}>
                <div className={styles.content}>
                    <div className={styles.logo}>
                        <Link href="/" className={styles.logoImg}>
                            <Image
                                src='/imgs/flowbetpalace-logo.svg'
                                alt='FlowBetPalace logo'
                                width={180}
                                height={37}
                                priority 
                            />
                        </Link>
                    </div>
                    <div className={styles.center}>
                        <ul>
                            <li>
                                <Link href="/sports" className={styles.navLink}>
                                    Sports
                                </Link>
                            </li>
                            <li>
                                <Link href="/mybets" className={styles.navLink}>
                                    My bets
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.right}>
                        {user.loggedIn ? <AuthedState />
                        : <UnauthenticatedState />
                        }
                        {/* <div className={styles.connectBtn}>
                            <button>
                                Log in
                            </button>
                        </div> */}
                        <button onClick={()=>(getFlowBalance(user?.addr))}>Fetch flow balance</button>
                        
                        {(user?.addr === null) ? (
                            <></>
                        ):(
                            <div>{balance}</div>
                        )
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}
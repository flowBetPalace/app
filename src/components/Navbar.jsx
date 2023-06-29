'use client';

import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/assets/styles/Navbar.module.css'

export default function Navbar() {
    return(
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer + 'container'}>
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
                    <div className={styles.center + ' navlinks'}>
                        <ul className={styles.links}>
                            <li>
                                <Link href="/sports" className={styles.navLink}>
                                    Sports
                                </Link>
                            </li>
                            <li>
                                <Link href="/events" className={styles.navLink}>
                                    Events
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.connectBtn}>
                            <button>
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
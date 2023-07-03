// import { useContext, useEffect, useState } from "react";
// import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import Link from 'next/link'
// import style from './Match.module.css'
import style from '@/assets/styles/Match.module.css'

import matchesData from "@/matches.json";

export default function Match({ nameA, nameB, scoreA, scoreB, startDate, bets, liquidity, matchHref, matchContractAddress }) {
    return(
        <div className={style.match}>
            <div className='container'>
                <div className='row'>
                    <div className='col-6'>
                        <div className={style.names}>
                            <div className={style.nameAContainer}>
                                <p className={style.nameA}>
                                    {nameA}
                                </p>
                                <p className={style.nameAScore}>
                                    {scoreA}
                                </p>
                            </div>
                            <div className={style.nameBContainer}>
                                <p className={style.nameB}>
                                    {nameB}
                                </p>
                                <p className={style.nameBScore}>
                                    {scoreB}
                                </p>
                            </div>
                        </div> 
                        <div className={style.statusAndInfo}>
                            <div className={style.status}>
                                <div className={style.statusLive}>
                                    <Image 
                                        src="/icons/circle.svg"
                                        alt="Live icon"
                                        width={8}
                                        height={8}
                                    />
                                    <p className={style.statusLiveSquare}> 
                                    {startDate}
                                    </p>
                                </div>
                                <p className={style.statusTimeLeft}>
                                    Ends in 31 min
                                </p>
                            </div>
                            <p className={style.info}>
                                <span className='mx-3'>|</span> Liquidity: <span className={style.infoGreen}>{liquidity} USDT</span>
                            </p>
                        </div>
                    </div>
                    <div className={style.secondCol + ' col-6'}>
                        <Link href={matchHref + '/' + matchContractAddress} className={style.viewMatch}>View match</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
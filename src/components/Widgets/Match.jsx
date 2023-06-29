// import { useContext, useEffect, useState } from "react";
// import { DataContext } from "@/context/DataContext";
import Image from 'next/image'
import Link from 'next/link'
import style from './Match.module.css'

export default function Match({ nameA, nameB, scoreA, scoreB, startDate, bets, liquidity }) {
    return(
        <div className={style.match}>
            <div className='container'>
                <div className='row'>
                    <div className='col-6'>
                        <h1>
                            {nameA} ({scoreA}) vs {nameB} ({scoreB})
                        </h1>
                        <p>
                            {startDate}
                        </p>
                        <br />
                        <p>
                            Total bets: {bets} <span className='mx-3'>|</span> Liquidity: {liquidity} USDT
                        </p>
                    </div>
                    <div className='col-6'>

                    </div>
                </div>
            </div>
        </div>
    )
}
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '@/context/DataContext'
import styleGlobal from '@/assets/styles/Global.module.css'
import styleMatch from '@/assets/styles/Match.module.css'
import Head from 'next/head'
import Link from 'next/link'

export default function Match() {
    const [nameA, nameB, scoreA, scoreB, startDate, bets, liquidity, matchContractAddress, setNameA, setNameB, setScoreA, setScoreB, setStartDate, setBets, setLiquidity, setMatchContractAddress] = useState('');
    const displayBets = function(bets) {
        try {
            return bets.map((bet) => (
                <div className={styleMatch.bet}>
                    <h2>{bet[0]}</h2>
                    {bet[1].map((subBet) => (
                        <Link href='#' className={styleMatch.subBet}>
                            {subBet}
                        </Link>
                    ))}
                </div>
            ));
        } catch (error) {
            // Handle the error here
            console.log(error);
            // You can also display an error message or fallback content
            return <div>Error: {error.message}</div>
        }
    }
    
    return (
        <>
            <Head>
                <title>FlowBetPalace - Match</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="Thetatix web app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styleMatch.main}>
                <section className='container'>
                    <div className='content'>
                        <h1>
                            {nameA} <span className={styleMatch.score}>{scoreA}</span> vs. {nameB} <span className={styleMatch.score}>{scoreB}</span>
                        </h1>
                        <p className={styleMatch.date}>
                            {startDate}
                        </p>
                        {displayBets(bets)}
                    </div>
                </section>
            </main>
        </>

    )
}
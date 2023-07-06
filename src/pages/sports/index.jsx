import Head from 'next/head'
import * as fcl from "@onflow/fcl";
import styleGlobal from '@/assets/styles/Global.module.css'
import styleSports from '@/assets/styles/StyleSports.module.css'
import Link from 'next/link'
import { useRouter } from "next/router";

import { useContext, useState, useEffect } from 'react'

import { DataContext } from '@/context/DataContext'

import MatchComponent from '@/components/Widgets/MatchComponent';

export default function Sports() {

    const router = useRouter();

    const [currentItem, setCurrentItem] = useState("soccer");
    const [cachedContent, setCachedContent] = useState({});
    const { categories, setCategories } = useContext(DataContext);
    const [ bets, setBets ] = useState([]);
    const handleTabClick = (item) => {
        setCurrentItem(item);
    };

    // const tabs = [
    //     {id: 'soccer', label: '⚽ Soccer', content: 'Soccer content'},
    //     {id: 'nfl', label: '🏉 Football', content: 'Football content'},
    //     {id: 'basket', label: '🏀 Basketball', content: 'Basketball content'},
    //     {id: 'mma', label: '🥊 MMA(UFC)', content: 'MMA content'},
    //     {id: 'formula1', label: '🏎️ Formula 1', content: 'Formula 1 content'},
    //     {id: 'motogp', label: '🏍️ Moto Gp', content: 'Moto Gp content'},
    // ];
    const tabs = [
        { id: 'soccer', label: '⚽ Soccer', subcategory: 'soccer' },
        { id: 'nfl', label: '🏉 Football', subcategory: 'nfl' },
        { id: 'basket', label: '🏀 Basketball', subcategory: 'basket' },
        { id: 'mma', label: '🥊 MMA(UFC)', subcategory: 'mma' },
        { id: 'formula1', label: '🏎️ Formula 1', subcategory: 'formula1' },
        { id: 'motogp', label: '🏍️ Moto Gp', subcategory: 'motogp' },
      ];


    async function getBets() {
        const response = await fcl.query({
            cadence: `
                import FlowBetPalace from 0x48214e37c07e015b

                // This script gets recent added bets
                
                pub fun main(category: String,skip: Int) :[[String]]{
                    let amountReturnedBets = 5
                    // Get the accounts' public account objects
                    let acct1 = getAccount(0x48214e37c07e015b)
                
                    // Get references to the account's receivers
                    // by getting their public capability
                    // and borrowing a reference from the capability
                    let scriptRef = acct1.getCapability(FlowBetPalace.scriptPublicPath)
                                        .borrow<&FlowBetPalace.Script>()
                                        ?? panic("Could not borrow acct1 vault reference")
                
                    let bets = scriptRef.getCategoryBets(category: category,amount: amountReturnedBets,skip: skip)
                    log("bets")
                    log(bets)
                    return bets
                }
            
            `,
            args: (arg, t) => [
                arg(currentItem, t.String),
                arg("0", t.Int)
            ]
        },)
        setBets(response)
    }
    console.log(bets)

    const labeledData = bets.map((data) => ({
        id: data[0],
        match: data[1],
        matchType: data[2],
        category: data[3],
        subcategory: data[4],
    }));

    useEffect(() => {
        try{
            getBets()
        }catch(err){
            console.log(err)
        }



    }, [currentItem])


    return (
        <>
            <Head>
                <title>FlowBetPalace - Sports</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="Thetatix web app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styleGlobal.main}>
                <header className={styleSports.header}>
                    <div className={styleSports.headerContainer + ' container'}>
                        <div className={styleSports.content + ' row'}>
                            <div className='col-12'>
                                <h1>Sports</h1>
                            </div>
                        </div>
                    </div>
                </header>
                
                <section className={styleSports.tabSection}>
                    <div className={styleGlobal.sectionContainer + ' container'}>
                        {/* Tabbed navigation */}
                        <div className={styleSports.tabContainer}>
                            {tabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    className={`${styleSports.tabItem} ${currentItem === tab.id ? styleSports.active : ''}`}
                                    onClick={() => handleTabClick(tab.id)}
                                >
                                    {tab.label}
                                </div>
                            ))}
                        </div>  
                        {/* <button onClick={() => console.log(labeledData)}>labeled data</button> */}
                        <br />
                        
                        {/* Tab content */}
                        <div className={styleSports.tabContent}>
                            {labeledData.map((data) =>(
                                <MatchComponent
                                
                                subcategory={data.subcategory}
                                category={data.category}
                                id={data.id}
                                match={data.match}
                                matchType={data.matchType}
                                />
                            ))}



                            {labeledData.map((data) => {
                                if (currentItem === data.subcategory) {
                                return (
                                    <div>
                                        <div key={data.subcategory}>{data.subcategory}</div>
                                        <div key={data.category}>{data.category}</div>
                                        <div key={data.id}>{data.id}</div>
                                        <div key={data.match}>{data.match}</div>
                                        <div key={data.matchType}>{data.matchType}</div>
                                    </div>
                                );
                                }
                                return null;
                            })}
                        </div>

                        {/* OLD ONE */}
                        {/* <div className={styleSports.tabContainer}>
                            <div
                                className={currentItem === "soccer" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("soccer")}
                            >
                                ⚽ Soccer
                            </div>
                            <div
                                className={currentItem === "nfl" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("nfl")}
                            >
                                🏉 Football
                            </div>
                            <div
                                className={currentItem === "basket" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("basket")}
                            >
                                🏀 Basketball
                            </div>
                            <div
                                className={currentItem === "mma" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("mma")}
                            >
                                🥊 MMA(UFC)
                            </div>
                            <div
                                className={currentItem === "formula1" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("formula1")}
                            >
                                🏎️ Formula 1
                            </div>
                            <div
                                className={currentItem === "motogp" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("motogp")}
                            >
                                🏍️ Moto Gp
                            </div>
                        </div> */}

                        {/* TESTING */}
                        {/* Render the content based on the selected tab */}
                        {/* {currentItem === "soccer" && <div className={styleSports.tabContent}> */}
                            {/* <div>
                                {bets.map((data, index) =>(
                                    <div key={index}>
                                        <p>{data[0]}</p>
                                        <p>{data[1]}</p>
                                        <p>{data[2]}</p>
                                        <p>{data[3]}</p>
                                        <p>{data[4]}</p>
                                    </div>

                                ))}

                                <br />
                                {labeledData.map((item, index) => (
                                    <div key={index}>
                                    <p>ID: {item.id}</p>
                                    <p>Match: {item.match}</p>
                                    <p>Match Type: {item.matchType}</p>
                                    <p>Category: {item.category}</p>
                                    <p>Subcategory: {item.subcategory}</p>
                                    <br />
                                    </div>
                                ))}
                                <button onClick={()=>console.log(labeledData)}>labeled</button>
                            </div> */}
                        {/* </div>} */}
                    </div>
                </section>

            </main>
        </>

    )
}
import Head from 'next/head'

import styleGlobal from '@/assets/styles/Global.module.css'
import styleSports from '@/assets/styles/StyleSports.module.css'
import Link from 'next/link'

import { useContext, useState } from 'react'

import { DataContext } from '@/context/DataContext'

export default function Sports(){

    const [currentItem, setCurrentItem] = useState("soccer");
    const { categories, setCategories } = useContext(DataContext);

    const handleTabClick = (item) => {
        setCurrentItem(item);
    };


    return(
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
                {/* Tabbed navigation */}
                <section className={styleSports.tabSection}>
                    <div className={styleGlobal.sectionContainer + ' container'}>
                        <div className={styleSports.tabContainer}>
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
                                className={currentItem === "basketball" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("basketball")}
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
                            </div>

                            {/* Render the content based on the selected tab */}
                            {currentItem === "soccer" && <div className={styleSports.tabContent}>Soccer Content</div>}
                            {currentItem === "basketball" && <div className={styleSports.tabContent}>Basketball Content</div>}
                            {currentItem === "mma" && <div className={styleSports.tabContent}>mma Content</div>}
                            {currentItem === "box" && <div className={styleSports.tabContent}>Boxing Content</div>}
                            {currentItem === "formula1" && <div className={styleSports.tabContent}>Formula 1 Content</div>}
                            {currentItem === "motogp" && <div className={styleSports.tabContent}>Moto Gp Content</div>}
                            {currentItem === "nfl" && <div className={styleSports.tabContent}>NFL American Football Content</div>}



                    
                    </div>
                </section>

            </main>
        </>
        
    )
}
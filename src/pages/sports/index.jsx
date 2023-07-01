import Head from 'next/head'

import styleGlobal from '@/assets/styles/Global.module.css'
import styleSports from '@/assets/styles/StyleSports.module.css'
import Link from 'next/link'

import { useState } from 'react'

export default function Sports(){

    const [currentItem, setCurrentItem] = useState("soccer");

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
                                className={currentItem === "basketball" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("basketball")}
                            >
                                🏀 Basketball
                            </div>
                            <div
                                className={currentItem === "tennis" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("tennis")}
                            >
                                🎾 Tennis
                            </div>
                            <div
                                className={currentItem === "box" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("box")}
                            >
                                🥊 Box
                            </div>
                            <div
                                className={currentItem === "formula1" ? `${styleSports.tabItem} ${styleSports.active}` : styleSports.tabItem}
                                onClick={() => handleTabClick("formula1")}
                            >
                                🏎️ Formula 1
                            </div>
                            </div>

                            {/* Render the content based on the selected tab */}
                            {currentItem === "soccer" && <div className={styleSports.tabContent}>Soccer Content</div>}
                            {currentItem === "basketball" && <div className={styleSports.tabContent}>Basketball Content</div>}
                            {currentItem === "tennis" && <div className={styleSports.tabContent}>Tennis Content</div>}
                            {currentItem === "box" && <div className={styleSports.tabContent}>Boxing Content</div>}
                            {currentItem === "formula1" && <div className={styleSports.tabContent}>Formula 1 Content</div>}

                    
                    </div>
                </section>

            </main>
        </>
        
    )
}
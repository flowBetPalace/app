import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Image from 'next/image'
import Link from 'next/link'

import style from '@/assets/styles/StyleBet.module.css'

export default function NFTs({matchId, category}) {
    const [matchNFTs, setMatchNFTs] = useState([]);
    // const [matchCollection, setMatchCollection] = useState([]);

    const getMetadata = async function (matchId) {
        await fetch('../../nfts.json')
            .then((response) => response.json())
            .then((data) => {
                const nfts = data.nfts;
                const filteredNFTs = nfts.filter((nft) => nft.matchUuid === matchId);
                setMatchNFTs(filteredNFTs);
            })
            .catch((error) => {
                console.error('Error fetching NFT data:', error);
            });
    };

    useEffect(() => {
        getMetadata(matchId);
    }, [matchId]);
    return (
        <div className="col-5">
            <div className={style.nftContainer}>
                <h3 className={style.matchMomentsText}>Featured NFTs</h3>
                <div>
                    {/* <Image
                        src={'/imgs/' + category + '.svg'}
                        alt="Top shot logo"
                        width={100}
                        height={30}
                        className={style.topshotLogo}
                    /> */}
                    <Image
                        src="/imgs/top-shot-logo.svg"
                        alt="Top shot logo"
                        width={100}
                        height={30}
                        className={style.topshotLogo}
                    />
                    <div className="row mb-3">
                        {matchNFTs.map((NFT) => (
                            <div className="col-6" key={NFT._id}>
                                <div className={style.imgContainer}>
                                    <Image
                                        src={NFT.image}
                                        alt='NFT image'
                                        width={720}
                                        height={720}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* <video loop autoplay playsinline preload='auto' height={150} width={150}>
                    <source src='https://assets.nbatopshot.com/editions/5_2023_nba_playoffs_common/23770903-57de-49a9-b69c-86b9273d3b81/play_23770903-57de-49a9-b69c-86b9273d3b81_5_2023_nba_playoffs_common_capture_Animated_1080_1920_Black.mp4' />
                </video> */}
            </div>
        </div>
    )
}

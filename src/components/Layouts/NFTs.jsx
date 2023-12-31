import React, { useEffect, useState } from 'react';

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

    if (matchNFTs.length === 0) {
        return null;
    }

    return (
        <div className="col-12 col-md-5">
            <div className={style.nftContainer}>
                <h3 className={style.matchMomentsText}>Featured NFTs</h3>
                <div>
                    <Image
                        src={'/imgs/' + category + '.svg'}
                        alt="NFTs logo"
                        width={150}
                        height={30}
                        className={style.topshotLogo}
                    />
                    {/* <Image
                        src="/imgs/top-shot-logo.svg"
                        alt="Top shot logo"
                        width={100}
                        height={30}
                        className={style.topshotLogo}
                    /> */}
                    <div className="row mb-3">
                        {matchNFTs.map((NFT) => (
                            <div className="col-6" key={NFT._id}>
                                <div className={style.imgContainer}>
                                    <div className={style.darken}></div>
                                    <div className={style.imgOverlay}>
                                        <h4>{NFT.title}</h4>
                                        <Link href={NFT.url} target='_blank' className={style.overlayBtn}>
                                            View more
                                        </Link>
                                    </div>
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Image from 'next/image'
import Link from 'next/link'

export default function NBA() {
    const [nfts, setNFTs] = useState([]);

    const getNBAAsset = function (momentFlowID, mediaType) {
        const url = `https://assets.nbatopshot.com/media/${momentFlowID}/${mediaType}`;
        return url;
        try {
            const response = axios.get(url);
            // Handle the response data as needed
            console.log(response.data);
            return response.data;
        } catch (error) {
            // Handle any errors that occur during the API request
            console.error('Error:', error);
            throw error;
        }
    };

    // useEffect(() => {
    //     axios.get('https://api.nbatopshot.com/endpoint')
    //         .then(response => {
    //             // Process the response data and extract the NFTs
    //             const nfts = response.data.nfts;
    //             setNFTs(nfts);
    //         })
    //         .catch(error => {
    //             // Handle any errors that occur during the API request
    //             console.error('Error:', error);
    //         });
    // }, []);
    return(
        <div>
            <div className='container'>
                <h1>NFTs</h1>
                <ul>
                    {/* {nfts.map(nft => (
                        <li key={nft.id}>{nft.name}</li>
                    ))} */}
                </ul>
                <Image
                    src={getNBAAsset('1337', 'image')}
                    alt='as'
                    width={1000}
                    height={1000}
                />
            </div>
        </div>
    )
}

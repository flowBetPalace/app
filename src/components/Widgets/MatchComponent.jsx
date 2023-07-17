import { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";

import Image from 'next/image'
import Link from 'next/link'
import Timer from './Timer';

import style from '@/assets/styles/Match.module.css'

export default function MatchComponent({ subcategory, category, id, match, matchType }) {

    const [ loadingBetData, setLoadingBetData] = useState(true);
    const [ startDate, setStartDate ] = useState(null);
    const [ endDate, setEndDate ] = useState(null);

    function formatDateTime(dateValue){
        const unixTimestamp = parseInt(dateValue);
        const date = new Date(unixTimestamp * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        //console.log(formattedDate);
        return formattedDate;
    }

    async function getBetData(BetUuid) {
        if(BetUuid==undefined || loadingBetData == false){
            return
        }
        
        const response = await fcl.query({
            cadence: `
                import FlowBetPalace from 0xd19f554fdb83f838

                pub fun main(uuid:String) :FlowBetPalace.BetDataStruct{
                    // Get the accounts' public account objects
                    let acct1 = getAccount(0xd19f554fdb83f838)
                    //get bet path
                    let betPath = PublicPath(identifier: "bet".concat(uuid))!
                    // Get references to the account's receivers
                    // by getting their public capability
                    // and borrowing a reference from the capability
                    let betRef = acct1.getCapability(betPath)
                                          .borrow<&AnyResource{FlowBetPalace.BetPublicInterface}>()
                                          ?? panic("Could not borrow acct1 vault reference")
                
                    let betData = betRef.getBetData()
                    return betData
                }
            `,
            args: (arg, t) => [
                arg(BetUuid, t.String),
            ]
        },)
        setStartDate(parseInt(response.startDate));
        setEndDate(parseInt(response.endDate));
        setLoadingBetData(false)

    }
    useEffect(() => {
        try{
            getBetData(id);
        }catch(err){
            console.log('err',err)
        }
    },[id])

    return (
        <div className={style.match}>
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <div className={style.names}>
                            <div className={style.nameAContainer}>
                                <p className={style.nameA}>
                                    {match}
                                </p>
                                <div className={style.scores}>
                                    <p className={style.nameAScore}>?</p>
                                    <p className={style.nameBScore}>?</p>
                                </div>
                            </div>
                            <p className={style.category}>{matchType}</p>
                            <Timer
                                rawStartDate={formatDateTime(startDate)}
                                rawEndDate={formatDateTime(endDate)}
                                goToBets={false}
                            />
                            {/* <div className={style.nameBContainer}>
                                <p className={style.nameB}>
                                    {match}
                                </p>
                                <p className={style.nameBScore}>
                                    {match}
                                </p>
                            </div> */}
                        </div>
                        {/* <div className={style.statusAndInfo}>
                            <div className={style.status}>
                                <div className={style.statusLive}>
                                    <Image 
                                        src="/icons/circle.svg"
                                        alt="Live icon"
                                        width={8}
                                        height={8}
                                    />
                                    <p className={style.statusLiveSquare}> 
                                        Live
                                    </p>
                                </div>
                                <p className={style.statusTimeLeft}>
                                    Ends in 31 min
                                </p>
                            </div>
                        </div> */}
                    </div>
                    <div className={style.secondCol + ' col-6'}>
                        <Link href={'/sports/bet/' + id} className={style.viewMatch}>View match</Link>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
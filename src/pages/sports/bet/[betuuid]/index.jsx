import * as fcl from "@onflow/fcl";

import { useContext, useState, useEffect } from 'react'
import { useRouter } from "next/router";
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import { DataContext } from '@/context/DataContext'

import PopUp from "@/components/Widgets/PopUp";
import BetModal from '@/components/Widgets/BetModal';
import ChildBet from '@/components/Widgets/ChildBet';

import styleGlobal from '@/assets/styles/Global.module.css'
import styleSports from '@/assets/styles/StyleSports.module.css'
import styleBet from '@/assets/styles/StyleBet.module.css'

export default function Sports() {
    const router = useRouter();
    const BetUuid = router.query.betuuid;
    const [ betData, setBetData ] = useState([]);
    const [ loadingBetData, setLoadingBetData] = useState(true);
    const [ childBetsData, setChildBetsData ] = useState([]);
    const [ loadingChildBets, setLoadingChildBets] = useState(true);
    const timeDifference = gettimeDifference(formatStartDate(betData), formatEndDate(betData));
    // const timeDifference = gettimeDifference('6/7/2023 11:0:0', '6/7/2023 14:0:0');

    const { setBetModalActive, setBetModalStatus, setBetModalMessage, setBetModalCloseable, setPopUpActive, setPopUpStatus, setPopUpMessage, setPopUpCloseable } = useContext(DataContext);

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
    function formatEndDate(betData) {
        const endDate = betData.endDate;
        return formatDateTime(endDate);
    }
    function formatStartDate(betData) {
        const startDate = betData.startDate;
        return formatDateTime(startDate);
    }

    function parseFormattedDate(formattedDate) {
        const [datePart, timePart] = formattedDate.split(" ");
        const [day, month, year] = datePart.split("/");
        const [hours, minutes, seconds] = timePart.split(":");
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    

    function gettimeDifference(startDatee, endDatee) {
        const startDate = parseFormattedDate(startDatee);
        const endDate = parseFormattedDate(endDatee);
        const currentDate = new Date();

        if (currentDate > endDate ) {
            return "Event ended";
        }
        else if (currentDate >= startDate && currentDate <= endDate) {
            const timeDifference = endDate - currentDate;
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            return `Event is live. Remaining time: ${days} days ${hours} hours ${minutes} minutes`;
        }

        const timeDifference = startDate - currentDate;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        return `Starting in ${days} days ${hours} hours ${minutes} minutes`;
    }





    async function getBetData() {
        if(BetUuid==undefined || loadingBetData == false){
            return
        }
        
        const response = await fcl.query({
            cadence: `
                import FlowBetPalace from 0x48214e37c07e015b

                pub fun main(uuid:String) :FlowBetPalace.BetDataStruct{
                    // Get the accounts' public account objects
                    let acct1 = getAccount(0x48214e37c07e015b)
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
            // cadence: `
            //     import FlowBetPalace from 0x48214e37c07e015b

            //     pub struct BetDataStruct {
            //         pub let name: String
            //         pub let description: String
            //         pub let imageLink: String
            //         pub let category: String
            //         pub let startDate: UFix64
            //         pub let stopAcceptingBetsDate: UFix64
            //         pub let endDate: UFix64
            
            //         init(name: String,startDate: UFix64,endDate: UFix64,stopAcceptingBetsDate: UFix64,description: String,imageLink:String,category: String){
            //             self.name = name
            //             self.startDate = startDate
            //             self.stopAcceptingBetsDate = stopAcceptingBetsDate
            //             self.endDate = endDate
            //             self.description = description
            //             self.imageLink = imageLink
            //             self.category = category
            //         }
            //     }

            //     pub fun main(uuid:String) :BetDataStruct{
            //         // Get the accounts' public account objects
            //         let acct1 = getAccount(0x48214e37c07e015b)
            //         //get bet path
            //         let betPath = PublicPath(identifier: "bet".concat(uuid))!
            //         // Get references to the account's receivers
            //         // by getting their public capability
            //         // and borrowing a reference from the capability
            //         let betRef = acct1.getCapability(betPath)
            //                               .borrow<&AnyResource{FlowBetPalace.BetPublicInterface}>()
            //                               ?? panic("Could not borrow acct1 vault reference".concat(betPath.toString()))
                
            //         let betData = betRef.getBetData()
            //         return BetDataStruct(
            //             name:betData.name,
            //             startDate:betData.startDate,
            //             endDate:betData.endDate,
            //             stopAcceptingBetsDate:betData.stopAcceptingBetsDate,
            //             description:betData.description,
            //             imageLink:betData.imageLink,
            //             category:betData.category
            //         )
            //     }
                
            
            // `,
            args: (arg, t) => [
                arg(BetUuid, t.String),
            ]
        },)
        console.log('bets response',response)
        console.log(BetUuid)
        setBetData(response)
        setLoadingBetData(false)

    }

    async function getChildBets(){
        if(BetUuid==undefined || loadingChildBets == false){
            return
        }
        
        const response = await fcl.query({
            cadence: `
                import FlowBetPalace from 0x48214e37c07e015b

                pub fun main(uuid:String) :[FlowBetPalace.ChildBetStruct]{
                    // Get the accounts' public account objects
                    let acct1 = getAccount(0x48214e37c07e015b)
                    //get bet path
                    let betPath = PublicPath(identifier: "bet".concat(uuid))!
                    // Get references to the account's receivers
                    // by getting their public capability
                    // and borrowing a reference from the capability
                    let betRef = acct1.getCapability(betPath)
                                          .borrow<&AnyResource{FlowBetPalace.BetPublicInterface}>()
                                          ?? panic("Could not borrow acct1 vault reference")
                
                    let betChildsUuid = betRef.getBetChilds()
                    let betChildsData:[FlowBetPalace.ChildBetStruct] = []
                    for element in betChildsUuid {
                        let path = PublicPath(identifier: "betchild".concat(element))!
                        let betChildRef = acct1.getCapability(path)
                                          .borrow<&AnyResource{FlowBetPalace.ChildBetPublicInterface }>()
                                          ?? panic("Could not borrow acct1 vault reference")
                        let data = betChildRef.getData()
                        betChildsData.append(data)
                    }
                    return betChildsData
                }
                
            
            `,
            args: (arg, t) => [
                arg(BetUuid, t.String),
            ]
        },)
        console.log('child bets response',response)
        setChildBetsData(response)
        setLoadingChildBets(false)
    }
    useEffect(() => {
        try{
            getBetData()
            getChildBets()
        }catch(err){
            console.log('err',err)
        }



    },[BetUuid])

    const renderedChildBets = childBetsData.map(childBet=>
        <ChildBet 
            key={childBet.uuid}
            uuid={childBet.uuid}
            matchTitle={betData.name}
            name={childBet.name}
            options={childBet.options}
            winnerOptionsIndex={childBet.winnerOptionsIndex}
            odds={childBet.odds}
            startDate={childBet.startDate}
            stopAcceptingBetsDate={childBet.stopAcceptingBetsDate}
            endDate={childBet.endDate}
        />
    )

    return <>
        <BetModal />
        <PopUp />
        <div className={styleBet.betSection}>
            <div className="container">
                {/* .category, .description, .endDate, imageLink, name, startDate, stopAcceptingBetsDate */}
                <div className='d-flex justify-content-between'>
                    <div className={styleBet.betTitle}>
                        <p className={styleBet.name}>{betData.name}</p>
                        {/* <p>End date: {formatEndDate(betData)}</p>
                        <p>Start date: {formatStartDate(betData)}</p> */}
                        <p className={styleBet.status}>{timeDifference}</p>
                    </div>
                    {/* <button href="#" className={styleGlobal.btnTypeTwo}>
                        Claim reward
                    </button> */}
                </div>
                <div>
                    {/* {childBetsData[0].name} */}
                    {renderedChildBets}
                </div>
                
                
                
                
                
            </div>   
        </div>

    </>
}
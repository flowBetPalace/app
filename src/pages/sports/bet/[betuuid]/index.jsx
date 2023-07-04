import Head from 'next/head'
import * as fcl from "@onflow/fcl";
import styleGlobal from '@/assets/styles/Global.module.css'
import styleSports from '@/assets/styles/StyleSports.module.css'
import styleBet from '@/assets/styles/StyleBet.module.css'
import Link from 'next/link'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '@/context/DataContext'
import { useRouter } from "next/router";

export default function Sports() {
    const router = useRouter();
    const BetUuid = router.query.betuuid;
    const [ betData, setBetData ] = useState([]);
    const [ loadingBetData, setLoadingBetData] = useState(true);
    const [ childBetsData, setChildBetsData ] = useState([]);
    const [ loadingChildBets, setLoadingChildBets] = useState(true);

    function formatDate (betData) {
        const endDate = betData.endDate;
        console.log(endDate);

        const unixTimestamp = parseInt(endDate); // Convert the string to a number

        const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

        // Use the Date object methods to extract the desired date components
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // Create a formatted date string
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

        // Use the formattedDate in your app
        console.log(formattedDate);

        return formattedDate;

    }



    async function getBetData() {
        if(BetUuid==undefined || loadingBetData == false){
            return
        }
        
        const response = await fcl.query({
            cadence: `
                import FlowBetPalace from 0x036703c904a81123

                pub fun main(uuid:String) :FlowBetPalace.BetDataStruct{
                    // Get the accounts' public account objects
                    let acct1 = getAccount(0x036703c904a81123)
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
            //     import FlowBetPalace from 0x036703c904a81123

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
            //         let acct1 = getAccount(0x036703c904a81123)
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
                import FlowBetPalace from 0x036703c904a81123

                pub fun main(uuid:String) :[FlowBetPalace.ChildBetStruct]{
                    // Get the accounts' public account objects
                    let acct1 = getAccount(0x036703c904a81123)
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
    return (
        <div className={styleBet.betSection}>
            <div className="container">
                {/* .category, .description, .endDate, imageLink, name, startDate, stopAcceptingBetsDate */}
                <div className='d-flex justify-content-between'>
                    <div className={styleBet.betTitle}>
                        <p className={styleBet.name}>{betData.name}</p>
                        <p className={styleBet.status}>{betData.endDate} Aquí debemos de poner ya sea Live/TimeRemaining o Ended</p>
                        <p>{formatDate(betData)}</p>
                        <p>hola</p>
                        {/* <p>{formattedDate}</p> */}
                    </div>
                    <button href="#" className={styleGlobal.btnTypeTwo}>
                        Claim reward
                    </button>
                </div>
                <div>
                    {/* {childBetsData[0].name} */}

                    {childBetsData.map((bet, index) => (
                    <div key={index} className={styleBet.childBet}>
                        <p className={styleBet.childName}>{bet.name}</p>
                        <div className={styleBet.childContainer}>
                            {bet.options.map((option, optionIndex) => (
                                <>
                                <div key={optionIndex} className={styleBet.childSelection}>
                                    <p className={styleBet.option}>
                                        {option}
                                    </p>
                                    <p className={styleBet.odds}>
                                      {bet.odds[optionIndex]}
                                    </p>
                                </div>
                            </>
                            ))}
                        </div>
                        <br />
                    </div>
                    ))}
                </div>
                
                
                
                
                
            </div>   
        </div>

    )
}
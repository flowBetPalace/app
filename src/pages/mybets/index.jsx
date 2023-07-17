import { useContext, useState, useEffect } from 'react'
import { DataContext } from '@/context/DataContext'
import * as fcl from "@onflow/fcl";
import MyOpenBet from '@/components/Widgets/MyOpenBet';
import Image from 'next/image';

import styleMyBets from '@/assets/styles/MyBets.module.css';
import styleGlobal from '@/assets/styles/Global.module.css';
import MyFinishedBet from '@/components/Widgets/MyFinishedBet';
import PopUp from '@/components/Widgets/PopUp';

export default function myBets() {
    const { user } = useContext(DataContext);
    const [openBets, setOpenBets] = useState([]);
    const [finishedBets, setFinishedBets] = useState([]);
    const [message, setMessage] = useState("")
    async function getBets() {
        if (user.loggedIn === null) {
            return
        }
        try {
            const response = await fcl.query({
                cadence: `
                import FlowBetPalace from 0xd19f554fdb83f838

                pub fun main(addr: Address) :[FlowBetPalace.UserBetStruct]{
                    // Get the accounts wich you want to get the bet
                    let acct1 = getAccount(addr)
                    //get reference of user switchboard
                    let switcboardRef = acct1.getCapability(FlowBetPalace.userSwitchBoardPublicPath)
                                          .borrow<&AnyResource{FlowBetPalace.UserSwitchboardPublicInterface}>()
                                          ?? panic("User dont have any bet yet")
                                          
                    //get keys of the active bets
                    let activeKeys = switcboardRef.getMyBetsKeys()
                    //initialize bets array 
                    let bets: [FlowBetPalace.UserBetStruct] = []
                    //get bet for every key and push to the array
                    for element in activeKeys {
                        let bet = switcboardRef.getBetData(key: element)
                        bets.append(bet)
                    }
                    
                    return bets
                }
            
            `,
                args: (arg, t) => [
                    arg(user.addr, t.Address)
                ]
            },)
            console.log('res', response)
            setOpenBets(response)
        } catch (err) {
            setMessage("you have no bets")
        }

        
    }

    async function getFinishedBets(){
        if (user.loggedIn === null) {
            return
        }
        try {
            const response = await fcl.query({
                cadence: `
                import FlowBetPalace from 0xd19f554fdb83f838


                pub fun main(addr: Address):[FlowBetPalace.UserBetStruct] {
                    // Get the accounts wich you want to get the bet
                    let acct1 = getAccount(addr)
                    //get reference of user switchboard
                    let switcboardRef = acct1.getCapability(FlowBetPalace.userSwitchBoardPublicPath)
                                          .borrow<&AnyResource{FlowBetPalace.UserSwitchboardPublicInterface}>()
                                          ?? panic("User dont have any bet yet")
                    //return old bets
                    return switcboardRef.getFinishedBets()
                }

            
            `,
                args: (arg, t) => [
                    arg(user.addr, t.Address)
                ]
            },)
            console.log('res finished', response)
            setFinishedBets(response)}catch(err){
                console.log(err)
            }

    }

    const renderedOpenBets = openBets.map((el, index)=> <MyOpenBet key={index} userBet={el} />)
    const renderFinishedBets = finishedBets.map((el, index)=> <MyFinishedBet key={index} userBet={el} />)
    useEffect(() => {
        getBets()
        getFinishedBets()
    }, [user])
    return <>
    <PopUp />
    <div className={styleMyBets.mybets}>
        <div className="container">
            <h1>
                My bets
                {user.loggedIn && 
                    <>
                        <button className={styleGlobal.btnTypeFive + ' ms-3 p-0 align-bottom'} onClick={() => window.location.reload()}>
                            <Image
                                src="./icons/refresh.svg"
                                alt='Refresh'
                                width={24}
                                height={24}
                            />
                        </button>
                    </>}
            </h1>
            {user.loggedIn ?
                <>
                    {openBets.length > 0 ? (renderedOpenBets) : <p>No open bets<br /><br /></p>}
                    {finishedBets.length > 0 && <>
                        <h1>My claimed bets</h1>
                        {renderFinishedBets}
                    </>}
                </>
            :
                <>
                    <p>
                        Connect wallet to continue
                    </p>
                </>
            }
        </div>
    </div>
    </>
}
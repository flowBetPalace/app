import { useState, useEffect, useContext } from "react"
import * as fcl from "@onflow/fcl";
import { DataContext } from '@/context/DataContext';

import Link from "next/link";
import Timer from "./Timer";

import styleMyBet from '@/assets/styles/MyBet.module.css'
import styleGlobal from '@/assets/styles/Global.module.css'



export default function MyOpenBet ({userBet}){
    const { setPopUpActive, setPopUpStatus, setPopUpMessage, setPopUpCloseable } = useContext(DataContext);
    
    console.log("userBet: ", userBet)
    const uuid = userBet.betUuid;
    const [ loadingChildBets, setLoadingChildBets] = useState(true);
    const [ loadingBetData, setLoadingBetData] = useState(true);
    const [ winner, setWinner ] = useState(null);
    const [ startDate, setStartDate ] = useState(null);
    const [ endDate, setEndDate ] = useState(null);
    const [message, SetMessage] = useState('');

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

    async function getChildBets(BetUuid){
        if(BetUuid==undefined || loadingChildBets == false){
            return
        }
        
        const response = await fcl.query({
            cadence: `
                import FlowBetPalace from 0xd19f554fdb83f838

                pub fun main(uuid:String) :[FlowBetPalace.ChildBetStruct]{
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
        setWinner(parseInt(response[0].winnerOptionsIndex[0]));
        setLoadingChildBets(false);
    }

    useEffect(() => {
        try{
            getBetData(uuid);
            getChildBets(uuid);
        }catch(err){
            console.log('err',err)
        }
    },[uuid])


    const formatAmount = (amount) => {
        var res = parseFloat(amount).toFixed(2);
        return res;
    }

    const onClaimReward = async () => {
        setPopUpStatus('loading');
        setPopUpMessage('Claiming reward...');
        setPopUpCloseable(false);
        setPopUpActive(true);
        const transactionId = await fcl.mutate({
            cadence: `
            import FlowToken from 0x7e60df042a9c0868
            import FlowBetPalace from 0xd19f554fdb83f838

            transaction(uuid: String,userBetUuid: String) {
                prepare(acct: AuthAccount) {
                    // Get a reference to the signer's stored flow vault
                    let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                        ?? panic("Could not borrow reference to the owner's Vault!")
            
                    // extract Profile resource of the account
                    let profile <- acct.load<@FlowBetPalace.UserSwitchboard>(from: FlowBetPalace.userSwitchBoardStoragePath) ?? panic("user have not started his account")
            
                    // get admin account that stores resourced
                    let accountFlowBetPalace = getAccount(0xd19f554fdb83f838)
            
                    // get reference of the childBet resource
                    let childBetRef = accountFlowBetPalace.getCapability<&AnyResource{FlowBetPalace.ChildBetPublicInterface}>(PublicPath(identifier:"betchild".concat(uuid))!)
                                        .borrow() ?? panic("invalid childBet uuid")
            
                    //withdraw UserBet from the switchboard
                    let userBet <- profile.withdrawBet(uuid:userBetUuid)
                    //check if the bet had prize in the childBet resource abd get a vault with the prize
                    let vault <- childBetRef.chechPrize(bet: <- userBet)
                    //store the vault at the FlowVault (if its a win bet will have flow tokens, else will be empty)
                    vaultRef.deposit(from: <- vault)
                    // save the extracted resource
                    // We use the force-unwrap operator  to get the value
                    // out of the optional. It aborts if the optional is nil
                    acct.save(<-profile,to:FlowBetPalace.userSwitchBoardStoragePath)
                }
            
                execute {
                }
            }
            `,
            args: (arg, t) => [
                arg(userBet.childUuid, t.String),
                arg(userBet.childBetUuid, t.String)//childBetUuid es la uuid del UserBet solamente equivoque el nombre
            ],
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 200
        })
        try {
            fcl.tx(transactionId).subscribe(res => {
                console.log("res",res);
                setTimeout(() => {
                    window.location.reload();
                }, 15000); 
            })

        } catch (err) {
            console.log("winners have not seted yet, please try later");
            setPopUpStatus('danger');
            setPopUpMessage('Winners have not been set yet, please try later.');
            setPopUpCloseable(true);
            SetMessage("winners have not seted yet, please try later");
        }
    }

    return (
        <div className={styleMyBet.mybet}>
            <div className="container">
                {loadingChildBets ? <>
                    <p>Loading...</p>
                </> : 
                    <>
                        <div className={styleMyBet.betContainer}>
                            <div className={styleMyBet.leftSection}>
                                <div className="d-flex gap-4 align-items-center">
                                    <p className={styleMyBet.mybetname}>{userBet.betName}</p>
                                    <div className={styleMyBet.vl}></div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <p className={styleMyBet.childbetname}>{userBet.childBetName}</p>
                                    <p className={styleGlobal.btnTypeFour}>{userBet.choosenOptionName}</p>
                                    <p className={styleGlobal.btnTypeFourG}>{formatAmount(userBet.amount)} FLOW</p>
                                    {/* <p>error message: {message}</p> */}
                                </div>
                            </div>
                            <div className={styleMyBet.rightSection}>
                                {/* {(parseInt(userBet.endDate) < Math.floor(Date.now() / 1000)) && (winner) ?
                                    (parseInt(userBet.choosenOption) === winner ? (
                                            <button onClick={onClaimReward} className={styleGlobal.btnTypeTwo}>Claim reward</button>
                                        ) : (
                                            <button className={styleGlobal.btnTypeTwo} disabled>No reward</button>
                                        )
                                    ) :
                                    <div className={styleGlobal.btnTypeTwoInactive}>In progress</div>
                                } */}
                                {console.log("winnerDd: ", userBet.betName, " : ", winner)}
                                {parseInt(userBet.endDate) < Math.floor(Date.now() / 1000) ?
                                    (!isNaN(winner) ? (
                                            parseInt(userBet.choosenOption) === winner ? (
                                                    <button onClick={onClaimReward} className={styleGlobal.btnTypeTwo}>Claim reward</button>
                                                ) : (
                                                    <button className={styleGlobal.btnTypeTwo} disabled>No reward</button>
                                                )
                                        ) : (
                                            <div className={styleGlobal.btnTypeTwoInactive}>Waiting for results</div>
                                        )
                                    ) : (
                                        <div className={styleGlobal.btnTypeTwoInactive}>In progress</div>
                                    )
                                }
                            <Link href={'/sports/bet/' + userBet.betUuid} className={styleGlobal.btnTypeFive}>View match</Link>
                            </div> 
                        </div>
                        <div className={styleMyBet.bottomSection}>
                            <Timer
                                rawStartDate={formatDateTime(startDate)}
                                rawEndDate={formatDateTime(endDate)}
                                goToBets={false}
                            />
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
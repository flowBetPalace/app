import { useState } from "react"
import * as fcl from "@onflow/fcl";

import Link from "next/link";

import styleMyBet from '@/assets/styles/MyBet.module.css'
import styleGlobal from '@/assets/styles/Global.module.css'



export default function MyOpenBet ({userBet}){
    const [message,SetMessage] = useState('');

    const formatAmount = (amount) => {
        var res = parseFloat(amount).toFixed(2);
        return res
    }

    const onClaimReward = async () => {
        const transactionId = await fcl.mutate({
            cadence: `
            import FlowToken from 0x7e60df042a9c0868
            import FlowBetPalace from 0x48214e37c07e015b

            transaction(uuid: String,userBetUuid: String) {
                prepare(acct: AuthAccount) {
                    // Get a reference to the signer's stored flow vault
                    let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                        ?? panic("Could not borrow reference to the owner's Vault!")
            
                    // extract Profile resource of the account
                    let profile <- acct.load<@FlowBetPalace.UserSwitchboard>(from: FlowBetPalace.userSwitchBoardStoragePath) ?? panic("user have not started his account")
            
                    // get admin account that stores resourced
                    let accountFlowBetPalace = getAccount(0x48214e37c07e015b)
            
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
            fcl.tx(transactionId).subscribe(res => console.log("res",res))

        } catch (err) {
            console.log("winners have not seted yet, please try later")
            SetMessage("winners have not seted yet, please try later")
        }
    }

    return (
        <div className={styleMyBet.mybet}>
            <div className="container d-flex justify-content-between">
                <div className="d-flex left-section gap-4 align-items-center">
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
                <div className="d-flex gap-3">
                    {parseInt(userBet.endDate) < Math.floor(Date.now() / 1000) ?
                    <button onClick={onClaimReward} className={styleGlobal.btnTypeTwo}>claim reward</button> :
                    <div className={styleGlobal.btnTypeTwoInactive}>in progress</div>
                }
                <Link href={'/sports/bet/' + userBet.betUuid} className={styleGlobal.btnTypeFive}>View match</Link>

                </div>
                
            </div>
        </div>
    )
}
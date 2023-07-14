<<<<<<< HEAD
import { useState } from "react"
import * as fcl from "@onflow/fcl";


export default function createBet() {
    const [formData, setFormData] = useState({
        name: 0,
        BetUuid: "",
    });

    const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        //if(formData.fieldName == "startDate" || formData.fieldName == "endDate" || formData.fieldName == "stopAcceptingBetsDate")
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }
    const onSubmit = async () => {
        

        // NEW
        const transactionId = await fcl.mutate({
            cadence: `

                import FlowBetPalace from 0xd19f554fdb83f838
                import FlowToken from 0x7e60df042a9c0868

                transaction(uuid: String,optionIndex:UInt64) {
                    prepare(acct: AuthAccount) {
                        let array:[UInt64] = [optionIndex]
                        //set the StoragePath of the bet
                        let betPath: StoragePath = StoragePath(identifier:"betchild".concat(uuid))!
                
                        //get the resource
                        let bet <- acct.load<@FlowBetPalace.ChildBet>(from: betPath) ?? panic("invalid bet uuid")
                
                        //set the winners
                        bet.setWinnerOptions(winnerOptions:array)
                
                        //save back the resource
                        acct.save(<-bet,to:betPath)
                
                    }
                
                    execute {
                    }
                }
`,
            args: (arg, t) => [                
                arg(formData.BetUuid, t.String),
                arg(formData.name, t.UInt64),

            ],
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 200
        })
        try {
            fcl.tx(transactionId).subscribe(res => console.log("res", res))

        } catch (err) {
            console.log("err", err)
        }
    }

    return <div>
        create bet
        <div>
            <label>winners index</label>
            <input onChange={handleInput} value={formData.name} name="name" />
            <label>BetUuid</label>
            <input onChange={handleInput} value={formData.BetUuid} name="BetUuid" />

            <div onClick={onSubmit}>Create</div>
        </div>
    </div>
=======
export default function setWinners() {
    return(
        <div>Deployment</div>
    )
>>>>>>> 67757f998c5eb67f849ef8134e4c556aaced46f4
}
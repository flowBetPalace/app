import { useState } from "react"
import * as fcl from "@onflow/fcl";


export default function createBet() {
    const [formData, setFormData] = useState({
        name: "",
        BetUuid: "",
        options: ""
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
        console.log(formData)
        console.log(formData.options.split(","))
        if(formData.options.split(",").length < 2){
            console.log("requires minium of 2 options")
            return
        }

        // NEW
        const transactionId = await fcl.mutate({
            cadence: `

                import FlowBetPalace from 0x91f91fa7da326c16

                transaction(betUuid: String,name:String,options: [String]) {

                prepare(acct: AuthAccount) {
                    
                    //set the StoragePath of the bet
                    let betPath: StoragePath = StoragePath(identifier:"bet".concat(betUuid))!

                    //get the resource
                    let bet <- acct.load<@FlowBetPalace.Bet>(from: betPath) ?? panic("invalid bet uuid")

                    //create the betChild
                    let childBet <- bet.createChildBet(name:name,options:options,startDate:bet.startDate,endDate:bet.endDate,stopAcceptingBetsDate:bet.stopAcceptingBetsDate)

                    //save back the resource
                    acct.save(<-bet,to:betPath)

                    //save the betChildResource
                    let childBetPath: StoragePath = childBet.storagePath
                    let childBetPublicPath: PublicPath = childBet.publicPath
                    acct.save(<-childBet,to:childBetPath)

                    //create a link to the storage path
                    acct.link<&AnyResource{FlowBetPalace.ChildBetPublicInterface}>(childBetPublicPath,target:childBetPath)

                    log("created a childBet, stored in storage and added a public link")
                }

                execute {
                }
                }
`,
            args: (arg, t) => [                
                arg(formData.BetUuid, t.String),
                arg(formData.name, t.String),
                arg(formData.options.split(","), t.Array(t.String))
                //arg(formData.options.split(",").map((option) => arg(option, t.String)), t.Array(t.String))  

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
            <label>name</label>
            <input onChange={handleInput} value={formData.name} name="name" />
            <label>BetUuid</label>
            <input onChange={handleInput} value={formData.BetUuid} name="BetUuid" />
            <label>Options, add options and separate them by a comma example.(player 1, player2)</label>
            <input onChange={handleInput} value={formData.options} name="options" />

            <div onClick={onSubmit}>Create</div>
        </div>
    </div>
}
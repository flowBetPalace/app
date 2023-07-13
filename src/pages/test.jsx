import { useState } from "react"
import * as fcl from "@onflow/fcl";


export default function createBet() {
    const [formData, setFormData] = useState({
        BetUuid: ""
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

        // NEW
        const transactionId = await fcl.mutate({
            cadence: `

                import FlowBetPalace from 0xd19f554fdb83f838

                transaction(betUuid: String) {

                prepare(acct: AuthAccount) {
                        let betPublicPath = PublicPath(identifier: "bet".concat(betUuid))!
                        let betStoragePath = StoragePath(identifier: "bet".concat(betUuid))!
                        //create a public link for access the bet 
                        acct.link<&AnyResource{FlowBetPalace.BetPublicInterface}>(betPublicPath,target:betStoragePath)
                        log("bet saved correctly in account storage")
                }
    
                execute {
                }
                }
`,
            args: (arg, t) => [                
                arg(formData.BetUuid, t.String),
            ],
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 50
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
            <input onChange={handleInput} value={formData.BetUuid} name="BetUuid" />
            <label>BetUuid</label>
            

            <div onClick={onSubmit}>Create Link</div>
        </div>
    </div>
}
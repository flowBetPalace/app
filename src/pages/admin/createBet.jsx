import { useState } from "react"
import * as fcl from "@onflow/fcl";


export default function createBet() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageLink: "",
        category: "",
        stopAcceptingBetsDate: 1689873418,//hardcoded for development purposes
        startDate: 1689873418,
        endDate: 1689959818,
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
    console.log(formData.endDate.toString().length,formData.startDate.toString().length,formData.stopAcceptingBetsDate.toString().length,formData)
    const onSubmit = async () => {
        //VALIDATE INPUTS
        if (formData.endDate.toString().length != 10 || formData.startDate.toString().length != 10 || formData.stopAcceptingBetsDate.toString().length != 10) {
            console.log(formData.endDate.toString().length,formData.startDate.toString().length,formData.stopAcceptingBetsDate.toString().length)
            console.log("invalid unix timestamp")
            return
        }
        if (formData.name.length == 0 || formData.category.length == 10) {
            console.log("you must add a name or category")
            return
        }


        // NEW
        const transactionId = await fcl.mutate({
            cadence: `
            import FlowBetPalace from 0x2cd0b7f034ab103d

            transaction(name: String, startDate: UFix64, endDate: UFix64, description: String, imagelink: String, category: String, stopAcceptingBetsDate: UFix64) {
                prepare(acct: AuthAccount) {
    
                    // Retrieve admin Reference of the admin resource
                    var acctAdminCapability = acct.getCapability(FlowBetPalace.adminPublicPath)
                    var acctAdminRef = acctAdminCapability.borrow<&AnyResource{FlowBetPalace.AdminInterface}>() ?? panic("Could not borrow admin reference")
                
                    // create the new bet 
                    let newBet <- acctAdminRef.createBet(name: name, description: description, imageLink: imagelink,category: category,startDate: startDate ,endDate: endDate,stopAcceptingBetsDate:stopAcceptingBetsDate) 
                
                    //get the bet storage path
                    let betStoragePath = newBet.storagePath
                    //store the newBet to storage
                    // /storage/"bet"+bet.uuid.toString()
                    acct.save(<- newBet, to: betStoragePath)
                    log(betStoragePath)
                    log("bet saved correctly in account storage")
                }
                
                execute {
                }
           
            }`,
            args: (arg, t) => [
                arg(formData.name, t.String),
                arg(`${formData.startDate.toString()}.0`, t.UFix64),
                arg(`${formData.endDate.toString()}.0`, t.UFix64),
                arg(formData.description, t.String),
                arg(formData.imageLink, t.String),
                arg(formData.category, t.String),
                arg(`${formData.stopAcceptingBetsDate.toString()}.0`, t.UFix64)
            ],
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 50
        })
        try {
            fcl.tx(transactionId).subscribe(res => console.log("res",res))

        } catch (err) {
            console.log("err", err)
        }
    }

    return <div>
        create bet
        <div>
            <label>name</label>
            <input onChange={handleInput} value={formData.name} name="name" />
            <label>description</label>
            <input onChange={handleInput} value={formData.description} name="description" />
            <label>category(basket,football,racing,ufc)</label>
            <input onChange={handleInput} value={formData.category} name="category" />
            <label>league icon frontend(nfl,laliga,ufc,motogp,f1)</label>
            <input onChange={handleInput} value={formData.imageLink} name="imageLink" />
            <label>start date (timestamp)</label>
            <input type="number" onChange={handleInput} value={formData.startDate} name="startDate" />
            <label>end date (timestamp)</label>
            <input type="number" onChange={handleInput} value={formData.endDate} name="endDate" />
            <label>stop accepting bets date (timestamp)</label>
            <input type="number" onChange={handleInput} value={formData.stopAcceptingBetsDate} name="stopAcceptingBetsDate" />
            <div onClick={onSubmit}>Create</div>
        </div>
    </div>
}
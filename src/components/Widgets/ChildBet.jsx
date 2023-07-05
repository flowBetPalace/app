import { useState, useContext } from 'react'
import { DataContext } from '@/context/DataContext';
import styleBet from '@/assets/styles/StyleBet.module.css'
import Image from 'next/image'
import * as fcl from "@onflow/fcl";

export default function ChildBet({ uuid, matchTitle, name, options, winnerOptionsIndex, odds, startDate, stopAcceptingBetsDate, endDate }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const { user, BetModalActive, setBetModalActive, BetModalStatus, setBetModalStatus, BetModalMessage, setBetModalMessage, BetModalCloseable, setBetModalCloseable } = useContext(DataContext);
    console.log('selected index',selectedIndex)

    const onSubmitBuyBet = async (e) => {
        e.preventDefault();
        let amount = e.target.elements.amount.value
        // Check if amount is a whole number
        if (!amount.includes('.')) {
            amount += '.0'; // Append '.0' for decimal
        }
        // NEW
        const transactionId = await fcl.mutate({
            cadence: `
            import FlowBetPalace from 0x036703c904a81123
            import FlowToken from 0x05
            transaction(amount: UFix64,uuid: String,optionIndex:UInt64) {
                prepare(acct: AuthAccount) {
                    log("start")
                    // start switchboard if its not started
                    let profilecopy <- acct.load<@FlowBetPalace.UserSwitchboard>(from: FlowBetPalace.userSwitchBoardStoragePath)
                    // if there is not any resrource of the profile create one else save the extracted one
                    if(profilecopy == nil){
                        //get the user address as required field for the function
                        let address = acct.address.toString()
            
                        //create a new UserSwitchBoard resource
                        let userSwitchBoardResource <-FlowBetPalace.createUserSwitchBoard(address: address)
            
                        //save the resource in account storage
                        acct.save(<- userSwitchBoardResource,to:FlowBetPalace.userSwitchBoardStoragePath)
                    
                        //create a private link to the storage path
                        acct.link<&FlowBetPalace.UserSwitchboard>(FlowBetPalace.userSwitchBoardPrivatePath,target:FlowBetPalace.userSwitchBoardStoragePath)
                        log("account switchboard created")
                        // destroy the resource as its null
                        destroy profilecopy
                    }else{
                        // save the extracted resource
                        acct.save(<-profilecopy!,to:FlowBetPalace.userSwitchBoardStoragePath)
                        log("account switchboard was already created")
                    }
                    //extract money to pay the bet
                    //
                    // Get a reference to the signer's stored vault
                    let vaultRef = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                        ?? panic("Could not borrow reference to the owner's Vault!")
            
                    // Withdraw tokens from the signer's stored vault
                    let vault <- vaultRef.withdraw(amount: amount)
            
                    // extract Profile resource of the account
                    let profile <- acct.load<@FlowBetPalace.UserSwitchboard>(from: FlowBetPalace.userSwitchBoardStoragePath) ?? panic("user have not started his account")
            
                    // get admin account that stores resourced
                    let accountFlowBetPalace = getAccount(0x01)
                    log("getting ref")
                    // get reference of the childBet resource
                    let childBetRef = accountFlowBetPalace.getCapability<&AnyResource{FlowBetPalace.ChildBetPublicInterface}>(PublicPath(identifier:"betchild".concat(uuid))!)
                                        .borrow() ?? panic("invalid childBet uuid")
            
                    log("ref getted")
                    log(childBetRef)
                    //create the UserBet
                    let newUserBet <- childBetRef.newBet(optionIndex: optionIndex, vault: <-vault)
            
                    //add bet to the switchboard
                    profile.addBet(newBet: <-newUserBet)
            
                    // save the extracted resource
                    acct.save(<-profile,to:FlowBetPalace.userSwitchBoardStoragePath)
                }
            
                execute {
                }
            }`
            ,
            args: (arg, t) => [
                arg(amount, t.UFix64),
                arg(uuid, t.String),
                arg(parseInt(selectedIndex), t.Int64),
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

    const openBetModal = (index, name, bet, match) => {
        let profit = '-';
        const modalContent = (
            <form onSubmit={onSubmitBuyBet} action=''>
                <h6>{name}</h6>
                <p>
                    <Image
                        src=""
                        alt="Check icon"
                        width={16}
                        height={16}
                    />
                    {bet}
                </p>
                <p>{match}</p>
                <input type="number" step="0.1" id="amount" placeholder='Enter $FLOW amount to bet' />
                <p>Profit: {profit}</p>
                {user.loggedIn == null ? (
                    <button disabled>Connect wallet to place bet</button>
                ) : (
                    <button>Confirm bet</button>
                )}
            </form>
        );
        setSelectedIndex(index);
        setBetModalStatus('');
        setBetModalMessage(modalContent);
        setBetModalCloseable(true);
        setBetModalActive(true);
    }

    return <div className={styleBet.childBet}>
        <p className={styleBet.childName}>{name}</p>
        <div className={styleBet.childContainer}>
            {options.map((option, optionIndex) => (
                <div key={optionIndex} className={styleBet.childSelection} onClick={() => openBetModal(optionIndex, name, option, matchTitle)} >
                    <p className={styleBet.option}>
                        {option}
                    </p>
                    <p className={styleBet.odds}>
                        {odds[optionIndex]}
                    </p>
                </div>

            ))}
        </div>
        <button onClick={() => console.log(selectedIndex)}>Butoncito</button>
        <br />
    </div>

}
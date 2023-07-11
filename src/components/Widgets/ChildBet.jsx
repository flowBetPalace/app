import { useState, useContext } from 'react'
import { DataContext } from '@/context/DataContext';
import styleBet from '@/assets/styles/StyleBet.module.css'
import Image from 'next/image'
import * as fcl from "@onflow/fcl";

export default function ChildBet({ uuid, matchTitle, name, options, winnerOptionsIndex, odds, startDate, stopAcceptingBetsDate, endDate, acceptBets }) {
    const { user, balance, setBalance, setBetModalActive, setBetModalStatus, setBetModalMessage, setBetModalCloseable, setPopUpActive, setPopUpStatus, setPopUpMessage, setPopUpCloseable } = useContext(DataContext);

    const getFlowBalance = async (address) => {
        if (address) {
            const account = await fcl.account(address);
            setBalance((parseInt(account.balance) / 100000000).toFixed(2));
            return account.balance;
        }
        return 'Try again';
    };

    const onSubmitBuyBet = async (e,index) => {
        console.log('----',index);
        e.preventDefault();
        setPopUpCloseable(false);
        setPopUpStatus('loading');
        setPopUpMessage('Loading...');
        setPopUpActive(true);
        let amount = e.target.elements.amount.value
        // Check if amount is a whole number
        if (!amount.includes('.')) {
            amount += '.0'; // Append '.0' for decimal
        }
        // NEW
        const transactionId = await fcl.mutate({
            cadence: `
            import FlowBetPalace from 0x48214e37c07e015b
            import FlowToken from 0x7e60df042a9c0868
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
                        acct.link<&AnyResource{FlowBetPalace.UserSwitchboardPublicInterface}>(FlowBetPalace.userSwitchBoardPublicPath,target:FlowBetPalace.userSwitchBoardStoragePath)
                        log("account switchboard created")
                        // destroy the resource as its null
                        destroy profilecopy
                    }else{
                        // save the extracted resource
                        // We use the force-unwrap operator  to get the value
                        // out of the optional. It aborts if the optional is nil
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
                    let accountFlowBetPalace = getAccount(0x48214e37c07e015b)
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
                    // We use the force-unwrap operator  to get the value
                    // out of the optional. It aborts if the optional is nil
                    acct.save(<-profile,to:FlowBetPalace.userSwitchBoardStoragePath)
                }
            
                execute {
                }
            }`
            ,
            args: (arg, t) => [
                arg(amount, t.UFix64),
                arg(uuid, t.String),
                arg(`${index}`, t.UInt64),
            ],
            payer: fcl.authz,
            proposer: fcl.authz,
            authorizations: [fcl.authz],
            limit: 200
        });
        const statusPopUp = (res) => {
            console.log("res: ", res);
            switch (res.status) {
                case 0:
                    // UNKNOWN	The transaction status is not known.
                    setPopUpMessage('The transaction status is unknown.');
                    break;
                case 1:
                    // PENDING	The transaction has been received by a collector but not yet finalized in a block.
                    setPopUpMessage('Your transaction is being handled by a collector.');
                    break;
                case 2:
                    // FINALIZED	The consensus nodes have finalized the block that the transaction is included in
                    setPopUpMessage('Your transaction is almost finished being processed.');
                    break;
                case 3:
                    // EXECUTED	The execution nodes have produced a result for the transaction
                    setPopUpMessage('Your transaction is being processed.');
                    break;
                case 4:
                    // SEALED	The verification nodes have verified the transaction (the block in which the transaction is) and the seal is included in the latest block
                    setPopUpMessage('The transactions was successfull! Good luck!');
                    setPopUpStatus('success');
                    setPopUpCloseable(true);
                    
                    getFlowBalance(user?.addr);

                    setBetModalActive(false);
                    setBetModalMessage('');
                    setBetModalCloseable(true);
                    setBetModalStatus('');
                    break;
                case 5:
                    // EXPIRED	The transaction was submitted past its expiration block height.
                    setPopUpMessage('There was an error during the process.');
                    setPopUpStatus('danger');
                    setPopUpCloseable(true);
                    break;
                default:
                    setPopUpMessage('Loading...');
                    break;
            }
            return;
        }
        try {
            fcl.tx(transactionId).subscribe(res => statusPopUp(res));
        } catch (err) {
            console.log("err: ", err);
            setPopUpMessage('There was an error during the transaction. ', err);
            setPopUpStatus('danger');
            setPopUpCloseable(true);
        }
    }

    const openBetModal = (index, name, bet, match) => {
        let profit = '-';
        const modalContent = (
            <form onSubmit={(e)=>{onSubmitBuyBet(e,index)}} action=''>
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
        setBetModalStatus('');
        setBetModalMessage(modalContent);
        setBetModalCloseable(true);
        setBetModalActive(true);
    }

    return (
    <div className={styleBet.childBet}>
        <p className={styleBet.childName}>{name}</p>
        <div className={styleBet.childContainer}>
            {options.map((option, optionIndex) => (
                <button key={optionIndex} data-key={optionIndex} className={styleBet.childSelection} onClick={() => openBetModal(optionIndex, name, option, matchTitle)} disabled={!acceptBets} >
                    <p className={styleBet.option}>
                        {option}
                    </p>
                    <p className={styleBet.odds}>
                        {/* {(1+parseFloat(odds[optionIndex])).toFixed(2)} */}
                        {(parseFloat(odds[optionIndex])).toFixed(2)}
                    </p>
                </button>

            ))}
        </div>
        <br />
    </div>
    )

}
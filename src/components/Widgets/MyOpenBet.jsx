
export default function MyOpenBet ({userBet,endDate}){

    return <div>
        name:{userBet.childBetName} 
        choosenOption:{userBet.choosenOptionName} 
        amount:{userBet.amount} 
        {/* </div>{userBet.stopAcceptingBets<button>claim reward</button> : <div>in progress</div>} */}
    </div>
}
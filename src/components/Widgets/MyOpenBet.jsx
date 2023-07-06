
export default function MyOpenBet ({userBet}){
    return <div>
        bet name:{userBet.betName}
        name:{userBet.childBetName} 
        choosenOption:{userBet.choosenOptionName} 
        amount:{userBet.amount} 
        {userBet.endDate > Date.now() ? <button>claim reward</button> : <div>in progress</div>}
    </div>
}
import styleMyBet from '@/assets/styles/MyBet.module.css'

export default function MyFinishedBet ({userBet}){
    
    return (
        <div className={styleMyBet.mybet}>
            <div className="container">
                <div>
                    <p className={styleMyBet.mybetname}>{userBet.betName}</p>
                    <div className={styleMyBet.vl}></div>
                </div>
                
                name:{userBet.childBetName} 
                choosenOption:{userBet.choosenOptionName} 
                amount:{userBet.amount} 
                {/* we cant know if the user have won or lose the finished bet so we redirect to the bet */}
                <button>go Bet</button>
            </div>
        </div>
    )
}
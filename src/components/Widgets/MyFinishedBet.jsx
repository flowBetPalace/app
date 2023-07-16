import styleMyBet from '@/assets/styles/MyBet.module.css'
import styleGlobal from '@/assets/styles/Global.module.css'

import Link from 'next/link';

export default function MyFinishedBet ({userBet}){
    const formatAmount = (amount) => {
        var res = parseFloat(amount).toFixed(2);
        return res;
    }
    
    return (
        <div className={styleMyBet.mybet}>
            <div className="container">
                <div className={styleMyBet.betContainer}>
                    <div className={styleMyBet.leftSection}>
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
                    <div className={styleMyBet.rightSection}>
                    {/* we cant know if the user have won or lose the finished bet so we redirect to the bet */} 
                    <Link href={'/sports/bet/' + userBet.betUuid} className={styleGlobal.btnTypeFive}>View match</Link>
                    </div> 
                </div>
            </div>
        </div>
    )
}
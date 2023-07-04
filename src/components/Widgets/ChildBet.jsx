import styleBet from '@/assets/styles/StyleBet.module.css'
import { useState } from 'react'

export default function ChildBet({uuid,name,options,winnerOptionsIndex,odds,startDate,stopAcceptingBetsDate,endDate}){
    const [selectedIndex,setSelectedIndex] = useState(null);

    const onClickBuyBet = () => {
        
    }

    return  <div className={styleBet.childBet}>
                        <p className={styleBet.childName}>{name}</p>
                        <div className={styleBet.childContainer}>
                            {options.map((option, optionIndex) => (
                                <>
                                <div key={optionIndex} className={styleBet.childSelection} onClick={()=>{
                                    setSelectedIndex(optionIndex)
                                    }} >
                                    <p className={styleBet.option}>
                                        {option} 
                                    </p>
                                    <p className={styleBet.odds}>
                                      {odds[optionIndex]}
                                    </p>
                                </div>
                            </>
                            ))}
                        </div>
                        <button onClick={() => console.log(selectedIndex)}>Butoncito</button>
                        <br />
            </div>
    
}
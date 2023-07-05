import { useState, useContext } from 'react'
import { DataContext } from '@/context/DataContext';
import styleBet from '@/assets/styles/StyleBet.module.css'
import Image from 'next/image'

export default function ChildBet({uuid,matchTitle,name,options,winnerOptionsIndex,odds,startDate,stopAcceptingBetsDate,endDate}){
    const [selectedIndex,setSelectedIndex] = useState(null);
    const { user, BetModalActive, setBetModalActive, BetModalStatus, setBetModalStatus, BetModalMessage, setBetModalMessage, BetModalCloseable, setBetModalCloseable } = useContext(DataContext);

    const onClickBuyBet = () => {
        
    }
    const openBetModal = (index, name, bet, match) => {
        let profit = '-';
        const modalContent = (
            <form action=''>
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
                <input type="number" placeholder='Enter $FLOW amount to bet' />
                <p>Profit: {profit}</p>
                {user !== null ? (
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

    return  <div className={styleBet.childBet}>
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
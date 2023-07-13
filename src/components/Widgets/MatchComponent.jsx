import Image from 'next/image'
import Link from 'next/link'

import style from '@/assets/styles/Match.module.css'

export default function MatchComponent({ subcategory, category, id, match, matchType }) {
    return (
        <div className={style.match}>
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <div className={style.names}>
                            <div className={style.nameAContainer}>
                                <p className={style.nameA}>
                                    {match}
                                </p>
                                <div className={style.scores}>
                                    <p className={style.nameAScore}>?</p>
                                    <p className={style.nameBScore}>?</p>
                                </div>
                            </div>
                            <p className={style.category}>{category}</p>
                            {/* <div className={style.nameBContainer}>
                                <p className={style.nameB}>
                                    {match}
                                </p>
                                <p className={style.nameBScore}>
                                    {match}
                                </p>
                            </div> */}
                        </div>
                        {/* <div className={style.statusAndInfo}>
                            <div className={style.status}>
                                <div className={style.statusLive}>
                                    <Image 
                                        src="/icons/circle.svg"
                                        alt="Live icon"
                                        width={8}
                                        height={8}
                                    />
                                    <p className={style.statusLiveSquare}> 
                                        Live
                                    </p>
                                </div>
                                <p className={style.statusTimeLeft}>
                                    Ends in 31 min
                                </p>
                            </div>
                        </div> */}
                    </div>
                    <div className={style.secondCol + ' col-6'}>
                        <Link href={'/sports/bet/' + id} className={style.viewMatch}>View match</Link>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
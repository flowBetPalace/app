import Image from "next/image"
import Link from "next/link"

import styleHomeCard from '@/assets/styles/HomeCard.module.css'
import styleGlobal from '@/assets/styles/Global.module.css'

export default function HomeCard(){
    return(
        <div className={styleHomeCard.Homecard}>
            <div className={styleHomeCard.content}>
                <p className={styleHomeCard.title}>Your sports betting<br/> decentralized hub</p>
                <div>
                    <p className={styleHomeCard.subtitle}>Powered by Flow network
                        <Image
                            src="/imgs/logo-flow.svg"
                            alt="Flow logo"
                            width={24}
                            height={24}
                            priority
                            
                        />
                    </p>
                </div>
                <Link href="#" className={styleGlobal.btnTypeOne}>
                    Github Docs
                </Link>
                
            </div>
            
        </div>
    )

}
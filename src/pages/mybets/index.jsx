import { useContext, useState, useEffect } from 'react'
import { DataContext } from '@/context/DataContext'
import * as fcl from "@onflow/fcl";

export default function myBets () {
    const { user } = useContext(DataContext);
    async function getBets() {
        if(user.loggedIn===null){
            return
        }
    }

    useEffect(()=>{
        getBets()
    },[user])
    return <div>my bets</div>
}
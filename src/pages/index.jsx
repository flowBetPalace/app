import Head from 'next/head'
import Link from 'next/link';
import "../../flow/config";
import { useState, useEffect, useContext } from "react";
import * as fcl from "@onflow/fcl";

import Match from '@/components/Widgets/MatchComponent'
import NBA from '@/components/Protocols/NBA'

import styleHome from '@/assets/styles/Home.module.css'
import styleGlobal from '@/assets/styles/Global.module.css'

import HomeCard from '@/components/Widgets/HomeCard';

import { DataContext } from '@/context/DataContext';

import matchesData from "@/matches.json";

export default function Home() {

  const [ bets, setBets ] = useState([]);
  const [user, setUser] = useState({loggedIn: null})
  const [name, setName] = useState('')
  const [transactionStatus, setTransactionStatus] = useState(null) // NEW
  const {categories, setCategories } = useContext(DataContext);


  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setName(profile?.name ?? 'No Profile')
  }

  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  // NEW
  const executeTransaction = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
      args: (arg, t) => [arg("Flow Developer!", t.String)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    fcl.tx(transactionId).subscribe(res => setTransactionStatus(res.status))
  }

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <div>Profile Name: {name ?? "--"}</div>
        <div>Transaction Status: {transactionStatus ?? "--"}</div> {/* NEW */}
        <button onClick={sendQuery}>Send Query</button>
        <button onClick={initAccount}>Init Account</button>
        <button onClick={executeTransaction}>Execute Transaction</button> {/* NEW */}
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  async function getBets() {
    const response = await fcl.query({
      cadence: `
        import FlowBetPalace from 0x48214e37c07e015b
  
        // This script gets all bets
        
        pub fun main :[[String]] {
          let amountReturnedBets = 5
          // Get the accounts' public account objects
          let acct1 = getAccount(0x48214e37c07e015b)
  
          // Get references to the account's receivers
          // by getting their public capability
          // and borrowing a reference from the capability
          let scriptRef = acct1.getCapability(FlowBetPalace.scriptPublicPath)
                              .borrow<&FlowBetPalace.Script>()
                              ?? panic("Could not borrow acct1 vault reference")
  
          let bets = scriptRef.getBets(amount: amountReturnedBets)
          log(bets)
          return bets
        }
      `
    })
  
    console.log("response: ", response);
    setBets(response)
  }
  
  console.log(bets)
  
  const labeledData = bets.map((data) => ({
    id: data[0],
    match: data[1],
    matchType: data[2],
    category: data[3],
    subcategory: data[4],
  }));
  
  useEffect(() => {
    try{
        getBets()
    }catch(err){
        console.log(err)
    }
  }, [])

  return (
    <div>
      <Head>
        <title>FlowBetPalace</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styleGlobal.main}>
        <header>
          <div className="container">
            <HomeCard />
            <div className={styleHome.subtitleContainer}>
              <p className={styleGlobal.fontL}>🔥 Hot matches</p>
              <Link href="/sports" className={styleGlobal.btnTypeTwo}>
                View all
              </Link>
            </div>
            {/* {user.loggedIn
              ? <AuthedState />
              : <UnauthenticatedState />
            } */}

            {/* Tab content */}
            <div>
                {labeledData.map((data) =>(
                    <Match
                    key={data.id}
                    subcategory={data.subcategory}
                    category={data.category}
                    id={data.id}
                    match={data.match}
                    matchType={data.matchType}
                    />
                ))}



                
            </div>


            {/* {matchesData.map((match, index) => (
              <Match
              key={index}
              category={match.category}
              nameA={match.nameA}
              nameB={match.nameB}
              scoreA={match.scoreA}
              scoreB={match.scoreB}
              winner={match.winner}
              startDate={match.startDate}
              bets={match.bets}
              liquidity={match.liquidity}
              matchContractAddress={match.matchContractAddress}
              />
            )
            )} */}


          




            {/* <NBA /> */}
          </div>
        </header>
      </main>
    </div>
  )
}

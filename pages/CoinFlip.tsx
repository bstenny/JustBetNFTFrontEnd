import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import * as React from 'react'
import Head from 'next/head';
import styles from '../styles/CoinFlip.module.css';
import Navbar from "../components/Navbar";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import placeBet from "../contract-abi.json"

const CoinFlip = () => {
    const [choice, setChoice] = React.useState<boolean>(false);
    const [betAmount, setBetAmount] = React.useState<number>(0);
    const handleChoice = (value: boolean) => {
        setChoice(value);
    }
    const { isConnected } = useAccount();

    const {config} = usePrepareContractWrite({
        address: '0xc9478a5072081b65c2491d3E35833CaeeC6306D9',
        abi: [
            {
                inputs: [
                    {
                        "internalType": "bool",
                        "name": "_choice",
                        "type": "bool"
                    }
                ],
                name: "placeBet",
                outputs: [],
                stateMutability: "payable",
                type: "function"
            },
        ],
        functionName: 'placeBet',
        args: [choice]
    })
    const {data, isLoading, isSuccess, write: placeBet} = useContractWrite(config)


    const[result, getResult] = React.useState();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(event.target.value);
    setBetAmount(amount);
  };

  return (
      <div className={styles.container}>
        <Head>
          <title>CoinFlip - LedgerLuck</title>
          <meta
              content="A simple coin flipping game"
              name="description"
          />
        </Head>

        <Navbar />

        <main className={styles.main}>
            <ConnectButton />
          <h1 className={styles.title}>CoinFlip</h1>

          <div className={styles.betContainer}>
            <label htmlFor="betInput">Enter your bet:</label>
            <input
                type="number"
                id="betInput"
                className={styles.betInput}
                value={betAmount}
                onChange={handleChange}
            />
              <div className={styles.grid}>
                  <div className={styles.card}>
                  <button className={styles.betButton} onClick={() => handleChoice(true)}>Heads</button>
                  </div>
                  <div className={styles.card}>
                  <button className={styles.betButton} onClick={() => handleChoice(false)}>Tails</button>
                  </div>
                  {choice !== null && <p className={styles.result}>Your choice is {choice ? 'heads' : 'tails'}!</p>}
                  {betAmount !== null && <p className={styles.result}>You are betting: {betAmount}!</p>}
              </div>
              {isConnected && (
                  <button className= {styles.betButton} disabled={!placeBet} onClick={() => placeBet?.()}>
              Flip the coin
            </button>)
              }
              {isLoading && <div> <p className={styles.result}>Check Wallet. Bet is being resolved</p></div>}
              {isSuccess && <div> <p className={styles.result}>Bet is resolved. Here is the output data: {JSON.stringify(data)}</p></div>}
          </div>

          <p className={styles.result}>{result}</p>
        </main>

        <footer className={styles.footer}>
          <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
            Made with ❤️ by your frens at 🌈
          </a>
        </footer>
      </div>
  );
};

export default CoinFlip;

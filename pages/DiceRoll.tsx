import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import * as React from 'react'
import Head from 'next/head';
import styles from '../styles/CoinFlip.module.css';
import Navbar from "../components/Navbar";
import { useAccount, usePrepareContractWrite, useContractWrite, useContractEvent, useWaitForTransaction } from "wagmi";
import placeBet from "../contract-abi.json"
import {parseEther} from "ethers/lib/utils";
import {BigNumber} from "ethers";


const DiceRoll = () => {
    const [rollover, setRollover] = React.useState<number>(50);
    const [betAmount, setBetAmount] = React.useState<string>("0.1");
    const [betId, setBetId] = useState<BigNumber | null>(null);
    const [hasWon, setHasWon] = useState<boolean | null>(null);
    const validAmount = () => {
        const regex = /^\d+(\.\d{1,18})?$/; // Matches valid numbers with optional decimal points, up to 18 decimal places
        return regex.test(betAmount) && parseFloat(betAmount) > 0;
    };
    const {isConnected, address} = useAccount();
    const {config: config1} = usePrepareContractWrite({
        address: '0xd9E8a95b1C84A397b65322B9A432FB9D16f94cf2',
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "uint16",
                        "name": "_rollover",
                        "type": "uint16"
                    }
                ],
                "name": "placeBet",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
        ],
        functionName: 'placeBet',
        args: [rollover],
        overrides: validAmount() ? {
            value: parseEther(betAmount),
            from: address,
        } : undefined,
    })
    const {data, isLoading, isSuccess, write: placeBet} = useContractWrite(config1)

    useContractEvent({
        address: '0xd9E8a95b1C84A397b65322B9A432FB9D16f94cf2',
        abi: [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "betId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint16",
                        "name": "rollover",
                        "type": "uint16"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint16",
                        "name": "result",
                        "type": "uint16"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "won",
                        "type": "bool"
                    }
                ],
                "name": "BetResolved",
                "type": "event"
            },
        ],
        eventName: 'BetResolved',
        listener(betId: BigNumber, player: string, amount: BigNumber, rollover: number, result: number, won: boolean) {
            console.log(`BetResolved event received with betId: ${betId.toString()} and won: ${won}`);

            // You can now use the betId and won variables in your component
            // For example, you can set them in your component's state:
            setBetId(betId);
            setHasWon(won);
        },
    })
    const [result, getResult] = React.useState();

    const {config: config2} = usePrepareContractWrite(betId ? {
        address: '0xd9E8a95b1C84A397b65322B9A432FB9D16f94cf2',
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "cashout",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
        ],
        functionName: 'cashout',
        args: [betId],
        overrides: {
            from: address,
        },
    } : undefined);

    const {data: data1, isLoading: isLoading1, isSuccess: isSuccess1, write: cashOut} = useContractWrite(config2)


    // @ts-ignore
    return (
        <div className={styles.container}>
            <Head>
                <title>DiceRoll - LedgerLuck</title>
                <meta
                    content="A simple dice rolling game"
                    name="description"
                />
            </Head>

            <Navbar/>

            <main className={styles.main}>
                <ConnectButton/>
                <h1 className={styles.title}>DiceRoll</h1>
                <p className={styles.grid}>Instructions: Move the slider to select a number. If the dice rolls a
                    number higher than your number, you win! Choosing a higher number will result in a higher payout
                    upon winning.</p>
                <div className={styles.betContainer}>
                    <label htmlFor="betAmount">Enter your bet:</label>
                    <input
                        type="string"
                        id="betAmount"
                        className={styles.betInput}
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                    />
                    <label htmlFor="rollover">Rollover:</label>
                    <input
                        type="range"
                        id="rollover"
                        min="0"
                        max="100"
                        step="1"
                        value={rollover}
                        onChange={(e) => setRollover(parseInt(e.target.value                    ))}
                    />
                    <span>{rollover}</span>
                    {betAmount !== null && <p className={styles.result}>You are betting: {betAmount}!</p>}
                    {isConnected && (
                        <button
                            className={styles.betButton}
                            disabled={!placeBet || !validAmount()}
                            onClick={() => placeBet?.()}
                        >
                            Roll the dice
                        </button>)
                    }
                    {isLoading && <div><p className={styles.result}>Check Wallet. Bet is being resolved</p></div>}
                    {isSuccess && hasWon !== null && (
                        <div>
                            <p className={styles.result}>
                                Bet is resolved. You have {hasWon ? "won" : "lost"}!
                            </p>
                        </div>
                    )}
                    {isSuccess && hasWon === true && (
                        <div>
                            <p className={styles.result}>
                                Congratulations. Please use the cashout button below to claim your winnings. It should
                                take about 40 seconds for it to go through.
                            </p>
                            <button className={styles.betButton} disabled={!cashOut} onClick={() => cashOut?.()}>
                                Cash Out
                            </button>
                        </div>
                    )}
                    {isSuccess && hasWon == null && (
                        <div>
                            <p className={styles.result}>
                                Bet is has not yet been resolved. Please wait about a minute for it to finish.
                            </p>
                        </div>
                    )}
                </div>

            </main>

            <footer className={styles.footer}>
                <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
                    Made with ❤️ by your frens at 🌈
                </a>
            </footer>
        </div>
    );
};

export default DiceRoll;



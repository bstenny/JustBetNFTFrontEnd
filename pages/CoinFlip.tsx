import {ConnectButton} from '@rainbow-me/rainbowkit';
import {useState} from 'react';
import * as React from 'react'
import Head from 'next/head';
import styles from '../styles/CoinFlip.module.css';
import Navbar from "../components/Navbar";
import {useAccount, usePrepareContractWrite, useContractWrite, useContractEvent, useWaitForTransaction} from "wagmi";
import placeBet from "../contract-abi.json"
import {parseEther} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import Link from "next/link";


const CoinFlip = () => {
    const [choice, setChoice] = React.useState<boolean>(false);
    const [betAmount, setBetAmount] = React.useState<string>("0.1");
    const [betId, setBetId] = useState<BigNumber | null>(null);
    const [hasWon, setHasWon] = useState<boolean | null>(null);
    const handleChoice = (value: boolean) => {
        setChoice(value);
    }
    const validAmount = () => {
        const regex = /^\d+(\.\d{1,18})?$/; // Matches valid numbers with optional decimal points, up to 18 decimal places
        return regex.test(betAmount) && parseFloat(betAmount) > 0;
    };
    const {isConnected, address} = useAccount();
    const {config: config1} = usePrepareContractWrite({
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
        args: [choice],
        overrides: validAmount() ? {
            from: address,
            value: parseEther(betAmount),
        } : {},
    })
    const {data, isLoading, isSuccess, write: placeBet} = useContractWrite(config1)

    useContractEvent({
        address: '0xc9478a5072081b65c2491d3E35833CaeeC6306D9',
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
                        "internalType": "bool",
                        "name": "choice",
                        "type": "bool"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "result",
                        "type": "bool"
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
        listener(betId: BigNumber, player: string, amount: BigNumber, choice: boolean, result: boolean, won: boolean) {
            console.log(`BetResolved event received with betId: ${betId.toString()} and won: ${won}`);

            // You can now use the betId and won variables in your component
            // For example, you can set them in your component's state:
            setBetId(betId);
            setHasWon(won);
        },
    })
    const [result, getResult] = React.useState();

    const {config: config2} = usePrepareContractWrite(betId ? {
        address: '0xc9478a5072081b65c2491d3E35833CaeeC6306D9',
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
                <title>CoinFlip - LedgerLuck</title>
                <meta
                    content="A simple coin flipping game"
                    name="description"
                />
            </Head>

            <Navbar/>

            <main className={styles.main}>
                <ConnectButton/>
                <h1 className={styles.title}>CoinFlip</h1>
                <div className={styles.betContainer}>
                    <label htmlFor="betAmount">Enter your bet:</label>
                    <input
                        type="string"
                        id="betAmount"
                        className={styles.betInput}
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                    />
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <button className={styles.betButton} onClick={() => handleChoice(true)}>Heads</button>
                        </div>
                    </div>
                    <br/>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <button className={styles.betButton} onClick={() => handleChoice(false)}>Tails</button>
                        </div>
                    </div>
                    {choice !== null &&
                        <p className={styles.result}>Your choice is {choice ? 'heads' : 'tails'}!</p>}
                    {betAmount !== null && <p className={styles.result}>You are betting: {betAmount}!</p>}
                    {isConnected && (
                        <button
                            className={styles.betButton}
                            disabled={!placeBet || !validAmount()}
                            onClick={() => placeBet?.()}
                        >
                            Flip the coin
                        </button>)
                    }
                    {isLoading && <div><p className={styles.result}>Check Wallet. Bet is being resolved</p></div>}
                    {isSuccess && hasWon !== null && (
                        <div>
                            <p className={styles.result}>
                                Bet is resolved. You have {hasWon ? 'won' : 'lost'}!
                            </p>
                        </div>
                    )}
                    {isSuccess && hasWon == null && (
                        <div>
                            <p className={styles.result}>
                                Bet is has not yet been resolved. Please wait about a minute for it to finish.
                            </p>
                        </div>
                    )}
                    {isSuccess && hasWon && (
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
                    {isSuccess1 && hasWon && (
                        <p className={styles.result}>
                            Your winnings should have been deposited to your address. Check your wallet to see if they
                            did.
                            To see your updated balance on LedgerLuck, please refresh the page.
                        </p>
                    )}
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

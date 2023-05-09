import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/CoinFlip.module.css';
import Navbar from '../components/Navbar';

const CoinFlip = () => {
  const [betAmount, setBetAmount] = useState(0);
  const [result, setResult] = useState('');

  const flipCoin = async () => {
    // TODO: Implement smart contract interaction here
    const randomNum = Math.random();
    if (randomNum >= 0.5) {
      setResult('You won!');
    } else {
      setResult('You lost!');
    }
  };

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
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navbar />

      <main className={styles.main}>
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
          <button className={styles.betButton} onClick={flipCoin}>
            Flip the coin
          </button>
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

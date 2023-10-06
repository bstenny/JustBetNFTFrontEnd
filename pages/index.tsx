import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from 'next/image';

declare global {
  interface Window {
    tronWeb: any;
  }
}
import { useState, useEffect } from 'react';

const Home = () => {

  const [tronWebState, setTronWebState] = useState({
    installed: false,
    loggedIn: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.tronWeb) {
        setTronWebState({
          installed: true,
          loggedIn: window.tronWeb.ready,
        });
      } else {
        window.addEventListener('message', ({ data }) => {
          if (data.message && data.message.action == 'setAccount') {
            setTronWebState({
              installed: true,
              loggedIn: window.tronWeb && window.tronWeb.ready,
            });
          }
        });
      }
    }
  }, []);

  const ConnectWalletButton = () => {
    if (!tronWebState.installed) {
      return <div>TronLink is not installed. Please install it.</div>;
    } else if (!tronWebState.loggedIn) {
      return <div>Please log in to TronLink.</div>;
    } else {
      return <div>TronLink is installed and logged in.</div>;
    }
  };

  return (
      <div className={styles.container}>
        <Head>
          <title>JustBetOnTron</title>
          <link href="/favicon.ico" rel="icon" />
        </Head>

        <Navbar/>

        <main className={styles.main}>

        <Image src="/justbetontron.png" alt="JustBetOnTron Logo" width={300} height={300} />

            <h1 className={styles.title}>Welcome to JustBetOnTron</h1>

            <p className={styles.description}>
                A decentralized casino powered by{' '}
                <a href="https://www.tronlink.org/" className={styles.link}>
                    Tron Link.
                </a>
            </p>

          <div className={styles.grid} style={{display: 'flex', justifyContent: 'center'}}>
              <Link href="/DiceRoll">
                  <a className={styles.card}>
                      <h2>Dice Roll &rarr;</h2>
                      <p>Roll a 100 sided Die to win some TRX</p>
                  </a>
              </Link>
          </div>
            <ConnectWalletButton />
        </main>

        <footer className={styles.footer}>
          <a href="https://www.tronlink.org/" rel="noopener noreferrer" target="_blank">
            Check out tronlink.org
          </a>
        </footer>
      </div>
  );
};

export default Home;

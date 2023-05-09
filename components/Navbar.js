import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <a className={styles.logo}>LedgerLuck</a>
      </Link>
      <div className={styles.navLinks}>
        <Link href="/CoinFlip">
          <a className={styles.navLink}>CoinFlip</a>
        </Link>
          <Link href="/DiceRoll">
              <a className={styles.navLink}>DiceRoll</a>
          </Link>
        <Link href="/Contract">
            <a className={styles.navLink}>Smart Contracts</a>
         </Link>
      </div>
      <ConnectButton />
    </nav>
  );
};

export default Navbar;

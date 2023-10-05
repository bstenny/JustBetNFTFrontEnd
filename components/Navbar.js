import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <a className={styles.logo}>JustBet</a>
      </Link>
      <div className={styles.navLink}>
          <Link href="/DiceRoll">
              <a className={styles.navLink}>DiceRoll</a>
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;

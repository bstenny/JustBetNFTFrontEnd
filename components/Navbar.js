import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <a className={styles.logo}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/justbetontron.png" alt="JustBetOnTron Logo" width={50} height={50} />
            <span>JustBetOnTron</span>
          </div>
        </a>
      </Link>
      <div className={styles.navLinks}>
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

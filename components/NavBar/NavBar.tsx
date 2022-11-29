import styles from './NavBar.module.scss'
import { FaRegUser, FaRegStar, FaSearch } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import { GoPackage } from 'react-icons/go';
import Image from 'next/future/image';
import Link from 'next/link';

const NavBar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logoButtonContainer}>
                <Link href='/' passHref legacyBehavior>
                    <a>
                        <Image src={'/images/duckLogo.png'} width={56} height={40} className={styles.logoImage} alt='Duck Shop Logo' />
                    </a>
                </Link>
            </div>

            <ul className={styles.navContainer}>
                <a href="#" className={styles.navIconContainer}>
                    <FaRegUser className={styles.navIcon} size={50} />
                </a>
                <a href="#" className={styles.navIconContainer}>
                    <GoPackage className={styles.navIcon} size={50} />
                </a>
                <a href="#" className={styles.navIconContainer}>
                    <FaRegStar className={styles.navIcon} size={50} />
                </a>
                <a href="#" className={styles.navIconContainer}>
                    <IoCartOutline className={styles.navIcon} size={50} />
                </a>
            </ul>

            <div className={styles.searchBarContainer}>
                <div className={styles.searchBarWrapper}>
                    <input type="text" className={styles.searchBarInput} size={1} />
                    <button type='button' className={styles.searchButton}><FaSearch size={30} className={styles.searchIcon} /></button>
                </div>

            </div>
        </div>
    );
}

export default NavBar;
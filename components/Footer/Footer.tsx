import styles from './Footer.module.scss'
import { FaFacebookSquare, FaInstagram, FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className={styles.footer}>

            <ul>
                <li>Home</li>
                <li>Browse</li>
                <li>Best Selling</li>
                <li>Get the app</li>
                <li>FAQ</li>
            </ul>

            <ul>
                <li>About Us</li>
                <li>Duck Doctor</li>
                <li>Customize</li>
                <li>Track Order</li>
                <li>Events</li>
            </ul>

            <ul className={styles.socials}>
                <li>
                    <a href="https://www.facebook.com">
                        <FaFacebookSquare size={25} />
                    </a>
                </li>

                <li>
                    <a href="https://www.instagram.com">
                        <FaInstagram size={25} />
                    </a>
                </li>

                <li>
                    <a href="https://www.github.com">
                        <FaGithub size={25} className={styles.active} />
                    </a>
                </li>

                <li>
                    <a href="https://www.twitter.com">
                        <FaTwitter size={25} />
                    </a>
                </li>

                <li>
                    <a href="https://www.youtube.com">
                        <FaYoutube size={25} />
                    </a>
                </li>

            </ul>

        </footer>
    );
}

export default Footer;
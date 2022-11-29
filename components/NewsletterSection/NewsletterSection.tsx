import styles from './NewsletterSection.module.scss';

const NewsletterSection = () => {
    return (
        <div className={styles.newsletterSection}>
            <h2 className={styles.newsletterHeader}>Join our newsletter</h2>
            <p className={styles.newsletterText}>
                Recieve 20% off your first purchase when
                you join our newsletter. We’ll let you know
                when any new ducks become available.
            </p>

            <form action="" className={styles.newsletterForm}>
                <label htmlFor="newsletterEmail" className={styles.hiddenLabel}>Email</label>
                <input type="email" name="newsletterEmail" id="newsletterEmail" placeholder='email' className={styles.newsletterEmail} />
                <input type="submit" className={styles.newsletterSubmit} value='SUBSCRIBE' />
            </form>

        </div>
    );
}

export default NewsletterSection;
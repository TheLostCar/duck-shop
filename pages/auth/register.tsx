import useMessage from '@hooks/useMessage';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import styles from '@styles/RegisterPage.module.scss';

const Register = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useMessage();

    const handleSubmit = () => {
        setMessage(null);
        if (password !== confirmPassword) return setMessage('Passwords are not identical', true);

        fetch('/api/auth/register', {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                username,
                password
            })
        })
            .then(res => {
                if (!res.ok) return res.json().then(e => { throw new Error(e.message) })
                return res.json()
            })
            .then(res => {
                setMessage(res.message, false)
            })
            .catch(e => {
                setMessage(e.message, true)
            })

    }

    return (
        <div className={styles.container}>
            <h1>Register</h1>
            <div className={styles.wrapper}>
                <form className={styles.form} >
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name='username' minLength={4} value={username} onChange={e => setUsername(e.currentTarget.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name='password' minLength={8} value={password} onChange={e => setPassword(e.currentTarget.value)} />

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.currentTarget.value)} />

                    <button type='button' className={styles.submitButton} onClick={handleSubmit}>Register</button>


                </form>

            </div>

            <span className={`${styles.message} ${message?.isError && styles.isError}`}>
                {message?.message && message.message}
            </span>



        </div>
    );
}

export default Register;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const session = await getSession({ req });
    if (session) return {
        redirect: {
            permanent: false,
            destination: "/admin/dashboard"
        }
    };
    return {
        props: {}
    };
}
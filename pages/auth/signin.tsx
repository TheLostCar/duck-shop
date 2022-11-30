import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { signIn, getSession, getCsrfToken } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/router'
import styles from '@styles/SignInPage.module.scss';
import { getToken } from "next-auth/jwt";
import useMessage from "@hooks/useMessage";


const Signin = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useMessage();
    const router = useRouter();

    const handleSubmit = async () => {
        await signIn('credentials', { username, password, redirect: false })
            .then(r => {
                if (r === undefined) return setMessage('failed', true)
                if (r.error) {
                    setMessage(r.error, true);
                } else {
                    setMessage('SignIn successfull redirecting. . .', false)
                    router.push('/admin/dashboard')
                }
            })

    }
    return (
        <div className={styles.container}>
            <h1>Sign In</h1>
            <div className={styles.wrapper}>
                <form className={styles.form} >
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name='username' minLength={4} value={username} onChange={e => setUsername(e.currentTarget.value)} />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name='password' minLength={8} value={password} onChange={e => setPassword(e.currentTarget.value)} />

                    <button type='button' className={styles.submitButton} onClick={handleSubmit}>Sign In</button>


                </form>

            </div>

            <span className={`${styles.message} ${message?.isError && styles.isError}`}>
                {message?.message && message.message}
            </span>

        </div>
    );
}

export default Signin;

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
        props: {},
    };
}
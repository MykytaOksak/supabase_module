/* pages/sign-in.js */
import { useState } from 'react'
import styles from '../styles/Home.module.scss'

import { supabase } from '../client'

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    const [isSignIn, setIsSignIn] = useState(true)
    const [isSignUp, setIsSignUp] = useState(false)


    async function signUp() {
        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            alert(error.message)
        } else {
            setSubmitted(true)
        }
    }
    async function signIn() {
        const { error } = await supabase.auth.signIn({
            email: email,
            password: password
        })
        if (error) {
            alert(error.message)
        } else {
            setLoggedIn(true)
        }
    }
    function linkClickHandle() {
        if(isSignIn) {
            setIsSignIn(false)
            setIsSignUp(true)
        }
        else {
            setIsSignIn(true)
            setIsSignUp(false)            
        }
    }
    if (submitted) {
        return (
            <div className={styles.container}>
                <h1>Please check your email to sign in</h1>
            </div>
        )
    }
    if (loggedIn) {
        return (
            <div className={styles.container}>
                <h1>Successfully logged in</h1>
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {
                    isSignIn && (
                        <h1 className={styles.title} 
                            style={{marginBottom: 30}}>
                            Sign In
                        </h1>
                    )
                }
                {
                    isSignUp && (
                        <h1 className={styles.title} 
                            style={{marginBottom: 30}}>
                            Sign Up
                        </h1>
                    )
                }
                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        className={styles.input}
                        required={true}
                    />
                </div>
                <div className={styles.inputGroup}
                style={{marginTop: 0}}>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        className={styles.input}
                        required={true}
                    />
                </div>
                { 
                    isSignUp && (
                        <>
                            <button 
                                onClick={() => signUp()}
                                className={styles.btn}
                                style={{marginTop: 10}}>
                                Sign Up
                            </button> 
                            <span style={{marginTop: 5}}>
                                get back to {' '}
                                <a 
                                    className={styles.signUpLink}
                                    onClick={linkClickHandle}>
                                    sign in ➞
                                </a>
                            </span>
                        </>
                    )
                }
                {
                    isSignIn && (
                        <>
                            <button 
                                onClick={() => signIn()}
                                className={styles.btn}
                                style={{marginTop: 10}}>
                                Sign In
                            </button> 
                            <span style={{marginTop: 5}}>
                                don&apos;t have an account?{' '}
                                <a 
                                    className={styles.signUpLink}
                                    onClick={linkClickHandle}>
                                    Sign Up ➞
                                </a>
                            </span>
                        </>
                    )
                }
            </main>
        </div>  
    )
}

/* pages/_app.js */
import '../styles/globals.scss'
import styles from '../styles/Home.module.scss'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../client'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [authenticatedState, setAuthenticatedState] = useState('not-authenticated')
  useEffect(() => {
    /* fires when a user signs in or out */
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session)
      if (event === 'SIGNED_IN') {
        setAuthenticatedState('authenticated')
        router.push('/kyc')
      }
      if (event === 'SIGNED_OUT') {
        setAuthenticatedState('not-authenticated')
      }
    })
    checkUser()
    return () => {
      authListener.unsubscribe()
    }
  }, [])
  async function checkUser() {
    /* when the component loads, checks user to show or hide Sign In link */
    const user = await supabase.auth.user()
    if (user) {
      setAuthenticatedState('authenticated')
    }
  }
  async function handleAuthChange(event, session) {
    /* sets and removes the Supabase cookie */
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })
  }
  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }
  return (
    <div>
      <nav className={styles.navStyle}>
        <Link href="/">
          <a className={styles.linkStyle}>
            Home
          </a>
        </Link>
        <Link href="/kyc">
          <a className={styles.linkStyle}>
            KYC
          </a>
        </Link>
        {
          authenticatedState === 'not-authenticated' && (
            <Link href="/sign-in">
              <a className={styles.linkStyle}>
                Sign In
              </a>
            </Link>
          )
        }
        {
          authenticatedState === 'authenticated' && (
            <Link href="/">
              <a className={styles.linkStyle}
                 onClick={signOut}>
                 Sign Out
              </a>
            </Link>
          )
        }
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
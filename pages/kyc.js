/* pages/profile.js */
import { useState, useEffect } from 'react';
import { supabase } from '../client'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import {  faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Home.module.scss'

export default function Profile() {
  const [profile, setProfile] = useState([])
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const [photoIdSrc, setPhotoIdSrc] = useState('')

  async function fetchProfile() {
    const profileData = await supabase.auth.user()
    if (!profileData) {
      router.push('/sign-in')
    } else {
      setProfile(profileData)
    }
  }
  
  useEffect(() => {
    fetchProfile()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if(!submitted) {
      await supabase
      .from('kyc')
      .upsert([
        {
          id: profile.id,
          created_at: ((new Date()).toISOString()).toLocaleString('zh-TW'),
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          city: city, 
          country: country
        }
      ])

      setSubmitted(true)
    }
    else {
      await supabase
      .from('kyc')
      .upsert([
        {
          id: profile.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          city: city, 
          country: country
        }
      ])      
    }
  }

  async function handlePhotoUpload(file) {    
    const { data, error } = await supabase.storage
      .from('kyc')
      .upload(`id/${supabase.auth.user().id}.jpg`, file)

    if (error)
      console.log(error)
    else 
      setPhotoIdSrc(URL.createObjectURL(file))

  }

  if (!profile) return null
  if (submitted) {
    return (
      <div className={styles.container}>
          <h1>Information successfully submitted</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <h1 className={styles.title} style={{"marginBottom": 30}}>
            KYC
          </h1>

          <div className={styles.inputGroup}>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              onChange={e => setPhone(e.target.value)}
              className={styles.input}
              required={true}
            />
          </div>

          <div className={styles.inputGroupWrapper}>
            <div className={styles.smInputGroup}>
              <label>First name</label>
              <input
                type="text"
                name="fname"
                onChange={e => setFirstName(e.target.value)}
                className={styles.input}
                required={true}
              />
            </div>
            <div className={styles.smInputGroup}>
              <label>Last name</label>
              <input
                type="text"
                name="lname"
                onChange={e => setLastName(e.target.value)}
                className={styles.input}
                required={true}
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Country</label>
            <input
              type="text"
              name="country"
              onChange={e => setCountry(e.target.value)}
              className={styles.input}
              required={true}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>City</label>
            <input
              type="text"
              name="city"
              onChange={e => setCity(e.target.value)}
              className={styles.input}
              required={true}
            />
          </div>

          <div className={styles.inputGroup} style={{marginTop: 25}}>
            <label 
              htmlFor="photo-upload"
              className={styles.uploadLabel}>
              {
                photoIdSrc !== '' && (
                  <FontAwesomeIcon icon={faCheckSquare} />
                )
              }
              {
                photoIdSrc === '' && (
                  <FontAwesomeIcon icon={faCloudUploadAlt} />
                )
              }
              {' '}Upload ID
            </label>

            <input
              id="photo-upload"
              type="file"
              name="photo"
              accept="image/*"
              className={styles.inputImage}
              onChange={e => handlePhotoUpload(e.target.files[0])}
              required={true}/>
          </div> 


          <button
            className={styles.btn}
            style={{"marginTop": 20}}
            type="submit">
            Submit
          </button>
        </form>
      </main>
    </div>
  )
}
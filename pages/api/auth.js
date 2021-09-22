/* pages/api/auth.js */
import { supabase } from '../../client'

export default function handler(req, res) {
  supabase.auth.api.setAuthCookie(req, res)
}
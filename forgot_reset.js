// forgot_reset.js — shared logic for forgot_password.html and reset.html
// Requires a sibling supabaseClient.js exporting `supabase`.
import { supabase } from './supabaseClient.js'

const byId = (id) => document.getElementById(id)

// Page detection
const isForgot = !!byId('forgot-btn')
const isReset  = !!byId('set-pass')

if (isForgot) {
  const emailEl = /** @type {HTMLInputElement} */(byId('fp-email'))
  const btn = byId('forgot-btn')
  const msg = byId('msg')

  const updateDisabled = () => { btn.disabled = !emailEl.value || !emailEl.checkValidity() }
  emailEl.addEventListener('input', updateDisabled); updateDisabled()

  btn.addEventListener('click', async () => {
    btn.disabled = true
    msg.textContent = 'Sending reset link…'
    try {
      const email = emailEl.value.trim()
      // Redirect back to your GitHub Pages reset.html
      const redirectTo = `${window.location.origin}/budget-tracker/reset.html`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) throw error
      msg.textContent = 'Reset link sent. Check your email.'
    } catch (e) {
      console.error(e)
      msg.textContent = 'Could not send link: ' + (e?.message || 'Unknown error')
    } finally {
      updateDisabled()
    }
  })
}

if (isReset) {
  const passEl = /** @type {HTMLInputElement} */(byId('new-pass'))
  const btn = byId('set-pass')
  const msg = byId('msg')

  const updateDisabled = () => { btn.disabled = !passEl.value || !passEl.checkValidity() }
  passEl.addEventListener('input', updateDisabled); updateDisabled()

  // Exchange code for session (required on static hosts like GitHub Pages)
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(window.location.hash)
    if (error) {
      console.warn('exchangeCodeForSession:', error.message)
      msg.textContent = 'Open this page using the link from your email.'
    } else {
      msg.textContent = 'Enter a new password and click Set.'
    }
  } catch (e) {
    console.error(e)
  }

  btn.addEventListener('click', async () => {
    btn.disabled = true
    msg.textContent = 'Updating password…'
    try {
      const { error } = await supabase.auth.updateUser({ password: passEl.value })
      if (error) throw error
      msg.textContent = 'Password updated. You can sign in now.'
    } catch (e) {
      console.error(e)
      msg.textContent = 'Could not update password: ' + (e?.message || 'Unknown error')
    } finally {
      updateDisabled()
    }
  })
}

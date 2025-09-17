// main.js — hardened, no inline script needed
// Assumes ./supabaseClient.js exports: `export const supabase = createClient(...)`
import { supabase } from './supabaseClient.js'

const qs = (sel) => /** @type {HTMLElement} */(document.querySelector(sel))
const show = (id) => qs(id)?.classList.remove('hidden')
const hide = (id) => qs(id)?.classList.add('hidden')
const setText = (id, text) => { const el = qs(id); if (el) el.textContent = text }

async function refreshAuthView() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    hide('#view-signin'); hide('#view-signup'); show('#view-app')
    setText('#auth-state', `Signed in as ${session.user.email}`)
  } else {
    show('#view-signin'); show('#view-signup'); hide('#view-app')
    setText('#auth-state', 'Not signed in')
  }
}

function wireEvents() {
  qs('#btn-signin')?.addEventListener('click', async () => {
    setText('#signin-msg', 'Signing in…')
    try {
      const email = /** @type {HTMLInputElement} */(qs('#si-email')).value.trim()
      const pass  = /** @type {HTMLInputElement} */(qs('#si-pass')).value
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
      if (error) throw error
      setText('#signin-msg', 'Success!')
      await refreshAuthView()
    } catch (e) {
      console.error(e)
      setText('#signin-msg', 'Sign-in failed.')
    }
  })

  qs('#btn-signup')?.addEventListener('click', async () => {
    setText('#signup-msg', 'Creating account…')
    try {
      const email = /** @type {HTMLInputElement} */(qs('#su-email')).value.trim()
      const pass  = /** @type {HTMLInputElement} */(qs('#su-pass')).value
      const { error } = await supabase.auth.signUp({
        email, password: pass,
        options: {
          emailRedirectTo: `${window.location.origin}/budget-tracker/confirm.html`
        }
      })
      if (error) throw error
      setText('#signup-msg', 'Check your email to confirm.')
    } catch (e) {
      console.error(e)
      setText('#signup-msg', 'Sign-up failed.')
    }
  })

  qs('#btn-signout')?.addEventListener('click', async () => {
    try { await supabase.auth.signOut() } finally { await refreshAuthView() }
  })

  // Listen for auth changes (e.g., email confirmation flow)
  supabase.auth.onAuthStateChange(async (_event, _session) => {
    await refreshAuthView()
  })
}

async function initializeApp() {
  await refreshAuthView()
  wireEvents()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}

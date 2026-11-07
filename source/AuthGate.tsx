import { useEffect, useState, type FormEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import { Music2, Eye, EyeOff, ArrowRight, LockKeyhole, Mail, LogOut } from 'lucide-react';
import { supabase } from './supabase';
import Home from './App';

type Mode = 'signin' | 'signup' | 'forgot' | 'recovery';
const base = import.meta.env.BASE_URL;
export function friendlyError(error: unknown) {
  const e = error as {code?: string; message?: string};
  if (e.code === 'invalid_credentials') return 'The email or password is incorrect. Please try again.';
  if (e.code === 'email_not_confirmed') return 'Please confirm your email address before signing in.';
  if (e.code === 'user_already_exists') return 'An account with this email already exists. Please sign in.';
  if (e.code === 'over_email_send_rate_limit' || e.code === 'over_request_rate_limit') return 'Too many attempts. Please wait a few minutes and try again.';
  if (/fetch|network|load failed/i.test(e.message || '')) return 'We could not reach the sign-in service. Check your connection and try again.';
  return e.message || 'Something went wrong. Please try again.';
}
export default function AuthGate() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>(() => /type=recovery/.test(window.location.hash) ? 'recovery' : 'signin');
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  useEffect(() => {
    let mounted = true;
    let revision = 0;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted || event === 'INITIAL_SESSION') return;
      revision++;
      setUser(session?.user || null);
      setReady(true);
      setPassword(''); setConfirm('');
      if (event === 'PASSWORD_RECOVERY') setMode('recovery');
      if (event === 'SIGNED_OUT') setMode('signin');
    });
    const initialRevision = revision;
    supabase.auth.getSession().then(async ({data, error}) => {
      if (error) throw error;
      if (!data.session) return null;
      const result = await supabase.auth.getUser();
      if (result.error) throw result.error;
      return result.data.user;
    }).then(current => {
      if (mounted && initialRevision === revision) setUser(current);
    }).catch(e => { if (mounted && initialRevision === revision) {setUser(null); setError(friendlyError(e));} })
      .finally(() => { if (mounted) setReady(true); });
    return () => {mounted = false; subscription.unsubscribe();};
  }, []);
  function changeMode(next: Mode) {
    setMode(next); setPassword(''); setConfirm(''); setVisible(false); setError(''); setNotice('');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(''); setNotice('');
    if ((mode === 'signup' || mode === 'recovery') && password.length < 8) {setError('Use a password with at least 8 characters.'); return;}
    if ((mode === 'signup' || mode === 'recovery') && password !== confirm) {setError('The passwords do not match.'); return;}
    setBusy(true);
    try {
      const address = email.trim().toLowerCase();
      if (mode === 'signin') {
        const {data, error} = await supabase.auth.signInWithPassword({email: address, password});
        if (error) throw error;
        if (!data.session) throw new Error('Please try signing in again.');
        setUser(data.user); setPassword('');
      } else if (mode === 'signup') {
        const {data, error} = await supabase.auth.signUp({email: address, password, options: {emailRedirectTo: new URL(base, window.location.origin).href}});
        if (error) throw error;
        setPassword(''); setConfirm('');
        if (data.session) setUser(data.user);
        else {setMode('signin'); setNotice('Check your email to confirm your account, then sign in.');}
      } else if (mode === 'forgot') {
        const {error} = await supabase.auth.resetPasswordForEmail(address, {redirectTo: new URL(base, window.location.origin).href});
        if (error) throw error;
        setNotice('If an account exists for this email, you’ll receive a password reset link.');
      } else {
        const {error} = await supabase.auth.updateUser({password});
        if (error) throw error;
        setPassword(''); setConfirm(''); setMode('signin');
      }
    } catch (e) { setError(friendlyError(e)); }
    finally {setBusy(false);}
  }
  async function signOut() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const {error} = await supabase.auth.signOut({scope:'local'});
      if (error) throw error;
      setUser(null); changeMode('signin');
    } catch (e) {setError(friendlyError(e));}
    finally {setBusy(false);}
  }
  if (!ready) return <div className="auth-loading" role="status"><Music2 size={28}/><p>Opening Bible Songs…</p></div>;
  if (user && mode !== 'recovery') return <><Home key={user.id} user={user} onSignOut={signOut} signingOut={busy}/>{error && <div className="toast" role="alert">{error}<button aria-label="Dismiss" onClick={()=>setError('')}>×</button></div>}</>;
  const titles = {signin:'Welcome back.', signup:'Begin your listening journey.', forgot:'Find your way back.', recovery:'Choose a new password.'};
  return <main className="auth-page">
    <section className="auth-story" style={{backgroundImage:`linear-gradient(180deg,rgba(17,41,32,.28),rgba(17,41,32,.83)),url(${base}lake.jpg)`}}>
      <a href={base} className="auth-brand"><Music2 size={25}/>Bible Songs</a>
      <div className="auth-story-content"><span className="auth-kicker">SCRIPTURE. SET TO MUSIC.</span><h1>Let the Word<br/>move you.</h1><p>Slow down. Listen deeply.<br/>Experience the Bible, one song at a time.</p></div>
      <div className="auth-verse">“Let the word of Christ dwell in you richly.”<span>COLOSSIANS 3:16</span></div>
    </section>
    <section className="auth-form-side">
      <div className="auth-card">
        <a href={base} className="auth-mobile-brand"><Music2 size={23}/>Bible Songs</a>
        <span className="auth-kicker">A MOMENT WITH THE WORD</span><h2>{titles[mode]}</h2>
        <p className="auth-intro">{mode==='signin'?'Sign in to listen to Scripture and keep your favorite chapters close.':mode==='signup'?'Create your Bible Songs account with your email and password.':mode==='forgot'?'Enter your email and we’ll send you a password reset link.':'Use at least 8 characters to keep your account secure.'}</p>
        <form onSubmit={submit} className="auth-form">
          <fieldset disabled={busy}>
            {mode!=='recovery' && <label htmlFor="auth-email">Email address<div className="auth-field"><Mail size={17}/><input id="auth-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}/></div></label>}
            {mode!=='forgot' && <label htmlFor="auth-password">{mode==='recovery'?'New password':'Password'}<div className="auth-field"><LockKeyhole size={17}/><input id="auth-password" name="password" type={visible?'text':'password'} autoComplete={mode==='signin'?'current-password':'new-password'} placeholder={mode==='signin'?'Enter your password':'At least 8 characters'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={mode==='signin'?undefined:8} maxLength={128}/><button className="auth-reveal" type="button" aria-label={visible?'Hide password':'Show password'} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>}
            {(mode==='signup'||mode==='recovery') && <label htmlFor="auth-confirm">Confirm password<div className="auth-field"><LockKeyhole size={17}/><input id="auth-confirm" name="confirm-password" type={visible?'text':'password'} autoComplete="new-password" placeholder="Enter your password again" value={confirm} onChange={e=>setConfirm(e.target.value)} required minLength={8} maxLength={128}/></div></label>}
            {mode==='signin' && <button className="auth-forgot" type="button" onClick={()=>changeMode('forgot')}>Forgot password?</button>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            {notice && <p className="auth-notice" role="status">{notice}</p>}
            <button className="auth-submit" type="submit">{busy?'Please wait…':mode==='signin'?'Sign in':mode==='signup'?'Create account':mode==='forgot'?'Send reset link':'Save new password'}{!busy&&<ArrowRight size={18}/>}</button>
          </fieldset>
        </form>
        {mode==='signin'?<p className="auth-switch">New to Bible Songs? <button disabled={busy} onClick={()=>changeMode('signup')}>Create an account</button></p>:mode==='signup'?<p className="auth-switch">Already have an account? <button disabled={busy} onClick={()=>changeMode('signin')}>Sign in</button></p>:mode==='forgot'?<p className="auth-switch"><button disabled={busy} onClick={()=>changeMode('signin')}>Back to sign in</button></p>:<p className="auth-switch"><button disabled={busy} onClick={signOut}><LogOut size={13}/> Cancel and sign out</button></p>}
        <div className="auth-footnote"><LockKeyhole size={13}/> Your account is secured by Supabase.</div>
      </div>
      <p className="auth-bottom copyright-notice">© 2026 Bible Songs. All rights reserved. Third-party content belongs to its respective owners.</p>
    </section>
  </main>;
}

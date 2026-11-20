import { Router } from 'express';
import crypto from 'node:crypto';
const router=Router();
// Démo OAuth : en production, utilisez une session serveur persistante et des cookies HttpOnly/Secure.
const states=new Map();
router.get('/github',(req,res)=>{
  if(!process.env.GITHUB_CLIENT_ID||process.env.GITHUB_CLIENT_ID==='replace_me') return res.status(503).send('Configurez GITHUB_CLIENT_ID et GITHUB_CLIENT_SECRET dans server/.env');
  const state=crypto.randomBytes(24).toString('hex'); states.set(state,Date.now());
  const url=new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id',process.env.GITHUB_CLIENT_ID);
  url.searchParams.set('scope','public_repo read:user');
  url.searchParams.set('state',state);
  res.redirect(url.toString());
});
router.get('/github/callback',async(req,res)=>{
  const {code,state}=req.query; const created=states.get(String(state)); states.delete(String(state));
  if(!code||!created||Date.now()-created>10*60*1000) return res.status(400).send('État OAuth invalide ou expiré.');
  try {
    const tokenRes=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({client_id:process.env.GITHUB_CLIENT_ID,client_secret:process.env.GITHUB_CLIENT_SECRET,code,state})});
    const data=await tokenRes.json(); if(!tokenRes.ok||!data.access_token) throw new Error('OAuth failed');
    // Prototype uniquement : remplacez par session serveur sécurisée avant déploiement public.
    res.cookie('gh_token',data.access_token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:3600000});
    res.redirect(process.env.CLIENT_URL||'http://localhost:5173');
  } catch { res.status(502).send('Connexion GitHub impossible.'); }
});
router.post('/logout',(req,res)=>{res.clearCookie('gh_token');res.json({ok:true});});
export default router;

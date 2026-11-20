import React, { useEffect, useState } from 'react';
import { Github, Rocket, LayoutDashboard, FolderGit2, Settings, ExternalLink, RefreshCw, ShieldCheck, Globe2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export default function App() {
  const [repos,setRepos] = useState([]);
  const [projects,setProjects] = useState([]);
  const [loading,setLoading] = useState(false);
  const [notice,setNotice] = useState('Connectez GitHub pour importer vos dépôts publics.');
  const [tab,setTab] = useState('overview');
  const [connected,setConnected] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [r,p] = await Promise.all([
        fetch(`${API}/api/github/repos`,{credentials:'include'}),
        fetch(`${API}/api/projects`,{credentials:'include'})
      ]);
      if (r.ok) { const d=await r.json(); setRepos(d.repos||[]); setConnected(true); }
      if (p.ok) { const d=await p.json(); setProjects(d.projects||[]); }
    } catch { setNotice('API non joignable. Démarrez le serveur ou configurez VITE_API_URL.'); }
    finally { setLoading(false); }
  }
  useEffect(()=>{load()},[]);
  async function deploy(repo) {
    try {
      const res=await fetch(`${API}/api/projects`,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({repoFullName:repo.full_name,branch:repo.default_branch})});
      const data=await res.json(); if(!res.ok) throw new Error(data.error||'Échec');
      setNotice(`Projet ajouté : ${repo.name}`); load();
    } catch(e) { setNotice(e.message); }
  }
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brandIcon"><Rocket size={20}/></div><div><b>CamaraDeploy</b><small>STUDIO</small></div></div>
      <div className="navLabel">ESPACE DE TRAVAIL</div>
      <button className={tab==='overview'?'nav active':'nav'} onClick={()=>setTab('overview')}><LayoutDashboard size={18}/> Vue générale</button>
      <button className={tab==='projects'?'nav active':'nav'} onClick={()=>setTab('projects')}><FolderGit2 size={18}/> Mes projets</button>
      <button className={tab==='settings'?'nav active':'nav'} onClick={()=>setTab('settings')}><Settings size={18}/> Paramètres</button>
      <div className="sideBottom"><ShieldCheck size={17}/><span>Mode prototype sécurisé<br/><small>Ne pas publier de secrets</small></span></div>
    </aside>
    <main className="main">
      <header><div><span className="eyebrow">PLATEFORME DE DÉPLOIEMENT</span><h1>{tab==='overview'?'Vue générale':tab==='projects'?'Mes projets':'Paramètres'}</h1></div><button className="refresh" onClick={load}><RefreshCw size={16}/> Actualiser</button></header>
      <div className="notice">{notice}</div>
      {tab==='overview' && <>
        <section className="hero"><div><span className="pill"><span className="dot"/> CLOUD WORKSPACE</span><h2>Du dépôt GitHub<br/><em>à votre site web.</em></h2><p>Importez vos projets et préparez leur déploiement depuis un seul espace.</p><button className="primary" onClick={()=>location.href=`${API}/api/auth/github`}><Github size={18}/> Connecter GitHub</button></div><div className="heroArt"><div className="orbit o1"/><div className="orbit o2"/><div className="rocket"><Rocket size={54}/></div><div className="tag">BUILD · DEPLOY · GROW</div></div></section>
        <div className="stats"><div className="stat"><span>PROJETS</span><b>{projects.length}</b><small>Dans votre espace</small></div><div className="stat"><span>DÉPÔTS PUBLICS</span><b>{repos.length}</b><small>Disponibles sur GitHub</small></div><div className="stat"><span>ÉTAT DU COMPTE</span><b className="status">{connected?'Connecté':'En attente'}</b><small>Connexion GitHub</small></div></div>
        <section className="sectionHead"><div><span className="eyebrow">SOURCE CODE</span><h3>Dépôts GitHub</h3></div><span className="subtle">Dépôts publics accessibles</span></section>
        {!repos.length?<div className="empty"><Github size={30}/><b>Aucun dépôt affiché</b><p>Connectez GitHub pour charger vos dépôts publics.</p></div>:<div className="repoGrid">{repos.map(repo=><article className="repo" key={repo.id}><div className="repoTop"><Github size={19}/><span>{repo.language||'Code'}</span></div><h4>{repo.name}</h4><p>{repo.description||'Aucune description fournie.'}</p><div className="repoFoot"><small>★ {repo.stargazers_count} · {repo.default_branch}</small><button onClick={()=>deploy(repo)}>Ajouter <ExternalLink size={13}/></button></div></article>)}</div>}
      </>}
      {tab==='projects' && <section className="projectList">{projects.length?projects.map(p=><div className="projectRow" key={p.id}><Globe2/><div><b>{p.repoFullName}</b><small>{p.status}</small></div><span>{p.url||'En attente de déploiement'}</span></div>):<div className="empty">Vos projets importés apparaîtront ici.</div>}</section>}
      {tab==='settings' && <div className="empty"><ShieldCheck size={30}/><b>Paramètres de sécurité</b><p>Les clés OAuth doivent rester côté serveur dans un fichier .env non versionné.</p></div>}
      <footer>© 2026 CamaraDeploy Studio <span>Conçu pour bâtir sur le web.</span></footer>
    </main>
  </div>;
}

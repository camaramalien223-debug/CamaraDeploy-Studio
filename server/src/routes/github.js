import { Router } from 'express';
const router=Router();
router.get('/repos',async(req,res)=>{
  const token=req.cookies?.gh_token;
  if(!token) return res.status(401).json({error:'Connectez GitHub.'});
  try {
    const response=await fetch('https://api.github.com/user/repos?visibility=public&sort=updated&per_page=50',{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
    if(!response.ok) return res.status(response.status).json({error:'GitHub a refusé la requête.'});
    const repos=await response.json();
    res.json({repos:repos.filter(r=>!r.private).map(({id,name,full_name,description,language,stargazers_count,default_branch,html_url})=>({id,name,full_name,description,language,stargazers_count,default_branch,html_url}))});
  } catch {res.status(502).json({error:'API GitHub indisponible.'});}
});
export default router;

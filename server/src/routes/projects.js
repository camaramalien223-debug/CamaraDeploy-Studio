import { Router } from 'express';
import { addProject, listProjects } from '../services/projectStore.js';
const router=Router();
router.get('/',(_req,res)=>res.json({projects:listProjects()}));
router.post('/',(req,res)=>{
  const {repoFullName,branch='main'}=req.body||{};
  if(typeof repoFullName!=='string'||!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repoFullName)) return res.status(400).json({error:'Nom de dépôt invalide.'});
  if(typeof branch!=='string'||branch.length>100||!/^[A-Za-z0-9._/-]+$/.test(branch)) return res.status(400).json({error:'Branche invalide.'});
  res.status(201).json({project:addProject({repoFullName,branch})});
});
export default router;

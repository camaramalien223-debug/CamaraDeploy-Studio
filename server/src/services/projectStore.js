import crypto from 'node:crypto';
const projects=[];
export function listProjects(){return [...projects];}
export function addProject({repoFullName,branch}) {
  const project={id:crypto.randomUUID(),repoFullName,branch,status:'queued',url:null,createdAt:new Date().toISOString()};
  projects.unshift(project); return project;
}

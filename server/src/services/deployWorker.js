/*
 * Point d'extension du worker de déploiement.
 * Ne pas exécuter le code de dépôts non fiables dans le processus API.
 * Utilisez un runner isolé (conteneur éphémère non privilégié), quotas stricts,
 * système de fichiers temporaire et réseau sortant limité.
 */
export async function deployProject(project) {
  throw new Error('Worker non configuré : ajoutez un runner de build isolé avant tout déploiement réel.');
}

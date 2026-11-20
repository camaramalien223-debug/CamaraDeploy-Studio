function requireAuth(req, res, next) {
  if (!req.session || !req.session.user || !req.session.accessToken) {
    return res.status(401).json({ message: "Connectez-vous avec GitHub pour continuer." });
  }
  next();
}
module.exports = { requireAuth };

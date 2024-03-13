// authRoutes.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Ruta de autenticación de Spotify
router.get('/spotify', passport.authenticate('spotify', {
  scope: ['user-top-read', 'user-follow-read', 'user-read-recently-played'], // Permisos requeridos para obtener el top de artistas
}));

// Ruta de redireccionamiento después de la autenticación de Spotify
router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), function(req, res) {
  // Redirige al usuario a la página de inicio después de la autenticación exitosa
  res.redirect('/');
});

module.exports = router;

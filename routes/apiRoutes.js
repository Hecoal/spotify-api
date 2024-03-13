// apiRoutes.js
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const router = express.Router();

// Middleware para verificar la autenticación del usuario
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/auth/spotify');
  }
}


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/spotify/callback' // URL de redireccionamiento después de la autenticación
});

// Ruta protegida para obtener el top de artistas más escuchados
router.get('/top-artists', isAuthenticated, async (req, res) => {
  try {
    spotifyApi.setAccessToken(req.user.accessToken);

    const response = await spotifyApi.getMyTopArtists({ limit: 10 });
    const topArtists = response.body.items.map(artist => ({
      name: artist.name,
      imageUrl: artist.images.length ? artist.images[0].url : null,
    }));
    res.json(topArtists);
  } catch (error) {
    console.error('Error al obtener el top de artistas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el top de artistas' });
  }
});

// Ruta protegida para obtener las últimas 10 canciones reproducidas
router.get('/recent-tracks', isAuthenticated, async (req, res) => {
  try {
    spotifyApi.setAccessToken(req.user.accessToken);

    const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 });
    const recentTracks = response.body.items.map(track => ({
      name: track.track.name,
      artist: track.track.artists.map(artist => artist.name).join(', '),
    }));
    res.json(recentTracks);
  } catch (error) {
    console.error('Error al obtener las últimas canciones reproducidas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las últimas canciones reproducidas' });
  }
});

// Ruta protegida para obtener el top de canciones más escuchadas
router.get('/top-tracks', isAuthenticated, async (req, res) => {
  try {
    spotifyApi.setAccessToken(req.user.accessToken);


    const response = await spotifyApi.getMyTopTracks({ limit: 10 });
    const topTracks = response.body.items.map(track => ({
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
    }));
    res.json(topTracks);
  } catch (error) {
    console.error('Error al obtener el top de canciones:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el top de canciones' });
  }
});
module.exports = router;

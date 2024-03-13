require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const session = require('express-session');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const morgan = require ('morgan');
const express = require ('express');
const app = express();


//Env
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

//Routes
const authRoutes = require('./routes/authRoutes.js');
const apiRoutes = require('./routes/apiRoutes.js');


//Sessions
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

// Passoport / Passport session
app.use(passport.initialize());
app.use(passport.session());

// Auth Passport Spotify
passport.use(
    new SpotifyStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: 'http://localhost:3000/auth/spotify/callback',// URL de redireccionamiento después de la autenticación
        scope:['user-top-read', 'user-follow-read', 'user-read-recently-played']
      },
      function(accessToken, refreshToken, expires_in, profile, done) {
        profile.accessToken = accessToken;
        done(null, profile);
      }
    )
  );


// Serializa y deserializa al usuario
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//app.use(morgan);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Página de inicio
app.get('/', (req, res) => {
  res.send('¡Hola!');
});


app.listen(process.env.PORT || 3000,()=>{
    console.log('Server is running...');
});
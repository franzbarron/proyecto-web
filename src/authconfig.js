const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbController = require('./dbcontroller');

const db = new dbController();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      const { sub: id, name, picture, email, given_name } = profile._json;
      const profileData = { id, name, picture, email, given_name };
      const user = await db.findUser(id);
      console.log('Hello from Google Strategy');
      if (!user) db.addUser(id, name, picture, email);
      return done(null, profileData);
    }
  )
);

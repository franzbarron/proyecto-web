const express = require('express');
const passport = require('passport');

const router = express.Router();

require('./authconfig');

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(`Hello from GET /callback`);
    res.redirect('/home');
  }
);

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/logout', (req, res) => {
  req.session = null;
  req.logOut();
  res.redirect('/');
});

module.exports = router;
